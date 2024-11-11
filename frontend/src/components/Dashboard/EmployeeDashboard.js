import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAttendance, checkIn, checkOut } from "../../api/attendance";
import {
  Button,
  Snackbar,
  Alert,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const calculateWorkHours = (checkIn, checkOut) => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const hoursWorked = (outDate - inDate) / (1000 * 60 * 60);
  return hoursWorked >= 0 ? hoursWorked.toFixed(2) : "Invalid Time";
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");

  const fetchAndSetAttendance = async () => {
    try {
      const response = await fetchAttendance();
      setAttendanceRecords(response.data);

      if (response.data.length > 0) {
        setEmployeeEmail(response.data[0].user_id.email || "Unknown");
      }

      const lastRecord = response.data[response.data.length - 1];
      setIsCheckedIn(lastRecord && !lastRecord.check_out);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setToastMessage("Could not load attendance data.");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  useEffect(() => {
    fetchAndSetAttendance();
    const intervalId = setInterval(fetchAndSetAttendance, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCheckIn = async () => {
    try {
      await checkIn();
      setIsCheckedIn(true);
      setToastMessage("Checked in successfully!");
      setToastSeverity("success");
      setToastOpen(true);
      fetchAndSetAttendance();
    } catch (err) {
      console.error("Error during check-in:", err);
      setToastMessage("Check-in failed.");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      setIsCheckedIn(false);
      setToastMessage("Checked out successfully!");
      setToastSeverity("success");
      setToastOpen(true);
      fetchAndSetAttendance();
    } catch (err) {
      console.error("Error during check-out:", err);
      setToastMessage("Check-out failed.");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  const handleToastClose = () => setToastOpen(false);

  return (
    <Container maxWidth="md" style={{ paddingTop: "20px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Employee Dashboard</Typography>
      <Typography variant="h6" gutterBottom>{`Employee: ${employeeEmail}`}</Typography>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px" }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/logout")}>Logout</Button>
        {isCheckedIn ? (
          <Button variant="contained" color="secondary" onClick={handleCheckOut}>Check Out</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleCheckIn}>Check In</Button>
        )}
      </div>
      <TableContainer>
        <Table style={{ width: "100%", marginTop: "20px", border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>In Time</TableCell>
              <TableCell>Out Time</TableCell>
              <TableCell>Work Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(record.check_in).toLocaleDateString()}</TableCell>
                <TableCell>{record.check_in && record.check_out ? "Present" : "N/A"}</TableCell>
                <TableCell>{record.check_in ? new Date(record.check_in).toLocaleTimeString() : "-"}</TableCell>
                <TableCell>{record.check_out ? new Date(record.check_out).toLocaleTimeString() : "-"}</TableCell>
                <TableCell>{record.check_in && record.check_out ? calculateWorkHours(record.check_in, record.check_out) : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleToastClose}>
        <Alert onClose={handleToastClose} severity={toastSeverity}>{toastMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeDashboard;
