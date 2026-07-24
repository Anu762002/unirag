import os
import certifi
from typing import Optional, Dict, Any, List
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from backend.config.settings import settings
from backend.auth.security import get_password_hash
from backend.utils.logger import logger

class MongoDBManager:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.is_connected = False
        self._fallback_users: Dict[str, Dict[str, Any]] = {}
        self._fallback_chat_history: List[Dict[str, Any]] = []

    async def connect(self):
        uri = settings.MONGODB_URI or os.environ.get("MONGODB_URI", "")
        if uri:
            try:
                # Add certifi tlsCAFile for macOS OpenSSL CA bundle resolution
                self.client = AsyncIOMotorClient(
                    uri,
                    serverSelectionTimeoutMS=5000,
                    tlsCAFile=certifi.where()
                )
                # Quick ping test
                await self.client.admin.command('ping')
                self.db = self.client[settings.MONGODB_DB_NAME]
                self.is_connected = True
                logger.info(f"Connected successfully to MongoDB Atlas: '{settings.MONGODB_DB_NAME}'")
                await self.seed_admin()
                return
            except Exception as e:
                logger.warning(f"MongoDB connection to '{uri}' timed out/failed: {e}. Using fallback in-memory store.")
        
        self.is_connected = False
        await self.seed_admin()

    async def seed_admin(self):
        """
        Seeds default System Administrator account if not already present.
        Email: admin@university.edu
        Password: admin123
        """
        admin_email = "admin@university.edu"
        existing = await self.get_user_by_email(admin_email)
        if not existing:
            admin_doc = {
                "email": admin_email,
                "hashed_password": get_password_hash("admin123"),
                "full_name": "System Administrator",
                "role": "admin"
            }
            await self.create_user(admin_doc)
            logger.info("Default Administrator account created: admin@university.edu / admin123")

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        email_clean = email.strip().lower()
        if self.is_connected and self.db is not None:
            try:
                user = await self.db.users.find_one({"email": email_clean})
                if user:
                    user["_id"] = str(user["_id"])
                return user
            except Exception as e:
                logger.error(f"Error querying MongoDB user: {e}")
        
        return self._fallback_users.get(email_clean)

    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        email_clean = user_data["email"].strip().lower()
        user_data["email"] = email_clean
        user_data["created_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if self.is_connected and self.db is not None:
            try:
                res = await self.db.users.insert_one(user_data)
                user_data["_id"] = str(res.inserted_id)
                return user_data
            except Exception as e:
                logger.error(f"Failed to insert user in MongoDB: {e}")
        
        # Fallback in-memory insertion
        user_data["_id"] = f"usr_{len(self._fallback_users) + 1}"
        self._fallback_users[email_clean] = user_data
        return user_data

    async def save_chat_message(self, user_id: str, question: str, answer: str, sources: List[Any]):
        doc = {
            "user_id": user_id,
            "question": question,
            "answer": answer,
            "sources": sources,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        if self.is_connected and self.db is not None:
            try:
                await self.db.chat_history.insert_one(doc)
                return
            except Exception as e:
                logger.error(f"Failed to save chat message in MongoDB: {e}")
        
        self._fallback_chat_history.append(doc)

    async def get_user_chat_history(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                cursor = self.db.chat_history.find({"user_id": user_id}).sort("timestamp", 1)
                history = await cursor.to_list(length=100)
                for h in history:
                    h["_id"] = str(h["_id"])
                return history
            except Exception as e:
                logger.error(f"Error reading chat history from MongoDB: {e}")
        
        return [h for h in self._fallback_chat_history if h.get("user_id") == user_id]

# Global MongoDB instance
db_manager = MongoDBManager()
