import axios from 'axios';
import { MARK_ATTENDANCE, FETCH_ALL_ATTENDANCE } from './types';

// Existing action to mark attendance
export const markAttendance = (status) => async (dispatch) => {
  try {
    const response = await axios.post('/api/attendance/mark', { status });
    dispatch({ type: MARK_ATTENDANCE, payload: response.data });
  } catch (error) {
    console.error('Error marking attendance:', error);
  }
};

// New action to fetch all attendance records for admins
export const fetchAllAttendance = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5000/api/attendance'); // Replace with the correct API endpoint
    dispatch({ type: FETCH_ALL_ATTENDANCE, payload: response.data });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
  }
};
