import { useState } from "react";
import { IMManager } from "../../../utils/im";
import "./index.css";

export const PanelJoinedChatrooms = () => {
  const [myGroups, setMyGroups] = useState([]);

  const manager = IMManager.getInstance();

  const getMyGroup = async () => {
    const res = await manager.getMyGroup();
    console.log("res", res);
  };

  return (
    <section className="joined-chatrooms">
      <div onClick={getMyGroup} className="item">
        获取我的群组
      </div>
      <section>
        {myGroups.map((item) => (
          <div key={item.groupid} className="group-item">
            <span>{item.groupid}</span>
            <span style={{ marginLeft: 5 }}>{item.groupname}</span>
          </div>
        ))}
      </section>
    </section>
  );
};
