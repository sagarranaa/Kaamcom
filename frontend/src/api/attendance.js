// attendance.js
import API from './index';

export const fetchAttendance = () => API.get('/attendance'); // Fetch attendance records
export const checkIn = () => API.post('/attendance/checkin'); // Check-in attendancea
export const checkOut = () => API.post('/attendance/checkout'); // Check-out attendance
