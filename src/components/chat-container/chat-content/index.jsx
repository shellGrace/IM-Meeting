import classnames from "classnames";
import "./index.css";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { IMManager } from "../../../utils/im";
import { ChatTypesEnum } from "../../../redux/chat";

const manager = IMManager.getInstance();

export const ChatContent = () => {
  const { userName } = useSelector((store) => store.session);
  const { channelId, to, chatType, channelName, msgMap } = useSelector((store) => store.chat);

  const messages = useMemo(() => {
    return msgMap[channelId] || [];
  }, [msgMap, channelId]);

  useEffect(async () => {
    if (to) {
      const isGroup = chatType == ChatTypesEnum.GroupChat;
      const queue = isGroup ? channelName : to;
      const res = await manager.fetchHistoryMessages({
        queue,
        isGroup,
        count: 50,
        format: true,
      });
      console.log("历史消息 ", res);
    }
  }, [to, channelName]);

  return (
    <div className="chat-content">
      {messages.map((item, index) => (
        <div key={index} className={classnames("mas-box", { "is-me": item.from == userName })}>
          <span className="msg-user">{item.from}</span>
          <div className="msg-bubble">{item.msg}</div>
        </div>
      ))}
    </div>
  );
};
