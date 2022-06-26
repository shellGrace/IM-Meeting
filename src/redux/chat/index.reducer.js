import { ChatActionTypes, CharTypesEnum } from './index.type'

const initState = {
  channelId: '',
  charType: '', //CharTypesEnum
  messages: [],
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
