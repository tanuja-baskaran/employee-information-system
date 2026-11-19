
import { useEffect, useMemo, useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchEmployees = async () => {
    const response = await fetch("http://localhost:8000/employees?limit=100");
    if (!response.ok) throw new Error("Unable to load employee records.");
    return response.json();
  };

  const loadEmployees = async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setEmployees(await fetchEmployees());
    } catch (error) {
      setLoadError(error.message || "Unable to load employee records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchEmployees()
      .then((data) => {
        if (!cancelled) setEmployees(data);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message || "Unable to load employee records.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const departments = useMemo(
    () => new Set(employees.map((employee) => employee.department)).size,
    [employees],
  );

  const handleCreated = (employee) => {
    setEmployees((current) => [employee, ...current]);
    setNotice(`${employee.name} was registered successfully.`);
    window.setTimeout(() => setNotice(""), 4000);
  };

  const handleDeactivate = async (employee) => {
    if (!window.confirm(`Deactivate ${employee.name}?`)) return;
    try {
      const response = await fetch(`http://localhost:8000/employees/${employee.id}/deactivate`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Unable to deactivate this employee.");
      setEmployees((current) => current.filter((item) => item.id !== employee.id));
      setNotice(`${employee.name} was deactivated.`);
    } catch (error) {
      setLoadError(error.message || "Unable to deactivate this employee.");
    }
  };

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">E</div>
          <span>Employ<span className="brand-light">ly</span></span>
        </div>

        <p className="nav-heading">MENU</p>

        <nav>
          <a className="nav-link active" href="#overview">
            <span>▦</span> Overview
          </a>
          <a className="nav-link" href="#employees">
            <span>♙</span> Employees
          </a>
          <a className="nav-link" href="#registration">
            <span>＋</span> Add Employee
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <small>Admin account</small>
          </div>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Overview</p>
            <h1>Employee Management</h1>
          </div>
          <div className="top-profile">A</div>
        </header>

        <section className="welcome-section" id="overview">
          <div>
            <h2>Welcome back!</h2>
            <p>Manage your team and employee information in one place.</p>
          </div>
          <span className="date-label">
            Employee Workspace
          </span>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Employees</span>
            <h2>{isLoading ? "..." : employees.length}</h2>
            <small>Employee records</small>
          </div>

          <div className="stat-card">
            <span>Active Employees</span>
            <h2>{isLoading ? "..." : employees.filter((employee) => employee.is_active).length}</h2>
            <small>Currently active</small>
          </div>

          <div className="stat-card">
            <span>Departments</span>
            <h2>{isLoading ? "..." : departments}</h2>
            <small>Across the organization</small>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-section" id="registration">
            <div className="section-heading">
              <div>
                <h2>Add New Employee</h2>
                <p>Enter employee details to create a record.</p>
              </div>
              <span className="form-icon">＋</span>
            </div>

            <EmployeeForm onCreated={handleCreated} />
            {notice && <p className="form-message success" role="status">{notice}</p>}
          </div>

          <div className="info-card">
            <div className="info-icon">✦</div>
            <h3>Employee Information System</h3>
            <p>
              Keep employee records organized and
              manage your workforce efficiently.
            </p>

            <div className="info-divider"></div>

            <div className="info-item">
              <span>01</span>
              <p>Register employees</p>
            </div>
            <div className="info-item">
              <span>02</span>
              <p>Manage employee details</p>
            </div>
            <div className="info-item">
              <span>03</span>
              <p>Track active employees</p>
            </div>
          </div>
        </section>

        <section className="employees-section" id="employees">
          <div className="section-heading">
            <div>
              <h2>Employees</h2>
              <p>View and manage active employee records.</p>
            </div>
            <button className="refresh-button" type="button" onClick={loadEmployees}>Refresh</button>
          </div>
          {loadError && <p className="form-message error" role="alert">{loadError}</p>}
          {isLoading ? (
            <p className="empty-state">Loading employee records...</p>
          ) : employees.length === 0 ? (
            <p className="empty-state">No employees yet. Add your first employee above.</p>
          ) : (
            <div className="employee-table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Department</th><th>Designation</th><th>Joined</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td><strong>{employee.name}</strong><small>{employee.email}</small></td>
                      <td>{employee.department}</td>
                      <td>{employee.designation}</td>
                      <td>{employee.date_joined}</td>
                      <td><button className="table-action" type="button" onClick={() => handleDeactivate(employee)}>Deactivate</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>
          Employee Management System <span>·</span> Admin Workspace
        </footer>

      </main>
    </div>
  );
}

export default App;
