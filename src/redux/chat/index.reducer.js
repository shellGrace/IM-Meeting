import { ChatActionTypes, ChatTypesEnum } from "./index.type";

// msgMap  key  => channelId

// message:{
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
  msgMap: {}, // 会话消息
};

export function chat(state = initState, action) {
  const { type, payload, options = {} } = action;
  const { channelId = "" } = options;
  switch (type) {
    case ChatActionTypes.SAVE_MESSAGE:
      let messages = state.msgMap[channelId];
      let newMessages = [];
      if (messages) {
        newMessages = [...messages, payload];
      } else {
        newMessages = [payload];
      }
      return {
        ...state,
        msgMap: {
          ...state.msgMap,
          [channelId]: newMessages,
        },
      };
    case ChatActionTypes.START_CHAR:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
