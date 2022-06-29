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
import { saveMessage, ChatTypesEnum } from "../../redux/chat";
import { useSelector } from "react-redux";
import { CallCard } from "./call-card";

const manager = IMManager.getInstance();

export const CallTypeEnum = {
  Video: "video",
  Audio: "audio",
};

export const ChatContainer = () => {
  const userProfile = "";

  const [videoCalling, setVideoCalling] = useState(false);
  const [audioCalling, setAudioCalling] = useState(false);
  const [msg, setMsg] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [callType, setCallType] = useState("");
  const dispatch = useDispatch();
  const { userName } = useSelector((store) => store.session);

  let { channelId, chatType, to, channelName } = useSelector((store) => store.chat);

  useEffect(() => {
    manager.on("onCmdMessage", (msg) => {
      const { action } = msg;
      if (action === "calling-audio") {
        // 收到语音 calling
        setCallType(CallTypeEnum.Audio);
        setShowCard(true);
      } else if (action == "calling-video") {
        // 收到视频 calling
        setCallType(CallTypeEnum.Video);
        setShowCard(true);
      }
    });
  }, []);

  useEffect(() => {
    return async () => {
      // 切换会话时 关闭音视频
      if (agoraRTCManager.joined) {
        await agoraRTCManager.unpublish();
        await agoraRTCManager.leave();
      }
    };
  }, [channelId]);

  const onClickChatAudio = async () => {
    // 发起语音呼叫
    const finTo = chatType == ChatTypesEnum.SingleChat ? to : channelName;
    manager.sendCmdMessage({
      to: finTo,
      action: "calling-audio",
      gType: chatType === ChatTypesEnum.GroupChat,
    });
    // 加入rtc频道
    await agoraRTCManager.join(userName, channelName);
    // 发流
    await agoraRTCManager.publish();
    // 显示语音渲染弹窗
    setAudioCalling(true);
  };

  const onClickChatVideo = async () => {
    // 发起视频呼叫
    const finTo = chatType == ChatTypesEnum.SingleChat ? to : channelName;
    manager.sendCmdMessage({
      to: finTo,
      action: "calling-video",
      gType: chatType === ChatTypesEnum.GroupChat,
    });
    // 加入rtc频道
    await agoraRTCManager.join(userName, channelName);
    // 发流
    await agoraRTCManager.publish();
    // 显示视频渲染弹窗
    setVideoCalling(true);
  };

  const onClickChatMore = () => {
    console.log("onClickChatMore");
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

  // 关闭CallCard弹窗
  const onCancelCallCard = () => {
    setShowCard(false);
  };

  // 确认开始音视频弹窗
  const onConfirmCallCard = async () => {
    setShowCard(false);
    if (callType === CallTypeEnum.Audio) {
      // 加入rtc频道
      await agoraRTCManager.join(userName, channelName);
      // 发流
      await agoraRTCManager.publish();
      //  显示语音渲染弹窗
      setAudioCalling(true);
    } else if (callType === CallTypeEnum.Video) {
      // 加入rtc频道
      await agoraRTCManager.join(userName, channelName);
      // 发流
      await agoraRTCManager.publish();
      // 显示视频渲染弹窗
      setVideoCalling(true);
    }
  };

  // 关闭语音和视频
  const onCloseMedia = async () => {
    setVideoCalling(false);
    setAudioCalling(false);
    if (agoraRTCManager.joined) {
      await agoraRTCManager.unpublish();
      await agoraRTCManager.leave();
    }
  };

  return channelId ? (
    <section className="chat-container">
      <div className="chat-header">
        <div className="left-box">
          <SvgImg className="user-icon" type={userProfile}></SvgImg>
          <span className="uesr-name">{to} </span>
          <span>{chatType === ChatTypesEnum.SingleChat ? "单聊" : "群聊"}</span>
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
      <CallCard
        type={callType}
        show={showCard}
        onCancel={onCancelCallCard}
        onConfirm={onConfirmCallCard}
      ></CallCard>
      <ChatContent></ChatContent>
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
      {audioCalling && <AudioContainer onClose={onCloseMedia}></AudioContainer>}
      {videoCalling && <VideoContainer onClose={onCloseMedia}></VideoContainer>}
    </section>
  ) : (
    <section className="chat-container"></section>
  );
};
