import { ChatActionTypes } from "./index.type";

export const saveMessage = (payload, options) => {
  return { type: ChatActionTypes.SAVE_MESSAGE, payload, options };
};
