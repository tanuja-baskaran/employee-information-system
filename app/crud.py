from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from . import models, schemas


def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.model_dump())

    db.add(db_employee)

    try:
        db.commit()
        db.refresh(db_employee)
    except IntegrityError:
        db.rollback()
        raise

    return db_employee


def get_employees(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    include_inactive: bool = False,
):
    query = db.query(models.Employee)

    if not include_inactive:
        query = query.filter(models.Employee.is_active.is_(True))

    return query.offset(skip).limit(limit).all()


def get_employee_by_id(db: Session, employee_id: int):
    return (
        db.query(models.Employee)
        .filter(
            models.Employee.id == employee_id,
            models.Employee.is_active.is_(True),
        )
        .first()
    )

def search_employees_by_name(db: Session, name: str):
    return (
        db.query(models.Employee)
        .filter(
            models.Employee.name.ilike(f"%{name}%"),
            models.Employee.is_active.is_(True),
        )
        .all()
    )


def update_employee(
    db: Session,
    employee_id: int,
    employee_data: schemas.EmployeeUpdate,
):
    db_employee = (
        db.query(models.Employee)
        .filter(
            models.Employee.id == employee_id,
            models.Employee.is_active.is_(True),
        )
        .first()
    )

    if db_employee is None:
        return None

    update_data = employee_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_employee, key, value)

    try:
        db.commit()
        db.refresh(db_employee)
    except IntegrityError:
        db.rollback()
        raise

    return db_employee


def deactivate_employee(db: Session, employee_id: int):
    employee = (
        db.query(models.Employee)
        .filter(
            models.Employee.id == employee_id,
            models.Employee.is_active.is_(True),
        )
        .first()
    )

    if employee is None:
        return None

    employee.is_active = False

    try:
        db.commit()
        db.refresh(employee)
    except Exception:
        db.rollback()
        raise

    return employee


def delete_employee(db: Session, employee_id: int):
    employee = (
        db.query(models.Employee)
        .filter(models.Employee.id == employee_id)
        .first()
    )

    if employee is None:
        return None

    try:
        db.delete(employee)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return employee

