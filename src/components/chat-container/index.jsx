import "./index.css";
import { FC, useState } from "react";
import { SvgImg } from "../svg-img";

export const ChatContainer = () => {
  const userProfile = "";
  const userName = "Byrom Guittet";

  const [calling, setCalling] = useState(false);

  const onClickChatAudio = () => {
    setCalling(true); // 不应该加在这里，应该加在被呼叫方 监听到被呼叫消息回调时展示
    console.log("onClickChat");
  };

  const onClickChatVideo = () => {
    console.log("onClickChatVideo");
  };

  const onClickChatMore = () => {
    console.log("onClickChatMore");
  };

  const onClickCalling = () => {
    console.log("onClickCalling");
  };

  const onClickCancel = () => {
    console.log("onClickCancel");
  };

  const onClickSendMsg = () => {
    console.log("onClickSendMsg");
  };

  return (
    <section className="chat-container">
      <div className="chat-header">
        <div className="left-box">
          <SvgImg className="user-icon" type={userProfile}></SvgImg>
          <span className="uesr-name">{userName}</span>
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
        <input type="text" className="form-control" placeholder="Enter Message"/>
        <div className="send-box" onClick={onClickSendMsg}>
          <SvgImg type="send-msg"></SvgImg>
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
    </section>
  );
};
