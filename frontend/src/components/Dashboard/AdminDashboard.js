import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllAttendance } from "../redux/actions/attendanceActions";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const attendanceRecords = useSelector((state) => state.attendance.records);

  const handleLogout = () => {
    // Clear all data from localStorage
    localStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  useEffect(() => {
    dispatch(fetchAllAttendance());
  }, [dispatch]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Hours Worked</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.employeeName}</td>
              <td>{record.date}</td>
              <td>{record.checkIn}</td>
              <td>{record.checkOut}</td>
              <td>{record.hoursWorked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
