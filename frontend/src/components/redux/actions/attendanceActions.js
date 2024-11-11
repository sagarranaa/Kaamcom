import API from '../../../api/index'; // Import custom Axios instance with token setup
import {
  MARK_ATTENDANCE,
  FETCH_ALL_ATTENDANCE_SUCCESS,  
  FETCH_ALL_ATTENDANCE_FAILURE, 
  DELETE_ATTENDANCE ,
  UPDATE_ATTENDANCE,
} from './types';

// Action to mark attendance
export const markAttendance = (status) => async (dispatch) => {
  try {
    const response = await API.post('/attendance/mark', { status });
    dispatch({ type: MARK_ATTENDANCE, payload: response.data });
  } catch (error) {
    console.error('Error marking attendance:', error);
  }
};

// Fetch all attendance records
export const fetchAllAttendance = () => async (dispatch) => {
  try {
    const response = await API.get("/attendance"); // Use API instead of axios
    dispatch({ type: FETCH_ALL_ATTENDANCE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    dispatch({ type: FETCH_ALL_ATTENDANCE_FAILURE, payload: error.message });
    throw error;
  }
};

// Update attendance record
export const updateAttendance = (id, updatedData) => async (dispatch) => {
  try {
    const response = await API.put(`/attendance/${id}`, updatedData); 
    dispatch({ type: UPDATE_ATTENDANCE, payload: response.data });
  } catch (error) {
    console.error("Error updating attendance:", error);
  }
};

export const deleteAttendance = (id) => async (dispatch) => {
    try {
      await API.delete(`/attendance/${id}`);
      dispatch({ type: DELETE_ATTENDANCE, payload: id });
    } catch (error) {
      console.error("Error deleting attendance record:", error);
    }
  };
