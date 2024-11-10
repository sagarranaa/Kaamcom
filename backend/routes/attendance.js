const express = require('express');
const { checkIn, checkOut,getAllAttendance ,editAttendance  } = require('../controllers/attendanceController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllAttendance);
router.post('/checkin', authMiddleware, checkIn);
router.post('/checkout', authMiddleware, checkOut);
router.put('/:id', authMiddleware, editAttendance);

module.exports = router;
