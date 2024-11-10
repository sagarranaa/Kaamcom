import { combineReducers } from 'redux';
import authReducer from './authReducer';
import attendanceReducer from './attendanceReducer';
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  attendance: attendanceReducer,
  notifications: notificationReducer,
});

export default rootReducer;
