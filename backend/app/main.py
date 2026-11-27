import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, get_db
from app.models.user import User
from app.models.expense import Expense
from app.models.category import Category
from app.routers import users, auth, expense, dashboard, categories


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Application startup: database schema is managed via Alembic migrations
    yield


app = FastAPI(title="ExpenseFlow API", lifespan=lifespan)

# Allow CORS origins from environment variable or allow all origins for web deployment
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Default to accepting requests from local dev and any domain
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(users.router)
app.include_router(expense.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(categories.router)


@app.get("/")
def home():
    return {"message": "ExpenseFlow API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return {"message": "Database connected successfully"}