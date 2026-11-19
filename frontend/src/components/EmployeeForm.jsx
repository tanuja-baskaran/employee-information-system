
import { useState } from "react";

function EmployeeForm({ onCreated }) {

    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        department: "",
        designation: "",
        date_joined: ""
    });

    const handleChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8000/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Unable to register employee.");
            }

            setEmployee({ name: "", email: "", department: "", designation: "", date_joined: "" });
            onCreated(data);
        } catch (submitError) {
            setError(submitError.message || "Unable to register employee.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="employee-form">
            <h2>Register New Employee</h2>

            <form onSubmit={handleSubmit}>

                <label>
                    Employee name
                <input
                    type="text"
                    name="name"
                    placeholder="Employee Name"
                    value={employee.name}
                    onChange={handleChange}
                    required
                />
                </label>

                <label>
                    Email address
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={employee.email}
                    onChange={handleChange}
                    required
                />
                </label>

                <label>
                    Department
                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={employee.department}
                    onChange={handleChange}
                    required
                />
                </label>

                <label>
                    Designation
                <input
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    value={employee.designation}
                    onChange={handleChange}
                    required
                />
                </label>

                <label>
                    Date joined
                <input
                    type="date"
                    name="date_joined"
                    value={employee.date_joined}
                    onChange={handleChange}
                    required
                />
                </label>

                <button type="submit">
                    {isSubmitting ? "Registering..." : "Register Employee"}
                </button>
                {error && <p className="form-message error" role="alert">{error}</p>}
            </form>
        </div>
    );
}

export default EmployeeForm;



