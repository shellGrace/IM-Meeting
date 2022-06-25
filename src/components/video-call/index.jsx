import React, { useState, useEffect } from "react";
import { agoraRTCManager } from "../../utils/rtc/index";
import { MediaPlayer } from "./media-player";
import "./index.css";

const VideoContainer = () => {
  const [remoteUsers, setRemoteUsers] = useState([])

  useEffect(() => {
    agoraRTCManager.on("user-joined", async (user) => {
      setRemoteUsers([...remoteUsers, user]) // 远端用户渲染
    });
  }, []);

  return (
    <section className="video-container">
      <div className="player-container">
        <div className="local-player-wrapper">
          <MediaPlayer
            videoTrack={agoraRTCManager.localVideoTrack}
            audioTrack={agoraRTCManager.localAudioTrack}
          ></MediaPlayer>
          {remoteUsers.map((user) => (
            <div className="remote-player-wrapper" key={user.uid}>
              <p className="remote-player-text">{`remoteVideo(${user.uid})`}</p>
              <MediaPlayer
                width={remoteVideoTrack ? 400 : 0}
                height={remoteAudioTrack ? 300 : 0}
                videoTrack={remoteVideoTrack}
                audioTrack={remoteAudioTrack}
              ></MediaPlayer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoContainer