import React, { useEffect, useState } from "react";
import { fetchAllAttendance, updateAttendance } from "../../api/admin";

const AdminAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({ check_in: "", check_out: "" });

  // Fetch attendance records when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllAttendance();
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };
    fetchData();
  }, []);

  // Function to handle editing an attendance record
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({ check_in: record.check_in, check_out: record.check_out });
  };

  // Function to handle saving the edited attendance record
  const handleSave = async () => {
    try {
      await updateAttendance(editingRecord._id, formData);
      alert("Attendance updated successfully");
      setEditingRecord(null);
      setFormData({ check_in: "", check_out: "" });
      // Reload data after updating
      const response = await fetchAllAttendance();
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>All Attendance Records</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Work Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record._id}>
              <td>{record.user_id.email}</td>
              <td>{record.check_in}</td>
              <td>{record.check_out}</td>
              <td>{record.work_hours}</td>
              <td>
                <button onClick={() => handleEdit(record)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRecord && (
        <div>
          <h3>Edit Attendance</h3>
          <label>
            Check-in:
            <input
              type="datetime-local"
              name="check_in"
              value={formData.check_in}
              onChange={handleChange}
            />
          </label>
          <label>
            Check-out:
            <input
              type="datetime-local"
              name="check_out"
              value={formData.check_out}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditingRecord(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
