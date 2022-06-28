import { ChatActionTypes } from "./index.type";

export const saveMessage = (payload) => {
  return { type: ChatActionTypes.SAVE_MESSAGE, payload };
};

export const startChat = (payload) => {
  return { type: ChatActionTypes.START_CHAR, payload };
};