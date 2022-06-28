import React, { useState, useEffect } from "react";
import { agoraRTCManager } from "../../utils/rtc/index";
import { MediaPlayer } from "../media-player";
import { SvgImg } from "../svg-img";
import "./index.css";

const AudioContainer = () => {
  const [remoteAudioTrack, setRemoteAudioTrack] = useState();

  useEffect(async() => {
    for (let user of agoraRTCManager.remoteUsers) {
      user.hasAudio && (await agoraRTCManager.subscribe(user, "audio"));
      user.audioTrack && setRemoteAudioTrack(user.audioTrack);
    }
    // for (let user of agoraRTCManager.remoteUsers) {
    //   await agoraRTCManager.unsubscribe(user, "audio");
    //   setRemoteAudioTrack(null);
    // }
    // agoraRTCManager.on("user-joined", async (user) => {
    // });
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
        {agoraRTCManager.remoteUsers.map((user) => (
          <div className="user-card" key={user.uid}>
            <p className="user-text">{`remote-(${user.uid})`}</p>
            <SvgImg className="remote-icon" type="chat-call"></SvgImg>
            <MediaPlayer
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
