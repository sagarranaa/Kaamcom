import {
    FETCH_ALL_ATTENDANCE_SUCCESS,
    FETCH_ALL_ATTENDANCE_FAILURE,
    UPDATE_ATTENDANCE,
    MARK_ATTENDANCE,
    DELETE_ATTENDANCE 
  } from '../actions/types';
  
  const initialState = {
    records: [],
    error: null,
  };
  
  export default function attendanceReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_ALL_ATTENDANCE_SUCCESS:
        return { ...state, records: action.payload, error: null };
  
      case FETCH_ALL_ATTENDANCE_FAILURE:
        return { ...state, error: action.payload };
        case DELETE_ATTENDANCE:
            return {
              ...state,
              records: state.records.filter((record) => record._id !== action.payload),
            };
  
      case UPDATE_ATTENDANCE:
        return {
          ...state,
          records: state.records.map((record) =>
            record._id === action.payload._id ? action.payload : record
          ),
        };
  
      case MARK_ATTENDANCE:
        return { ...state, records: [...state.records, action.payload] };
  
      default:
        return state;
    }
  }
  