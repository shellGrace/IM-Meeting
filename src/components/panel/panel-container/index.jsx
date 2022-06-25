import { PanelAllChatRooms } from "../panel-all-chat-rooms";
import { PanelAttendees } from "../panel-attendees";
import { PanelJoinedChatrooms } from "../panel-joined-chatrooms";
import { PanelMessages } from "../panel-messages";
import { useSelector } from "react-redux";
import { AsideItemsEnum } from "../../../redux/ui";
import "./index.css";
import { useMemo } from "react";

export const PanelContainer = () => {
  const { asideItems } = useSelector((store) => store.ui);
  const ActivePanel = useMemo(() => {
    const activeId = asideItems.find((item) => item.active).id;
    switch (activeId) {
      case AsideItemsEnum.Messages:
        return PanelMessages;
      case AsideItemsEnum.Attendees:
        return PanelAttendees;
      case AsideItemsEnum.JoinedChatrooms:
        return PanelJoinedChatrooms;
      case AsideItemsEnum.AllChatRooms:
        return PanelAllChatRooms;
      default:
        return PanelMessages;
    }
  }, [asideItems]);

  return (
    <section className="panel">
      <ActivePanel></ActivePanel>
    </section>
  );
};
