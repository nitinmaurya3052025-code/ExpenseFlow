from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.category import Category
from app.models.expense import Expense
from app.models.user import User
from app.auth import get_current_user

from pydantic import BaseModel, Field


router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


@router.get("/")
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    categories = db.query(Category).filter(
        Category.user_id == current_user.id
    ).all()

    results = []

    for category in categories:
        total = db.query(
            func.sum(Expense.amount)
        ).filter(
            Expense.user_id == current_user.id,
            Expense.category == category.name
        ).scalar() or 0

        count = db.query(
            func.count(Expense.id)
        ).filter(
            Expense.user_id == current_user.id,
            Expense.category == category.name
        ).scalar()

        results.append({
            "id": category.id,
            "name": category.name,
            "total_spent": float(total),
            "transaction_count": count
        })

    return results


@router.post("/")
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    name = data.name.strip()

    if not name:
        raise HTTPException(400, "Category name cannot be empty")

    existing = db.query(Category).filter(
        Category.user_id == current_user.id,
        func.lower(Category.name) == name.lower()
    ).first()

    if existing:
        raise HTTPException(400, "Category already exists")

    category = Category(
        name=name,
        user_id=current_user.id
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return {
        "message": "Category created successfully",
        "id": category.id,
        "name": category.name
    }


@router.put("/{category_id}")
def update_category(
    category_id: int,
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(404, "Category not found")

    new_name = data.name.strip()

    if not new_name:
        raise HTTPException(400, "Category name cannot be empty")

    duplicate = db.query(Category).filter(
        Category.user_id == current_user.id,
        func.lower(Category.name) == new_name.lower(),
        Category.id != category_id
    ).first()

    if duplicate:
        raise HTTPException(400, "Category already exists")

    old_name = category.name

    # Update existing expenses using the old category name
    db.query(Expense).filter(
        Expense.user_id == current_user.id,
        Expense.category == old_name
    ).update(
        {"category": new_name},
        synchronize_session=False
    )

    category.name = new_name

    db.commit()

    return {"message": "Category updated successfully"}


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(404, "Category not found")

    expenses_exist = db.query(Expense).filter(
        Expense.user_id == current_user.id,
        Expense.category == category.name
    ).first()

    if expenses_exist:
        raise HTTPException(
            400,
            "This category contains transactions. Reassign or delete those transactions first."
        )

    db.delete(category)
    db.commit()

    return {"message": "Category deleted successfully"}