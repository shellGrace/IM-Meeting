import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { agoraRTCManager } from "../../utils/rtc/index";
import { MediaPlayer } from "../media-player";
import "./index.css";

const VideoContainer = () => {
  const [remoteUsers, setRemoteUsers] = useState([]);
  const { userName } = useSelector((store) => store.session)
  const [remoteVideoTrack, setRemoteVideoTrack] = useState();
  const [remoteAudioTrack, setRemoteAudioTrack] = useState();

  useEffect(async() => {
    for (let user of agoraRTCManager.remoteUsers) {
      user.hasVideo && (await agoraRTCManager.subscribe(user, "video"));
      user.hasAudio && (await agoraRTCManager.subscribe(user, "audio"));
      user.videoTrack && setRemoteVideoTrack(user.videoTrack);
      user.audioTrack && setRemoteAudioTrack(user.audioTrack);
    }
    // for (let user of agoraRTCManager.remoteUsers) {
    //   await agoraRTCManager.unsubscribe(user, "video");
    //   await agoraRTCManager.unsubscribe(user, "audio");
    //   setRemoteVideoTrack(null);
    //   setRemoteAudioTrack(null);
    // }
    // agoraRTCManager.on("user-joined", async (user) => {
    // });
  }, []);

  return (
    <section className="video-container">
      <div className="player-container">
        <div className="local-player-wrapper">
          <div className="player-wrapper">
           <p className="player-text">{`local-${userName}`}</p>
            <MediaPlayer
              videoTrack={agoraRTCManager.localVideoTrack}
              audioTrack={agoraRTCManager.localAudioTrack}
            ></MediaPlayer>
          </div>
          {agoraRTCManager.remoteUsers.map((user) => (
            <div className="player-wrapper" key={user.uid}>
              <p className="player-text">{`remote-${user.uid}`}</p>
              <MediaPlayer
                width={remoteVideoTrack ? 180 : 0}
                height={remoteAudioTrack ? 120 : 0}
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

export default VideoContainer;
