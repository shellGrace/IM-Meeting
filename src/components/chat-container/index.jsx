import "./index.css";
import { FC, useState } from "react";
import { SvgImg } from "../svg-img";
import VideoContainer from "../video-call";
import { agoraRTCManager } from "../../utils/rtc";
import { IMManager } from "../../utils/im";
import { useDispatch } from "react-redux";
import { saveMessage } from "../../redux/chat";
import { useSelector } from "react-redux";

const manager = IMManager.getInstance();

export const ChatContainer = () => {
  const userProfile = "";
  const name = "Byrom Guittet";

  const AGORA_APP_ID = 'c224c383433a4cd0b6aec36cb2e606f0'
  const AGORA_TOKEN = '006c224c383433a4cd0b6aec36cb2e606f0IABFqgKFLgB8Y7mZVpI7NC5pr6zb3oO0bkYF7gbt+6rMv3dkFWwAAAAAEABGROOec124YgEAAQBzXbhi'
  const roomId = '5348ef'

  const [calling, setCalling] = useState(false);
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const { userName } = useSelector((store) => store.session);

  const onClickChatAudio = () => {
    setCalling(true); // 不应该加在这里，应该加在被呼叫方 监听到被呼叫消息回调时展示
  };

  const onClickChatVideo = async () => {
    try {
      await agoraRTCManager.join(AGORA_APP_ID, roomId, AGORA_TOKEN);
      agoraRTCManager.on("user-published", async (user, mediaType) => {
        await agoraRTCManager.subscribe(user, mediaType);
      });
      agoraRTCManager.on("user-unpublished", async (user, mediaType) => {
        await agoraRTCManager.unsubscribe(user, mediaType);
      });
      await agoraRTCManager.publish();
    } catch (err) {
      alert(err.message);
      await agoraRTCManager.leave();
      throw err;
    }
  };

  const onClickChatMore = () => {
    console.log("onClickChatMore");
  };

  const onClickCalling = () => {
    setCalling(false);
  };

  const onClickCancel = () => {
    setCalling(false);
  };

  const onClickSendMsg = async () => {
    // const res = await manager.sendText({
    //   msg,
    //   to: "ascfa",
    //   chatType: "singleChat",
    // });

    const res = await manager.sendText({
      msg,
      to: "185336537874433",
      chatType: "groupChat",
    });

    // dispatch(
    //   saveMessage(
    //     {
    //       form: "",
    //       to: res.to,
    //       id: res.id,
    //       msg: msg,
    //     },
    //     { isHistory: false }
    //   )
    // );
    // clear
    setMsg("");
  };

  return (
    <section className="chat-container">
      <div className="chat-header">
        <div className="left-box">
          <SvgImg className="user-icon" type={userProfile}></SvgImg>
          <span className="uesr-name">{name}</span>
        </div>
        <div className="right-box">
          <div className="call-box" onClick={onClickChatAudio}>
            <SvgImg className="call-icon" type="chat-call"></SvgImg>
          </div>
          <div className="call-box" onClick={onClickChatVideo}>
            <SvgImg className="call-icon" type="video-call"></SvgImg>
          </div>
          <div className="call-box" onClick={onClickChatMore}>
            <SvgImg className="call-icon" type="circle-more"></SvgImg>
          </div>
        </div>
      </div>
      <div className="chat-content"></div>
      <div className="chat-footer">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="send-box" onClick={onClickSendMsg}>
          <SvgImg className="send-msg" type="send-msg"></SvgImg>
        </div>
      </div>
      {calling && (
        <div className="call-card">
          <span className="text">Calling</span>
          <div className="action-button">
            <button type="button" className="btn" onClick={onClickCancel}>
              cancel
            </button>
            <button type="button" className="btn" onClick={onClickCalling}>
              calling
            </button>
          </div>
        </div>
      )}
      <div className="video-container">
        <VideoContainer></VideoContainer>
      </div>
    </section>
  );
};
