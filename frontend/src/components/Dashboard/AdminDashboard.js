import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllAttendance, updateAttendance, deleteAttendance } from "../redux/actions/attendanceActions";
import moment from "moment-timezone";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete Icon
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    dispatch(fetchAllAttendance())
      .then((data) => {
        if (data) setAttendanceRecords(data);
      })
      .catch((error) => {
        toast.error("Failed to load attendance records.");
      });
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setEditCheckIn(moment(record.check_in).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss"));
    setEditCheckOut(record.check_out ? moment(record.check_out).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss") : "");
  };

  const closeEditModal = () => {
    setSelectedRecord(null);
    setEditCheckIn("");
    setEditCheckOut("");
  };

  const handleSaveEdit = () => {
    if (selectedRecord) {
      const updatedData = {
        check_in: editCheckIn ? new Date(editCheckIn) : selectedRecord.check_in,
        check_out: editCheckOut ? new Date(editCheckOut) : selectedRecord.check_out,
      };

      dispatch(updateAttendance(selectedRecord._id, updatedData)).then(() => {
        setAttendanceRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === selectedRecord._id ? { ...record, ...updatedData, work_hours: calculateWorkHours(updatedData) } : record
          )
        );

        toast.success("Attendance updated successfully!");
        closeEditModal();
      });
    }
  };

  const handleDelete = (record) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      dispatch(deleteAttendance(recordToDelete._id)).then(() => {
        setAttendanceRecords((prevRecords) => prevRecords.filter((record) => record._id !== recordToDelete._id));
        toast.success("Attendance record deleted successfully");
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
      });
    }
  };

  const calculateWorkHours = ({ check_in, check_out }) => {
    if (check_in && check_out) {
      return Number(moment(check_out).diff(moment(check_in), "hours", true).toFixed(2));
    }
    return 0; // Return 0 if work_hours cannot be calculated
  };

  const filteredRecords = attendanceRecords.filter((record) =>
    record.user_id.email.toLowerCase().includes(searchTerm)
  );

  return (
    <Container maxWidth="lg" style={{ paddingTop: "20px" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </Button>
      <TextField
        label="Search by Employee Email"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearchChange}
        value={searchTerm}
      />
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table aria-label="Attendance Table">
          <TableHead>
            <TableRow>
              <TableCell>Employee Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Check-in (IST)</TableCell>
              <TableCell>Check-out (IST)</TableCell>
              <TableCell>Hours Worked</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.user_id.email}</TableCell>
                <TableCell>{moment(record.check_in).tz("Asia/Kolkata").format("YYYY-MM-DD")}</TableCell>
                <TableCell>{moment(record.check_in).tz("Asia/Kolkata").format("HH:mm:ss")}</TableCell>
                <TableCell>{record.check_out ? moment(record.check_out).tz("Asia/Kolkata").format("HH:mm:ss") : "Not Checked Out"}</TableCell>
                <TableCell>{typeof record.work_hours === "number" ? `${record.work_hours.toFixed(2)} hrs` : "N/A"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditModal(record)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(record)}><DeleteIcon /></IconButton> {/* Delete Button */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog open={!!selectedRecord} onClose={closeEditModal}>
        <DialogTitle>Edit Attendance Record</DialogTitle>
        <DialogContent>
          <TextField label="Check-in Time" type="datetime-local" fullWidth margin="normal" value={editCheckIn} onChange={(e) => setEditCheckIn(e.target.value)} />
          <TextField label="Check-out Time" type="datetime-local" fullWidth margin="normal" value={editCheckOut} onChange={(e) => setEditCheckOut(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal} color="primary">Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this attendance record?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
