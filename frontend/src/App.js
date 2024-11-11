import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import CheckInCheckOut from "./components/Attendance/CheckInCheckOut";
import Notifications from "./components/Notifications/Notifications";
import HomePage from "./pages/HomePage";
import AdminAttendance from "./components/Dashboard/AdminAttendance";

function App() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role");

  const isAdmin = role === "Admin";
  const isEmployee = role === "Employee";

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />

        {isAdmin ? (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
          </>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/login" />} />
        )}

        {/* Employee Routes */}
        {isEmployee ? (
          <>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/checkin" element={<CheckInCheckOut />} />
          </>
        ) : (
          <Route path="/employee/*" element={<Navigate to="/login" />} />
        )}

        {/* Redirect to login if no valid route is found */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
