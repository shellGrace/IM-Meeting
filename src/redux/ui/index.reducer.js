import { UiActionTypes, AsideItemsEnum } from "./index.type";

const asideItems = [
  {
    id: AsideItemsEnum.Messages,
    name: "Messages",
    active: true,
    svg: "messages",
  },
  {
    id: AsideItemsEnum.Attendees,
    name: "Attendees",
    active: false,
    svg: "attendees",
  },
  {
    id: AsideItemsEnum.JoinedChatrooms,
    name: "Joined Chatrooms",
    active: false,
    svg: "joined-chatrooms",
  },
  {
    id: AsideItemsEnum.AllChatRooms,
    name: "All Chat Rooms",
    active: false,
    svg: "all-chat-rooms",
  },
];

const initState = {
  asideItems: asideItems,
};

export function ui(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case UiActionTypes.CHANGE_ASIDE_ITEM:
      return {
        ...state,
        asideItems: payload,
      };
    default:
      return state;
  }
}
