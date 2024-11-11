const moment = require("moment");
const Attendance = require("../models/Attendance");

// Check-in function
exports.checkIn = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const existingAttendance = await Attendance.findOne({
        user_id: userId,
        check_out: null,
      });
  
      if (existingAttendance) {
        return res.status(400).json({
          message: "You are already checked in. Please check out before checking in again.",
        });
      }
  
      const newAttendance = new Attendance({
        user_id: userId,
        check_in: moment().toDate(),
      });
  
      await newAttendance.save();
      res.status(201).json({ message: "Checked in successfully", check_in: newAttendance.check_in });
    } catch (error) {
      console.error("Error during check-in:", error);
      res.status(500).json({ message: "Error during check-in", error: error.message });
    }
  };

// Check-out function
exports.checkOut = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const attendance = await Attendance.findOne({
        user_id: userId,
        check_out: null,
      });
  
      if (!attendance) {
        return res.status(400).json({ message: "No check-in record found. Please check in first." });
      }
  
      attendance.check_out = moment().toDate();
      attendance.work_hours = moment(attendance.check_out).diff(moment(attendance.check_in), "hours", true);
  
      await attendance.save();
      res.json({
        message: "Checked out successfully",
        check_in: attendance.check_in,
        check_out: attendance.check_out,
        work_hours: attendance.work_hours,
      });
    } catch (error) {
      console.error("Error during check-out:", error);
      res.status(500).json({ message: "Error during check-out", error: error.message });
    }
  };

// Fetch all attendance records (Admin only)
exports.getAllAttendance = async (req, res) => {
    try {
      let attendanceRecords;
  
      if (req.user.role === "Admin") {
        // Admins can see all attendance records
        attendanceRecords = await Attendance.find().populate("user_id", "email role");
      } else if (req.user.role === "Employee") {
        // Employees can see only their own attendance records
        attendanceRecords = await Attendance.find({ user_id: req.user.id }).populate("user_id", "email role");
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
  
      res.json(attendanceRecords);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      res.status(500).json({ message: "Error fetching attendance records", error: error.message });
    }
  };

  exports.editAttendance = async (req, res) => {
    const { id } = req.params;
    const { check_in, check_out } = req.body;
  
    try {
      const attendance = await Attendance.findById(id);
      if (!attendance) return res.status(404).json({ message: "Attendance record not found" });
  
      // Update check_in and check_out
      attendance.check_in = check_in ? new Date(check_in) : attendance.check_in;
      attendance.check_out = check_out ? new Date(check_out) : attendance.check_out;
      attendance.work_hours = check_out && check_in ? moment(check_out).diff(moment(check_in), "hours", true) : attendance.work_hours;
  
      await attendance.save();
      res.json({ message: "Attendance updated successfully", attendance });
    } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).json({ message: "Error updating attendance", error: error.message });
    }
  };

  exports.deleteAttendance = async (req, res) => {
    try {
      const { id } = req.params;
      const attendanceRecord = await Attendance.findByIdAndDelete(id);
  
      if (!attendanceRecord) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
  
      res.status(200).json({ message: "Attendance record deleted successfully" });
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      res.status(500).json({ message: "Error deleting attendance record" });
    }
  };    