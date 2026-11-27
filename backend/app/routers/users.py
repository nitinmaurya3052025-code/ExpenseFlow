from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from pydantic import BaseModel, EmailStr, Field

from app.database import get_db
from app.models.user import User
from app.models.expense import Expense
from app.models.category import Category

from app.schemas.user import UserCreate
from app.security import hash_password, verify_password
from app.auth import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


class ProfileUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:
        raise HTTPException(400, "Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }


@router.put("/me")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(User).filter(
        func.lower(User.email) == data.email.lower(),
        User.id != current_user.id
    ).first()

    if existing:
        raise HTTPException(400, "Email already in use")

    current_user.name = data.name.strip()
    current_user.email = data.email

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }


@router.put("/me/password")
def change_password(
    data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(
        data.current_password,
        current_user.password_hash
    ):
        raise HTTPException(400, "Current password is incorrect")

    current_user.password_hash = hash_password(data.new_password)

    db.commit()

    return {"message": "Password changed successfully"}


@router.delete("/me")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Delete user's expenses and categories first
    db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).delete(synchronize_session=False)

    db.query(Category).filter(
        Category.user_id == current_user.id
    ).delete(synchronize_session=False)

    db.delete(current_user)
    db.commit()

    return {"message": "Account deleted successfully"}