from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy import extract
from app.auth import get_current_user
from app.database import get_db
from app.models.expense import Expense
from app.models.user import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)
@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_spent = (
        db.query(func.sum(Expense.amount))
        .filter(Expense.user_id == current_user.id)
        .scalar()
    )

    expense_count = (
        db.query(func.count(Expense.id))
        .filter(Expense.user_id == current_user.id)
        .scalar()
    )

    return {
        "total_spent": total_spent or 0,
        "expense_count": expense_count
    }
@router.get("/categories")
def get_category_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = (
        db.query(
            Expense.category,
            func.sum(Expense.amount).label("total")
        )
        .filter(Expense.user_id == current_user.id)
        .group_by(Expense.category)
        .all()
    )

    return [
        {
            "category": category,
            "total": total
        }
        for category, total in results
    ]
@router.get("/monthly")
def get_monthly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = (
        db.query(
            extract("year", Expense.date).label("year"),
            extract("month", Expense.date).label("month"),
            func.sum(Expense.amount).label("total")
        )
        .filter(Expense.user_id == current_user.id)
        .group_by(
            extract("year", Expense.date),
            extract("month", Expense.date)
        )
        .order_by(
            extract("year", Expense.date),
            extract("month", Expense.date)
        )
        .all()
    )

    return [
        {
            "month": f"{int(year):04d}-{int(month):02d}",
            "total": total
        }
        for year, month, total in results
    ]