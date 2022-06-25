import { useState } from "react";
import { IMManager } from "../../../utils/im";
import "./index.css";

export const PanelMessages = () => {
  const [sessionList, setSessionList] = useState([]);

  const manager = IMManager.getInstance();

  const getSessionList = async () => {
    const data = (await manager.getSessionList()).data || [];
    setSessionList(data);
  };

  return (
    <section className="messages">
      <div onClick={getSessionList} className="item">
        获取会话列表
      </div>
      <section>
        {sessionList.map((item) => (
          <div key={item.channel_id} className="group-item">
            <span>{item.channel_id}</span>
          </div>
        ))}
      </section>
    </section>
  );
};
