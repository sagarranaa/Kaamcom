const moment = require('moment');
const Attendance = require('../models/Attendance');

// Check-in function
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const newAttendance = new Attendance({ user_id: userId, check_in: new Date() });
    await newAttendance.save();
    res.status(201).json({ message: 'Checked in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during check-in', error });
  }
};

// Check-out function
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const attendance = await Attendance.findOne({ user_id: userId, check_out: null });
    if (!attendance) return res.status(400).json({ message: 'Check-in record not found' });

    attendance.check_out = new Date();
    attendance.work_hours = moment(attendance.check_out).diff(moment(attendance.check_in), 'hours', true);
    await attendance.save();
    res.json({ message: 'Checked out successfully', work_hours: attendance.work_hours });
  } catch (error) {
    res.status(500).json({ message: 'Error during check-out', error });
  }
};
