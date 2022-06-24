import { SessionActionTypes } from "./index.type.js";

export const addSessionInfo = (info) => ({
  type: SessionActionTypes.ADD_SESSION_INFO,
  payload: info,
});
