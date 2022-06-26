import React, { useRef, useEffect } from "react";

export const MediaPlayer = ({
  videoTrack,
  audioTrack,
  width = 400,
  height = 300,
}) => {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    videoTrack?.play(container.current);
    return () => {
      videoTrack?.stop();
    };
  }, [container, videoTrack]);

  useEffect(() => {
    if (audioTrack) {
      audioTrack?.play();
    }
    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack]);

  return (
    <div ref={container} className="video-player" style={{ width: width, height: height }}></div>
  );
};

export default MediaPlayer;
