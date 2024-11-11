import axios from 'axios';
import { FETCH_NOTIFICATIONS } from './types';

export const fetchNotifications = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://kaamcom.onrender.com/api/notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: FETCH_NOTIFICATIONS, payload: response.data });
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};
