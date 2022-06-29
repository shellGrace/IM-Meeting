import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { agoraRTCManager } from "../../utils/rtc/index";
import { MediaPlayer } from "../media-player";
import { SvgImg } from "../svg-img";
import "./index.css";

const AudioContainer = ({ onClose }) => {
  const [remoteUsers, setRemoteUsers] = useState(agoraRTCManager.remoteUsers);

  useEffect(() => {
    agoraRTCManager.on("user-published", () => {
      setRemoteUsers(agoraRTCManager.remoteUsers);
    });
    agoraRTCManager.on("user-unpublished", () => {
      setRemoteUsers(agoraRTCManager.remoteUsers);
    });
  }, []);

  return (
    <section className="audio-container">
      <span className="close" onClick={onClose}>
        关闭
      </span>
      <div className="conversation-wrapper">
        <div className="user-card">
          <SvgImg className="mic-icon" type="chat-call"></SvgImg>
          <MediaPlayer
            videoTrack={undefined}
            audioTrack={agoraRTCManager.localAudioTrack}
          ></MediaPlayer>
        </div>
        {remoteUsers.map((user) =>
          user.audioTrack ? (
            <div className="user-card" key={user.uid}>
              <p className="user-text">{`remote-(${user.uid})`}</p>
              <SvgImg className="remote-icon" type="chat-call"></SvgImg>
              <MediaPlayer videoTrack={undefined} audioTrack={user.audioTrack}></MediaPlayer>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};

export default AudioContainer;
