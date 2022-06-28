import "./index.css";
import { FC, useState, useEffect, useMemo } from "react";
import { SvgImg } from "../svg-img";
import { ChatContent } from "./chat-content";
import VideoContainer from "../video-call";
import AudioContainer from "../audio-call";
import { agoraRTCManager } from "../../utils/rtc";
import { IMManager } from "../../utils/im";
import { getIdfromChannel } from "../../utils";
import { useDispatch } from "react-redux";
import { saveMessage } from "../../redux/chat";
import { ChatTypesEnum } from "../../redux/chat";
import { useSelector } from "react-redux";

const manager = IMManager.getInstance();

export const ChatContainer = () => {
  const userProfile = "";

  // TODO: need work (lijuan)
  // AGORA_APP_ID 这些从 env 里面获取 不需要在业务外面获取
  const AGORA_APP_ID = "c224c383433a4cd0b6aec36cb2e606f0";
  const AGORA_TOKEN = "";
  const roomId = "";

  const [calling, setCalling] = useState(false);
  const [videoCalling, setVideoCalling] = useState(false);
  const [audioCalling, setAudioCalling] = useState(false);
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const { userName } = useSelector((store) => store.session);
  let { channelId, chatType, to, channelName, messgaes } = useSelector((store) => store.chat);

  useEffect(async () => {
    manager.on("cmd-message", (msg) => {
      console.log("====cmd-message", msg);
      setCalling(true); // 收到来电消息展示电话卡片
    });
  }, []);

  const onClickChatAudio = () => {
    // ues1 根据当前用户来传值
    manager.sendCmdMessage("ues1", "calling", isGroup);
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
      setVideoCalling(true);
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
    setAudioCalling(true);
  };

  const onClickCancel = () => {
    setCalling(false);
  };

  const onClickSendMsg = async () => {
    const finalTo = chatType == ChatTypesEnum.SingleChat ? to : channelName;
    await manager.sendText({
      msg,
      to: finalTo,
      chatType,
    });
    dispatch(
      saveMessage(
        {
          from: userName,
          to: finalTo,
          msg,
          time: new Date().getTime(),
        },
        {
          channelId,
        }
      )
    );
    setMsg("");
  };

  return (
    <section className="chat-container">
      <div className="chat-header">
        <div className="left-box">
          <SvgImg className="user-icon" type={userProfile}></SvgImg>
          {channelId ? (
            <>
              <span className="uesr-name">{to} </span>
              <span>{chatType === ChatTypesEnum.SingleChat ? "单聊" : "群聊"}</span>
            </>
          ) : null}
        </div>
        <div className="right-box">
          {channelId && (
            <div className="call-box" onClick={onClickChatAudio}>
              <SvgImg className="call-icon" type="chat-call"></SvgImg>
            </div>
          )}
          {channelId && (
            <div className="call-box" onClick={onClickChatVideo}>
              <SvgImg className="call-icon" type="video-call"></SvgImg>
            </div>
          )}
          <div className="call-box" onClick={onClickChatMore}>
            <SvgImg className="call-icon" type="circle-more"></SvgImg>
          </div>
        </div>
      </div>
      <ChatContent></ChatContent>
      {channelId && (
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
      )}
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
      {audioCalling && (
        <div className="audio-area">
          <AudioContainer></AudioContainer>
        </div>
      )}
      {videoCalling && (
        <div className="video-area">
          <VideoContainer></VideoContainer>
        </div>
      )}
    </section>
  );
};
