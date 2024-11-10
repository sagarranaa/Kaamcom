import API from './index';

// Fetch all attendance records (for Admin use)
export const fetchAllAttendance = () => API.get('/attendance/all');

// Update an attendance record (for Admin use)
export const updateAttendance = (id, data) => API.put(`/attendance/${id}`, data);
