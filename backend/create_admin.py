import sys
import asyncio
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.db.mongodb import db_manager
from backend.auth.security import get_password_hash

async def main():
    if len(sys.argv) < 3:
        print("\nUsage:")
        print("  python create_admin.py <email> <password> [full_name]")
        print("\nExample:")
        print("  python create_admin.py dean@university.edu DeanPass123 \"Dean Architecture\"\n")
        return

    email = sys.argv[1].strip().lower()
    password = sys.argv[2]
    full_name = sys.argv[3] if len(sys.argv) > 3 else "University Administrator"

    await db_manager.connect()

    existing = await db_manager.get_user_by_email(email)
    if existing:
        print(f"User with email '{email}' already exists. Updating role to 'admin'...")
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.users.update_one(
                {"email": email},
                {"$set": {"role": "admin", "hashed_password": get_password_hash(password)}}
            )
        print(f"Successfully updated '{email}' to Administrator role!")
        return

    user_doc = {
        "email": email,
        "hashed_password": get_password_hash(password),
        "full_name": full_name,
        "role": "admin"
    }

    await db_manager.create_user(user_doc)
    print(f"\nSuccessfully created new Administrator account:\n  Email: {email}\n  Role: admin\n")

if __name__ == "__main__":
    asyncio.run(main())
