import { IMManager } from "../../../utils/im";
import { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { startChat, ChatTypesEnum } from "../../../redux/chat";
import { transformIdToChannel, genChannelName } from "../../../utils";

const manager = IMManager.getInstance();

export const PanelAttendees = () => {
  const [friends, setFriends] = useState([]);
  const [friendName, setFriendName] = useState("");
  const { userName } = useSelector((store) => store.session);
  const dispatch = useDispatch();

  useEffect(() => {
    getRoster();
    manager.on("onContactInvited", (message) => {
      // 收到好友邀请
      getRoster();
    });
    manager.on("onContactAgreed", (message) => {
      // 好友请求被同意
      getRoster();
    });
  }, []);

  const addContact = async () => {
    manager.addContact({
      username: friendName,
      msg: "请加我好友!",
    });
    await getRoster();
  };

  const getRoster = async () => {
    const data = (await manager.getRoster())?.data || [];
    setFriends(data);
  };

  const onClickStartChat = (name) => {
    // 开启单聊
    const channelId = transformIdToChannel({ id: name, type: ChatTypesEnum.SingleChat });
    const chatType = ChatTypesEnum.SingleChat;
    const to = name;
    const channelName = genChannelName(userName, to);
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
    <section className="attendees">
      <div>Attendees</div>
      <button onClick={getRoster} className="item">
        获取我的好友
      </button>
      <div className="item">
        <input
          className="input-wrapper"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
        ></input>
        <button className="btn-add" onClick={addContact}>添加好友</button>
      </div>
      <section>
        {friends.map((item) => (
          <div key={item} className="group-item">
            <span onClick={() => onClickStartChat(item)}>{item}</span>
          </div>
        ))}
      </section>
    </section>
  );
};
