import { UiActionTypes } from "./index.type.js";

export const changeAsideItem = (items) => ({
  type: UiActionTypes.CHANGE_ASIDE_ITEM,
  payload: items,
});
