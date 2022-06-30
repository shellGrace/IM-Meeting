import { SessionActionTypes } from "./index.type";

const initState = {
  userName: "",
};

export function session(state = initState, action) {
  switch (action.type) {
    case SessionActionTypes.ADD_SESSION_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
