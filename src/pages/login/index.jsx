import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IMManager, getRandomStr } from "../../utils";
import { addSessionInfo } from "../../redux/session";
import "./index.css";

// 登录页
export const LoginPage = () => {
  const [register, setRegister] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({
    userId: "",
    roomId: "",
    userName: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const manager = IMManager.getInstance();
    manager.init();
  }, []);

  const onClickEnter = async () => {
    const manager = IMManager.getInstance();
    const res = await manager.login({
      username: sessionInfo.userName,
      password: sessionInfo.userName,
    });
    dispatch(
      addSessionInfo({
        userId: sessionInfo.userId,
        roomId: sessionInfo.roomId,
        userName: sessionInfo.userName,
      })
    );
    navigate("main");
  };

  const onClickRegister = async () => {
    const manager = IMManager.getInstance();
    await manager.register({
      username: sessionInfo.userName,
      password: sessionInfo.userName,
    });
    setRegister(true);
  };

  return (
    <div className="login-page">
      <section className="login-body">
        <div className="body-header">IM-Meeting</div>
        <section className="body-item">
          <span>UserName</span>
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
          <span className="btn" onClick={onClickRegister}>
            注册
          </span>
          <span className="btn login" onClick={onClickEnter}>
            登录
          </span>
          <br />
          <br />
          <br />
          {register && <span className="register-text">register success!</span>}
        </div>
      </section>
    </div>
  );
};

window.onunload = async (e) => {
  await agoraRTCManager.leave();
  await agoraRTMManager.leave();
};
