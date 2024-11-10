import API from './index';

// Register a new user
export const registerUser = (userData) => API.post('/auth/register', userData);

// Login user and get a token
export const login = (userData) => API.post('/auth/login', userData);
