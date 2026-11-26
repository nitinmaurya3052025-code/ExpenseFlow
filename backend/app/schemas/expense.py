from datetime import date as date_type, datetime
from decimal import Decimal

from pydantic import BaseModel, Field, ConfigDict


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(gt=0)
    category: str
    description: str | None = None
    date: date_type


class ExpenseUpdate(BaseModel):
    amount: Decimal | None = Field(default=None, gt=0)
    category: str | None = None
    description: str | None = None
    date: date_type | None = None


class ExpenseResponse(BaseModel):
    id: int
    user_id: int
    amount: Decimal
    category: str
    description: str | None
    date: date_type
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ExpenseMessage(BaseModel):
    message: str
    expense_id: int