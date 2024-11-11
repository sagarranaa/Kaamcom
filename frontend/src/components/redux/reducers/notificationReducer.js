// notificationReducer.js
import { FETCH_NOTIFICATIONS } from '../actions/types';

const initialState = {
  notifications: [],
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return state;
  }
}
