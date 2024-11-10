import React from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Clear all data from localStorage
        localStorage.clear();
    
        // Redirect to login page
        navigate("/login");
      };

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <p>
        Welcome to your personal dashboard where you can view and manage your
        attendance records.
      </p>
      {/* Add additional components for attendance records, notifications, etc. */}
    </div>
  );
};

export default EmployeeDashboard;
