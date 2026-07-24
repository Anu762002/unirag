from fastapi import APIRouter, HTTPException, Depends, status
from backend.db.mongodb import db_manager
from backend.auth.security import get_password_hash, verify_password, create_access_token
from backend.auth.deps import get_current_user
from backend.schemas.api_schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register_user(request: UserRegisterRequest):
    """
    Registers a new student account. Public registrations are strictly restricted to the 'student' role for security.
    """
    existing_user = await db_manager.get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Security Enforcement: Public registration is ALWAYS forced to 'student' role
    hashed_pwd = get_password_hash(request.password)

    user_doc = {
        "email": request.email.strip().lower(),
        "hashed_password": hashed_pwd,
        "full_name": request.full_name.strip(),
        "role": "student"
    }

    created_user = await db_manager.create_user(user_doc)

    user_resp = UserResponse(
        id=str(created_user.get("_id")),
        email=created_user["email"],
        full_name=created_user["full_name"],
        role=created_user["role"],
        created_at=created_user.get("created_at", "")
    )

    access_token = create_access_token(data={"sub": user_resp.email, "role": user_resp.role})

    return TokenResponse(access_token=access_token, token_type="bearer", user=user_resp)

@router.post("/login", response_model=TokenResponse)
async def login_user(request: UserLoginRequest):
    """
    Authenticates user with email & password and returns JWT access token.
    """
    user = await db_manager.get_user_by_email(request.email)
    if not user or not verify_password(request.password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    user_resp = UserResponse(
        id=str(user.get("_id")),
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        created_at=user.get("created_at", "")
    )

    access_token = create_access_token(data={"sub": user_resp.email, "role": user_resp.role})

    return TokenResponse(access_token=access_token, token_type="bearer", user=user_resp)

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """
    Returns profile information of currently authenticated user.
    """
    return UserResponse(
        id=str(current_user.get("_id")),
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=current_user["role"],
        created_at=current_user.get("created_at", "")
    )
