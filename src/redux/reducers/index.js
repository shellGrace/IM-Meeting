import { combineReducers } from "redux";
import { session } from "./session.js";
import { chat } from "./chat.js";

const store = combineReducers({ session, chat });

export default store;
