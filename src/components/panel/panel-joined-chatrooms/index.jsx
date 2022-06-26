import { useEffect, useState } from "react";
import { IMManager } from "../../../utils/im";
import "./index.css";

const manager = IMManager.getInstance();

export const PanelJoinedChatrooms = () => {
  const [myGroups, setMyGroups] = useState([]);

  useEffect(()=>{
    getMyGroup()
  },[])

  const getMyGroup = async () => {
    const data = (await manager.getMyGroup()).data || []
    setMyGroups(data)
  };

  return (
    <section className="joined-chatrooms">
      <div>Joined Chatrooms</div>
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
