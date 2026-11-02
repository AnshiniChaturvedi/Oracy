from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.core.security import hash_password, verify_password

router = APIRouter()

class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignUpRequest):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not connected."
        )
    users_coll = db["users"]
    
    # Check if user already exists
    existing = await users_coll.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "name": payload.name.strip(),
        "email": payload.email.lower().strip(),
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc),
    }

    await users_coll.insert_one(user_doc)

    return UserResponse(id=user_id, name=user_doc["name"], email=user_doc["email"])


@router.post("/login", response_model=UserResponse)
async def login(payload: SignInRequest):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not connected."
        )
    users_coll = db["users"]

    # Check if user exists in database
    user = await users_coll.find_one({"email": payload.email.lower().strip()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not created"
        )

    # Verify password
    if not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )

    return UserResponse(
        id=str(user["_id"]),
        name=user.get("name", "User"),
        email=user["email"]
    )

