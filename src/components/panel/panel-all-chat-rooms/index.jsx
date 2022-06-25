import { useState } from "react";
import { IMManager } from "../../../utils/im";
import "./index.css";

export const PanelAllChatRooms = () => {
  const [groupname, setGroupname] = useState("");

  const [groups, setGroups] = useState([]);
  const manager = IMManager.getInstance();

  const createGroupNew = async () => {
    manager.createGroupNew({
      groupname,
      desc: "test desc",
    });
  };

  const getPublicListGroups = async () => {
    const data = (await manager.getPublicListGroups()).data || [];
    setGroups(data);
  };

  return (
    <section className="all-chat-rooms">
      <div>
        <span className="item" onClick={getPublicListGroups}>
          获取所有群组
        </span>
      </div>
      <div style={{ marginTop: 30 }}>
        <span className="item" onClick={createGroupNew}>
          创建群组
        </span>
        <input
          className="input-wrapper"
          value={groupname}
          onChange={(e) => setGroupname(e.target.value)}
        ></input>
      </div>
      <section>
        {groups.map((item) => (
          <div key={item.groupid} className="group-item">
            <span>{item.groupid}</span>
            <span style={{ marginLeft: 5 }}>{item.groupname}</span>
            <span className="add-group">加入群组</span>
          </div>
        ))}
      </section>
    </section>
  );
};
