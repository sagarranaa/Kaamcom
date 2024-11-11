    const express = require('express');
    const { checkIn, checkOut,getAllAttendance ,editAttendance ,deleteAttendance,getFilteredAttendance, exportCSV, exportPDF } = require('../controllers/attendanceController');
    const router = express.Router();
    const authMiddleware = require('../middleware/authMiddleware');
    router.get('/', authMiddleware, getAllAttendance);
    router.post('/checkin', authMiddleware, checkIn);
    router.post('/checkout', authMiddleware, checkOut);
    router.put('/:id', authMiddleware, editAttendance);
    router.delete('/:id', authMiddleware, deleteAttendance);
    router.get('/export/pdf/:employeeId?', authMiddleware, exportPDF)

    module.exports = router;
