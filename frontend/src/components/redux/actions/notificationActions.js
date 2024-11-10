// Placeholder code for notification actions
import axios from "axios";

export const FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";

export const fetchNotifications = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/notifications");
    dispatch({ type: FETCH_NOTIFICATIONS, payload: response.data });
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};
