import { UiActionTypes } from "./index.type";

const asideItems = [
  {
    id: "1",
    name: "Messages",
    active: true,
    svg: "messages",
  },
  {
    id: "2",
    name: "Attendees",
    active: false,
    svg: "attendees",
  },
  {
    id: "3",
    name: "Joined Chatrooms",
    active: false,
    svg: "joined-chatrooms",
  },
  {
    id: "4",
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
