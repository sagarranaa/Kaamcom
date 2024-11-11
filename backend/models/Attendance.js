// models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  check_in: { type: Date, required: true },
  check_out: { type: Date },
  work_hours: { type: Number },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
