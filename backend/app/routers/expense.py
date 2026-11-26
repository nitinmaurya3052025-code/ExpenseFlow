from fastapi import APIRouter, Depends,HTTPException,status,Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate,ExpenseUpdate,ExpenseResponse,ExpenseMessage
from app.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", status_code=status.HTTP_201_CREATED,response_model=ExpenseMessage)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_expense = Expense(
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        date=expense.date,
        user_id=current_user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return {
        "message": "Expense created successfully",
        "expense_id": new_expense.id
    }
@router.get("/", response_model=list[ExpenseResponse])
def get_expenses(
    category: str | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
    )
    if category:
        query = query.filter(Expense.category == category)
    expenses = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return expenses
@router.get("/{expense_id}")
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        )
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense
@router.put("/{expense_id}",response_model=ExpenseMessage)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        )
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    if expense_data.amount is not None:
        expense.amount = expense_data.amount

    if expense_data.category is not None:
        expense.category = expense_data.category

    if expense_data.description is not None:
        expense.description = expense_data.description

    if expense_data.date is not None:
        expense.date = expense_data.date

    db.commit()
    db.refresh(expense)

    return {
        "message": "Expense updated successfully",
        "expense_id": expense.id
    }
@router.delete("/{expense_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        )
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    db.delete(expense)
    db.commit()