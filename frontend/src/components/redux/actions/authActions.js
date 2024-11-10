import * as api from "../../../api/auth";
import { LOGIN_SUCCESS, LOGIN_FAILURE } from "./types";

// Login Action
export const loginUser = (userData) => async (dispatch) => {
    try {
      const response = await api.login(userData);
      const { token, user } = response.data;
  
      // Save token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
  
      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error.response?.data });
      return { success: false, error: error.response?.data };
    }
  };

// Register Action
export const registerUser = (userData) => async () => {
  try {
    await api.registerUser(userData);
    // Optionally, handle additional actions or navigation
  } catch (error) {
    console.error("Registration error:", error);
  }
};
