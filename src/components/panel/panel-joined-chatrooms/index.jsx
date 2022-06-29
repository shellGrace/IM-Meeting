import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IMManager } from "../../../utils/im";
import { startChat, ChatTypesEnum } from "../../../redux/chat";
import { transformIdToChannel } from "../../../utils";
import "./index.css";

const manager = IMManager.getInstance();

export const PanelJoinedChatrooms = () => {
  const [myGroups, setMyGroups] = useState([]);
  // const { userName } = useSelector((store) => store.session);
  const dispatch = useDispatch();

  useEffect(() => {
    getMyGroup();
  }, []);

  const getMyGroup = async () => {
    const data = (await manager.getMyGroup())?.data || [];
    setMyGroups(data);
  };

  const onClickGroup = ({ groupid, groupname }) => {
    // 开启群聊
    const channelId = transformIdToChannel({ id: groupid, type: ChatTypesEnum.GroupChat });
    const chatType = ChatTypesEnum.GroupChat;
    const to = groupname;
    const channelName = groupid;
    dispatch(
      startChat({
        channelId,
        channelName,
        chatType,
        to,
      })
    );
  };

  const onClickQuitGroup = async (groupId) => {
    await manager.quitGroup({ groupId });
    await getMyGroup();
  };

  return (
    <section className="joined-chatrooms">
      <div>Joined Chatrooms</div>
      <button onClick={getMyGroup} className="item">
        获取我的群组
      </button>
      <section>
        {myGroups.map((item) => (
          <div key={item.groupid} className="group-item" onClick={() => onClickGroup(item)}>
            <span className="group-name">{item.groupid}-{item.groupname}</span>
            <button className="btn-quit" onClick={(e) => {
              e.stopPropagation()
              onClickQuitGroup(item.groupid)
            }}>
              退出群组
            </button>
          </div>
        ))}
      </section>
    </section>
  );
};
