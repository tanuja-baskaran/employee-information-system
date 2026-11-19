# Employee Information System

A full-stack Employee Information System built using **Python, FastAPI, PostgreSQL, SQLAlchemy, and React**. This application allows an admin to manage employee records through CRUD operations.

## Project Overview

The Employee Information System is designed to simplify employee record management. It allows an admin to register employees, view employee details, search records, update information, and manage employee deletion.

## Features

- **Create Employee:** Register new employees with their details.
- **View Employees:** Retrieve all active employee records.
- **Search Employees:** Search employees by ID or name.
- **Update Employee:** Modify existing employee information.
- **Soft Delete:** Deactivate employees without permanently removing their records.
- **Hard Delete:** Permanently remove employee records.
- **Input Validation:** Validate employee information using Pydantic.
- **Database Management:** Store employee information in PostgreSQL.

## Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API development |
| PostgreSQL | Relational database |
| SQLAlchemy | Object Relational Mapping (ORM) |
| Pydantic | Data validation |
| React.js | Frontend development |
| Vite | Frontend development server |
| Axios | HTTP requests |
| Git & GitHub | Version control |

## Project Structure

```text
employee-information-system/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── crud.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── EmployeeForm.jsx
│   │   ├── services/
│   │   │   └── employeeService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

## Database Design

**Database:** PostgreSQL

**Table:** employees

| Column | Data Type |
|---|---|
| id | Integer (Primary Key) |
| name | VARCHAR(100) |
| email | VARCHAR(255), Unique |
| department | VARCHAR(100) |
| designation | VARCHAR(100) |
| date_joined | DATE |
| is_active | BOOLEAN |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/employees` | Create employee |
| GET | `/employees` | Get all employees |
| GET | `/employees/{id}` | Get employee by ID |
| GET | `/employees/search?name=John` | Search by name |
| PUT | `/employees/{id}` | Update employee |
| PATCH | `/employees/{id}/deactivate` | Soft delete |
| DELETE | `/employees/{id}` | Hard delete |

## Installation and Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd employee-information-system
```

### 2. Set up the backend

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary "pydantic[email]"
```

### 3. Configure PostgreSQL

Create a database named:

```sql
CREATE DATABASE employee_db;
```

Configure your database connection in `app/database.py` using your PostgreSQL credentials.

Do not upload database passwords or other secrets to GitHub.

### 4. Run the backend

From the project root:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### 5. Set up the frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Install Axios:

```bash
npm install axios
```

### 6. Run the frontend

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

## Testing

Use FastAPI Swagger UI or Postman to test the API endpoints.

Test scenarios include:

- Register a new employee.
- Retrieve employee records.
- Search employees by name.
- Update employee information.
- Deactivate an employee.
- Permanently delete an employee.
- Validate duplicate email addresses and invalid requests.



