import * as api from "../../../api/auth";
import { LOGIN_SUCCESS, LOGIN_FAILURE } from "./types";

// Login Action
export const loginUser = (userData) => async (dispatch) => {
  try {
    // Call the login API
    const response = await api.login(userData);
    const { token, user } = response.data;

    // Save token and role to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);

    // Dispatch success action with user data
    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });

    return { success: true, data: response.data };
  } catch (error) {
    // Extract error message from response if available
    const errorMessage = error.response?.data?.message || "Login failed";
    
    // Dispatch failure action with error data
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });

    // Return error response to handle it in the component if needed
    return { success: false, error: errorMessage };
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
