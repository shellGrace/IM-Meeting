import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IMManager } from "../../../utils/im";
import { startChat, ChatTypesEnum } from "../../../redux/chat";
import { transformIdToChannel } from "../../../utils";
import "./index.css";

const manager = IMManager.getInstance();

export const PanelJoinedChatrooms = () => {
  const [myGroups, setMyGroups] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getMyGroup();
  }, []);

  const getMyGroup = async () => {
    const data = (await manager.getMyGroup()).data || [];
    setMyGroups(data);
  };

  const onClickGroup = ({ groupid, groupname }) => {
    // 开启群聊
    dispatch(
      startChat({
        channelId: transformIdToChannel({ id: groupid, type: ChatTypesEnum.GroupChat }),
        chatType: ChatTypesEnum.GroupChat,
        chatName: groupname,
      })
    );
  };

  return (
    <section className="joined-chatrooms">
      <div>Joined Chatrooms</div>
      <div onClick={getMyGroup} className="item">
        获取我的群组
      </div>
      <section>
        {myGroups.map((item) => (
          <div key={item.groupid} className="group-item" onClick={() => onClickGroup(item)}>
            <span>{item.groupid}</span>
            <span style={{ marginLeft: 5 }}>{item.groupname}</span>
          </div>
        ))}
      </section>
    </section>
  );
};
