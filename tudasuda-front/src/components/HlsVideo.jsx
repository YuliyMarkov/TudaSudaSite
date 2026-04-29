import { useEffect, useRef } from "react";
import Hls from "hls.js";

function HlsVideo({ src, title, autoPlay = false, poster = "" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const tryPlay = () => {
      if (!autoPlay) return;

      const playPromise = video.play();

      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.warn("Autoplay blocked:", error);
        });
      }
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", tryPlay, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", tryPlay);
      };
    }

    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);

      return () => {
        hls.destroy();
      };
    }
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className="movie-hls-video"
      title={title}
      controls
      playsInline
      preload="metadata"
      poster={poster}
    />
  );
}

export default HlsVideo;