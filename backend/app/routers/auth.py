from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.security import verify_password
from app.auth import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")

def login(

    form_data: OAuth2PasswordRequestForm = Depends(),

    db: Session = Depends(get_db)

):

    user = db.query(User).filter(

        User.email == form_data.username

    ).first()

    if not user:

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password"

        )

    if not verify_password(

        form_data.password,

        user.password_hash

    ):

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password"

        )

    access_token = create_access_token(user.id)

    return {

        "access_token": access_token,

        "token_type": "bearer"

    }
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }