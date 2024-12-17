import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types"; // Import PropTypes

// Reusable Input Component
const InputField = ({ label, name, type, value, onChange, onBlur, error }) => (
    <div>
        <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
        >
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`mt-1 block w-full p-3 border transition-all duration-200 hover:shadow-md focus:shadow-lg ${
                error
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-indigo-300"
            } rounded-lg shadow-sm`}
            aria-invalid={!!error}
            aria-describedby={`${name}-error`}
        />
        {error && (
            <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                {error}
            </p>
        )}
    </div>
);

// Define PropTypes for InputField
InputField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    error: PropTypes.string,
};

// Reusable Dropdown Component
const Dropdown = ({ label, name, value, options, onChange, onBlur, error }) => (
    <div>
        <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
        >
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`mt-1 block w-full p-3 border transition-all duration-200 hover:shadow-md focus:shadow-lg ${
                error
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-indigo-300"
            } rounded-lg shadow-sm`}
            aria-invalid={!!error}
            aria-describedby={`${name}-error`}
        >
            <option value="" disabled hidden>
                Select your Role
            </option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
        {error && (
            <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                {error}
            </p>
        )}
    </div>
);

// Define PropTypes for Dropdown
Dropdown.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    error: PropTypes.string,
};

function App() {
    const [formData, setFormData] = useState({
        name: "",
        employeeID: "",
        email: "",
        phoneNumber: "",
        joiningDate: "",
        role: "",
        department: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const backendURL = "http://localhost:3001";

    const validate = (field, value) => {
        const today = new Date();
        const joiningDate = new Date(formData.joiningDate);

        const validations = {
            name: !value ? "Name is required" : "",
            employeeID: !value ? "Employee ID is required" : "",
            email: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
                ? "Enter a valid email address"
                : "",
            phoneNumber: !/^\d{10}$/.test(value)
                ? "Enter a valid 10-digit phone number"
                : "",
            joiningDate: !value
                ? "Joining Date is required"
                : joiningDate > today
                ? "Joining Date cannot be in the future"
                : "",
            role: !value ? "Role is required" : "",
            department: !value ? "Department is required" : "",
        };

        return validations[field];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (touched[name]) {
            setErrors({ ...errors, [name]: validate(name, value) });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        setErrors({ ...errors, [name]: validate(name, value) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = Object.keys(formData).reduce((acc, field) => {
            const error = validate(field, formData[field]);
            if (error) acc[field] = error;
            return acc;
        }, {});

        if (Object.keys(newErrors).length === 0) {
            alert("Form submitted successfully!");
            setFormData({
                name: "",
                employeeID: "",
                email: "",
                phoneNumber: "",
                joiningDate: "",
                role: "",
                department: "",
            });
            setTouched({});
            setErrors({});
        } else {
            setErrors(newErrors);
            setTouched(
                Object.keys(formData).reduce(
                    (acc, field) => ({ ...acc, [field]: true }),
                    {}
                )
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            <div className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-lg">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Employee Management Form
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField
                        label="Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name}
                    />
                    <InputField
                        label="Employee ID"
                        name="employeeID"
                        type="text"
                        value={formData.employeeID}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.employeeID}
                    />
                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                    />
                    <InputField
                        label="Phone Number"
                        name="phoneNumber"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.phoneNumber}
                    />
                    <InputField
                        label="Joining Date"
                        name="joiningDate"
                        type="date"
                        value={formData.joiningDate}
                        max={new Date().toISOString().split("T")[0]} // Restrict future dates
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.joiningDate}
                    />
                    <Dropdown
                        label="Select Your Role"
                        name="role"
                        value={formData.role}
                        options={[
                            "Manager",
                            "Front-End Developer",
                            "HR",
                            "Designer",
                            "DevOps Engineer",
                            "API Developer",
                            "UI/UX Developer",
                        ]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.role}
                    />
                    <Dropdown
                        label="Select Your Department"
                        name="department"
                        value={formData.department}
                        options={["IT", "HR", "Marketing", "Finance"]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.department}
                    />

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg text-sm font-bold"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default App;
