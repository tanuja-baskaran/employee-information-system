
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EmployeeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)
    designation: str = Field(..., min_length=1, max_length=100)
    date_joined: date


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    department: str | None = Field(default=None, min_length=1, max_length=100)
    designation: str | None = Field(default=None, min_length=1, max_length=100)
    date_joined: date | None = None


class EmployeeResponse(EmployeeBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
