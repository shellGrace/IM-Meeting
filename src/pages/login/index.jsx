import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMManager } from "../../utils";
import "./index.css";


// 登录页
export const LoginPage = () => {
  const [sessionInfo, setSessionInfo] = useState({
    userId: "",
    roomId: "",
  });
  const navigate = useNavigate();

  const onClickEnter = async () => {
    const manager = IMManager.getInstance();
    manager.initIMSDK(EASEMOB_APP_KEY);
    navigate("main");
  };

  return (
    <div className="login-page">
      <section className="login-body">
        <div className="body-header">XXX Meeting</div>
        <section className="body-item">
          <span>Room ID</span>
          <input
            className="input-wrapper"
            value={sessionInfo.roomId}
            onChange={(e) =>
              setSessionInfo((pre) => ({
                ...pre,
                roomId: e.target.value,
              }))
            }
          ></input>
        </section>
        <section className="body-item">
          <span>User ID</span>
          <input
            className="input-wrapper"
            value={sessionInfo.userId}
            onChange={(e) =>
              setSessionInfo((pre) => ({
                ...pre,
                userId: e.target.value,
              }))
            }
          ></input>
        </section>
        <div className="body-bottom">
          <span className="btn" onClick={onClickEnter}>
            Enter
          </span>
        </div>
      </section>
    </div>
  );
};

window.onunload = async (e) => {
  await agoraRTCManager.leave();
  await agoraRTMManager.leave();
};
