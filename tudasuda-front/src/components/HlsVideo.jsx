import { useEffect, useRef } from "react";
import Hls from "hls.js";

function HlsVideo({ src, title }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => hls.destroy();
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="movie-hls-video"
      title={title}
      controls
      playsInline
      preload="metadata"
    />
  );
}

export default HlsVideo;