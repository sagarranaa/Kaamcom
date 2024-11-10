const moment = require("moment");
const Attendance = require("../models/Attendance");

// Check-in function
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const newAttendance = new Attendance({
      user_id: userId,
      check_in: new Date(),
    });
    await newAttendance.save();
    res.status(201).json({ message: "Checked in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during check-in", error });
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
    if (!attendance)
      return res.status(400).json({ message: "Check-in record not found" });

    attendance.check_out = new Date();
    attendance.work_hours = moment(attendance.check_out).diff(
      moment(attendance.check_in),
      "hours",
      true
    );
    await attendance.save();
    res.json({
      message: "Checked out successfully",
      work_hours: attendance.work_hours,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during check-out", error });
  }
};

exports.getAllAttendance = async (req, res) => {
    try {
      const attendanceRecords = await Attendance.find().populate('user_id', 'email');
      res.json(attendanceRecords);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance records', error });
    }
  };

  exports.editAttendance = async (req, res) => {
    const { id } = req.params;
    const { check_in, check_out } = req.body;
  
    try {
      const attendance = await Attendance.findById(id);
      if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
  
      attendance.check_in = check_in ? new Date(check_in) : attendance.check_in;
      attendance.check_out = check_out ? new Date(check_out) : attendance.check_out;
      attendance.work_hours = check_out && check_in ? (new Date(check_out) - new Date(check_in)) / 3600000 : attendance.work_hours;
  
      await attendance.save();
      res.json({ message: 'Attendance updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating attendance', error });
    }
  };
