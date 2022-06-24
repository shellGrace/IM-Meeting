import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IMManager,getRandomStr } from "../../utils";
import { addSessionInfo } from "../../redux/session";
import "./index.css";

// 登录页
export const LoginPage = () => {
  const [sessionInfo, setSessionInfo] = useState({
    userId: getRandomStr(8),
    roomId: getRandomStr(8),
    userName:getRandomStr(8)
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickEnter = async () => {
    dispatch(
      addSessionInfo({
        userId: sessionInfo.userId,
        roomId: sessionInfo.roomId,
        userName:sessionInfo.userName
      })
    );
    const manager = IMManager.getInstance();
    manager.init();
    await manager.register({
      username: sessionInfo.userName,
      password: sessionInfo.userName,
    })
    // await manager.login({
    //   username:"cascas",
    //   password:"cascas"
    // })
    // navigate("main");
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
        <section className="body-item">
          <span>User Name</span>
          <input
            className="input-wrapper"
            value={sessionInfo.userName}
            onChange={(e) =>
              setSessionInfo((pre) => ({
                ...pre,
                userName: e.target.value,
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
