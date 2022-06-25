import { IMManager } from "../../../utils/im";
import { useState } from "react";
import "./index.css";

export const PanelAttendees = () => {
  const [friends, setFriends] = useState([]);

  const manager = IMManager.getInstance();

  const getRoster = async () => {
    const data = (await manager.getRoster()).data || [];
    setFriends(data);
  };

  return (
    <section className="attendees">
      <div onClick={getRoster} className="item">
        获取我的好友
      </div>
      <section>
        {friends.map((item) => (
          <div key={item.groupid} className="group-item">
            <span>{item.groupid}</span>
            <span style={{ marginLeft: 5 }}>{item.groupname}</span>
          </div>
        ))}
      </section>
    </section>
  );
};
