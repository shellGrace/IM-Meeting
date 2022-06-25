import { ChatActionTypes } from "./index.type";

const initState = {};

export function chat(state = initState, action) {
  const { type, payload, options } = action;
  switch (type) {
    case ChatActionTypes.SAVE_MESSAGE:
      break;
    default:
      return state;
  }
}
