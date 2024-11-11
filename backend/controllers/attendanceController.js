const moment = require("moment");
const json2csv = require('json2csv').parse;
const PDFDocument = require('pdfkit');
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

// Edit attendance function (Admin only)
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

// Delete attendance function (Admin only)
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

exports.exportPDF = async (req, res) => {
    const { employeeId } = req.params; // Optional employeeId for admin
    const userId = req.user.id;
    const isAdmin = req.user.role === "Admin";

    // Check if the user is an admin
    if (!isAdmin) {
        return res.status(403).json({ message: "Access denied. Only admins can download attendance PDFs." });
    }

    try {
        // Determine the user for whom to generate the PDF
        const queryUserId = employeeId ? employeeId : userId;

        // Fetch attendance records
        const attendanceData = await Attendance.find({ user_id: queryUserId }).populate('user_id', 'email role');

        if (!attendanceData.length) {
            return res.status(404).json({ message: "No attendance records found." });
        }

        // Generate the PDF
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${queryUserId}.pdf`);
        doc.pipe(res);

        // Title and employee information
        doc.fontSize(18).text("Attendance Report", { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Employee: ${attendanceData[0].user_id.email}`);
        doc.moveDown(2);

        // Table headers
        doc.fontSize(12);
        doc.text("Date", 50, doc.y, { continued: true });
        doc.text("Status", 150, doc.y, { continued: true });
        doc.text("Check-in", 250, doc.y, { continued: true });
        doc.text("Check-out", 350, doc.y, { continued: true });
        doc.text("Work Hours", 450, doc.y);
        
        // Draw a line under the headers
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        // Attendance data rows
        attendanceData.forEach((record) => {
            const checkInTime = record.check_in ? moment(record.check_in).format("HH:mm:ss") : "-";
            const checkOutTime = record.check_out ? moment(record.check_out).format("HH:mm:ss") : "Not Checked Out";
            const workHours = record.work_hours ? `${record.work_hours.toFixed(2)} hrs` : "N/A";
            const status = record.check_in && record.check_out ? "Present" : "N/A";

            // Add data to each column
            doc.text(moment(record.check_in).format("YYYY-MM-DD"), 50, doc.y, { continued: true });
            doc.text(status, 150, doc.y, { continued: true });
            doc.text(checkInTime, 250, doc.y, { continued: true });
            doc.text(checkOutTime, 350, doc.y, { continued: true });
            doc.text(workHours, 450, doc.y);

            doc.moveDown(0.5); // Space between rows
        });

        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Error generating PDF", error: error.message });
    }
};
