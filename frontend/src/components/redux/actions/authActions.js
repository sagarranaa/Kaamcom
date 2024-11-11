import * as api from "../../../api/auth";
import { LOGIN_SUCCESS, LOGIN_FAILURE } from "./types";

export const loginUser = (userData) => async (dispatch) => {
  try {
    const response = await api.login(userData);
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);

    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });

    return { success: false, error: errorMessage };
  }
};

// Register Action
export const registerUser = (userData) => async () => {
  try {
    await api.registerUser(userData);
  } catch (error) {
    console.error("Registration error:", error);
  }
};
