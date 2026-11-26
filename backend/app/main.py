from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, get_db

from app.models.user import User
from app.models.expense import Expense
from app.models.category import Category

from app.routers import users, auth, expense, dashboard, categories


app = FastAPI(title="ExpenseFlow API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create any missing tables without altering existing tables
Base.metadata.create_all(bind=engine)


app.include_router(users.router)
app.include_router(expense.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(categories.router)


@app.get("/")
def home():
    return {"message": "ExpenseFlow API is running"}


@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return {"message": "Database connected successfully"}