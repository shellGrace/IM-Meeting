import React, { useState, useEffect } from "react";
import { agoraRTCManager } from "../../utils/rtc/index";
import { MediaPlayer } from "../media-player";
import { SvgImg } from "../svg-img";
import "./index.css";

const AudioContainer = () => {
  const [remoteUsers, setRemoteUsers] = useState([
    {
      uid: "user1",
    },
    {
      uid: "user2",
    },
    {
      uid: "user3",
    },
  ]);

  useEffect(() => {
    agoraRTCManager.on("user-joined", async (user) => {
      setRemoteUsers([...remoteUsers, user]); // 远端用户渲染
    });
  }, []);

  return (
    <section className="audio-container">
      <div className="conversation-wrapper">
        <div className="user-card">
          <SvgImg className="mic-icon" type="chat-call"></SvgImg>
          <MediaPlayer
            videoTrack={undefined}
            audioTrack={agoraRTCManager.localAudioTrack}
          ></MediaPlayer>
        </div>
        {remoteUsers.map((user) => (
          <div className="user-card" key={user.uid}>
            <p className="user-text">{`remote-(${user.uid})`}</p>
            <SvgImg className="remote-icon" type="chat-call"></SvgImg>
            <MediaPlayer
              width={remoteVideoTrack ? 400 : 0}
              height={remoteAudioTrack ? 300 : 0}
              videoTrack={undefined}
              audioTrack={remoteAudioTrack}
            ></MediaPlayer>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AudioContainer;
