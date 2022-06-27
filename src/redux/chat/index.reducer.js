import { ChatActionTypes, ChatTypesEnum } from './index.type'

const initState = {
  channelId: '', // 会话id
  chatType: '', // ChatTypesEnum 会话类型
  chatName:"", // 会话名字
  messages: [], // 会话消息
}

export function chat(state = initState, action) {
  const { type, payload, options } = action
  switch (type) {
    case ChatActionTypes.SAVE_MESSAGE:
      break
    case ChatActionTypes.START_CHAR:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}
