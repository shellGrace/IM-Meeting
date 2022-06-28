import { ChatActionTypes, ChatTypesEnum } from "./index.type";

// messages:{
//   from: ,
//   to:
//   msg,
//   time:
// }

const initState = {
  channelId: "", // 会话id
  channelName: "", // 会话名字 (用作rtc channel)  如果是单聊  xxx_yyy 又会话双方id组成   群聊就是群聊groupid
  chatType: "", // ChatTypesEnum 会话类型
  to: "", // 会话对方
  messages: [], // 会话消息
};

export function chat(state = initState, action) {
  const { type, payload, options } = action;
  switch (type) {
    case ChatActionTypes.SAVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload],
      };
    case ChatActionTypes.START_CHAR:
      return {
        ...state,
        messages: [],
        ...payload,
      };
    default:
      return state;
  }
}
