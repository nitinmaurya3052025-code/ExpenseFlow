from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount = Column(Numeric(10, 2), nullable=False)

    category = Column(String(100), nullable=False)

    description = Column(String(500), nullable=True)

    date = Column(Date, nullable=False)

    created_at = Column(DateTime, server_default=func.now())