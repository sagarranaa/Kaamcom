import { MARK_ATTENDANCE, FETCH_ALL_ATTENDANCE } from '../actions/types';

const initialState = {
  records: [],
  attendanceStatus: null,
};

const attendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case MARK_ATTENDANCE:
      return {
        ...state,
        attendanceStatus: action.payload,
      };
    case FETCH_ALL_ATTENDANCE:
      return {
        ...state,
        records: action.payload,
      };
    default:
      return state;
  }
};

export default attendanceReducer;
