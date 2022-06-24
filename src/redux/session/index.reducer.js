import { SessionActionTypes } from './index.type'

const initState = {
  userId: '',
  userName: '',
  roomId: '',
}

export function session(state = initState, action) {
  switch (action.type) {
    case SessionActionTypes.ADD_SESSION_INFO:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
