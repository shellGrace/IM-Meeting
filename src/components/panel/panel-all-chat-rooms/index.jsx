import { useState } from "react";
import { IMManager } from "../../../utils/im";
import "./index.css";

export const PanelAllChatRooms = () => {
  const [groupname, setGroupname] = useState("");
  const manager = IMManager.getInstance();

  const createGroupNew = async () => {
    manager.createGroupNew({
      groupname,
      desc:"test desc"
    });
  };

  return (
    <section className="all-chat-rooms">
      <div>
        <span className="item" onClick={createGroupNew}>
          获取所有群组
        </span>
      </div>
      <div style={{mar}}>
        <span className="item" onClick={createGroupNew}>
          创建群组
        </span>
        <input
          className="input-wrapper"
          value={groupname}
          onChange={(e) => setGroupname(e.target.value)}
        ></input>
      </div>
    </section>
  );
};
