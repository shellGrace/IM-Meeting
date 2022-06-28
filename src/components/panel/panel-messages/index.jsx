import { useEffect, useState } from "react";
import { IMManager } from "../../../utils/im";
import { ChatTypesEnum, startChat } from "../../../redux/chat";
import {
  getIdfromChannel,
  getChatTypefromChannel,
  formatTime,
  genChannelName,
} from "../../../utils";
import "./index.css";
import { useDispatch } from "react-redux";

const manager = IMManager.getInstance();

export const PanelMessages = () => {
  const [sessionList, setSessionList] = useState([]);
  const { userName } = useDispatch((store) => store.session);
  const dispatch = useDispatch();

  useEffect(() => {
    getSessionList();
  }, []);

  const getSessionList = async () => {
    const data = (await manager.getSessionList())?.data || {};
    const list = data.channel_infos || [];
    setSessionList(list);
  };

  const onClickItem = async (channelId) => {
    const chatType = getChatTypefromChannel(channelId);
    const to = getIdfromChannel(channelId);
    // TODO:channelName groupid
    const channelName = chatType == ChatTypesEnum.GroupChat ? to : genChannelName(userName, to);
    dispatch(
      startChat({
        channelId,
        channelName,
        chatType,
        to,
      })
    );
  };

  return (
    <section className="messages">
      <div>Messages</div>
      <div onClick={getSessionList} className="item">
        获取会话列表
      </div>
      <section>
        {sessionList.map((item) => (
          <div
            key={item.channel_id}
            className="char-item"
            onClick={() => onClickItem(item.channel_id)}
          >
            <span className="name">和 {getIdfromChannel(item.channel_id)} 的聊天</span>
            <span className="type">
              {getChatTypefromChannel(item.channel_id) == ChatTypesEnum.SingleChat
                ? "单聊"
                : "群聊"}
            </span>
            <span className="time">{formatTime(item.meta.timestamp)}</span>
          </div>
        ))}
      </section>
    </section>
  );
};
