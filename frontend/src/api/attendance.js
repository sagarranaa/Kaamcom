import API from './index';

export const fetchAttendance = () => API.get('/attendance');
// Check-in attendance
export const checkIn = () => API.post('/attendance/checkin');

// Check-out attendance
export const checkOut = () => API.post('/attendance/checkout');
