import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { agoraRTCManager } from "../../utils/rtc/index";
import { MediaPlayer } from "../media-player";
import "./index.css";

const VideoContainer = ({ onClose }) => {
  const { userName } = useSelector((store) => store.session);
  const [remoteUsers, setRemoteUsers] = useState(agoraRTCManager.remoteUsers);

  useEffect(() => {
    agoraRTCManager.on("user-published", () => {
      setRemoteUsers(agoraRTCManager.remoteUsers);
    });
    agoraRTCManager.on("user-unpublished", () => {
      setRemoteUsers(agoraRTCManager.remoteUsers);
    });

    return () => {
      agoraRTCManager.removeAllListeners("user-published");
      agoraRTCManager.removeAllListeners("user-unpublished");
    };
  }, []);

  return (
    <section className="video-container">
      <span className="close" onClick={onClose}>
        关闭
      </span>
      <div className="player-container">
        <div className="local-player-wrapper">
          <div className="player-wrapper">
            <p className="player-text">{`local-${userName}`}</p>
            <MediaPlayer
              videoTrack={agoraRTCManager.localVideoTrack}
              audioTrack={agoraRTCManager.localAudioTrack}
            ></MediaPlayer>
          </div>
          {remoteUsers.map((user) =>
            user.videoTrack || user.audioTrack ? (
              <div className="player-wrapper" key={user.uid}>
                <p className="player-text">{`remote-${user.uid}`}</p>
                <MediaPlayer
                  width={180}
                  height={120}
                  videoTrack={user.videoTrack}
                  audioTrack={user.audioTrack}
                ></MediaPlayer>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoContainer;
