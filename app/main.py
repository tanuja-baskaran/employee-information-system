
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from . import crud, schemas
from .database import get_db

app = FastAPI(title="Employee Information System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Employee Information System API is running"}


@app.post("/employees", response_model=schemas.EmployeeResponse, status_code=201)
def create_employee(
    employee: schemas.EmployeeCreate,
    db: Session = Depends(get_db),
):
    try:
        return crud.create_employee(db, employee)
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="An employee with this email may already exist",
        )

@app.get("/employees", response_model=list[schemas.EmployeeResponse])
def read_employees(
    skip: int = 0,
    limit: int = 10,
    include_inactive: bool = False,
    db: Session = Depends(get_db),
):
    if skip < 0:
        raise HTTPException(
            status_code=400,
            detail="skip must be zero or greater",
        )

    if not 1 <= limit <= 100:
        raise HTTPException(
            status_code=400,
            detail="limit must be between 1 and 100",
        )

    return crud.get_employees(
        db,
        skip=skip,
        limit=limit,
        include_inactive=include_inactive,
    )


@app.get("/employees/{employee_id}", response_model=schemas.EmployeeResponse)
def read_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    employee = crud.get_employee_by_id(db, employee_id)

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    return employee


@app.get("/employees/search", response_model=list[schemas.EmployeeResponse])
def search_employees(
    name: str,
    db: Session = Depends(get_db),
):
    employees = crud.search_employees_by_name(db, name)

    if not employees:
        raise HTTPException(
            status_code=404,
            detail="No employees found with this name",
        )

    return employees


@app.put(
    "/employees/{employee_id}",
    response_model=schemas.EmployeeResponse,
)
def update_employee(
    employee_id: int,
    employee: schemas.EmployeeUpdate,
    db: Session = Depends(get_db),
):
    try:
        updated_employee = crud.update_employee(
            db,
            employee_id,
            employee,
        )
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Email already belongs to another employee",
        )

    if updated_employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found or inactive",
        )

    return updated_employee


@app.patch(
    "/employees/{employee_id}/deactivate",
    response_model=schemas.EmployeeResponse,
)
def deactivate_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    employee = crud.deactivate_employee(db, employee_id)

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found or already inactive",
        )

    return employee


@app.delete("/employees/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    employee = crud.delete_employee(db, employee_id)

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    return {
        "message": "Employee permanently deleted successfully",
        "employee_id": employee_id,
    }
