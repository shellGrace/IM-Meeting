import { useEffect, useState } from "react";
import { IMManager } from "../../../utils/im";
import "./index.css";

const manager = IMManager.getInstance();

export const PanelAllChatRooms = () => {
  const [groupname, setGroupname] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(()=>{
    getPublicListGroups()
  },[])

  const createGroupNew = async () => {
   await manager.createGroupNew({
      groupname,
      desc: "test desc",
    });
    await getPublicListGroups()
  };

  const getPublicListGroups = async () => {
    const data = (await manager.getPublicListGroups())?.data || [];
    setGroups(data);
  };

  const joinGroup = async (groupId) => {
    await manager.joinGroup({
      groupId,
      msg:'我要加入群组'
    })
  }

  return (
    <section className="all-chat-rooms">
      <div>All Chat Rooms</div>
      <button className="item" onClick={getPublicListGroups}>
        获取所有群组
      </button>
      <div style={{ marginTop: 5 }}>
        <input
          className="input-wrapper"
          value={groupname}
          onChange={(e) => setGroupname(e.target.value)}
        ></input>
        <button className="btn-creat" onClick={createGroupNew}>
          创建群组
        </button>
      </div>
      <section>
        {groups.map((item) => (
          <div key={item.groupid} className="group-item">
            <span className="group-name">{item.groupid}-{item.groupname}</span>
            <button className="add-group" onClick={()=>joinGroup(item.groupid)}>加入群组</button>
          </div>
        ))}
      </section>
    </section>
  );
};
