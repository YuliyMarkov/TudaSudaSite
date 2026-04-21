import { useEffect, useMemo } from "react";

function normalizeInstagramUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes("instagram.com") &&
      !parsed.pathname.endsWith("/embed")
    ) {
      const cleanPath = parsed.pathname.replace(/\/+$/, "");
      return `https://www.instagram.com${cleanPath}/embed`;
    }

    return url;
  } catch {
    return url;
  }
}

function ReelsModal({ isOpen, reel, onClose }) {
  const isInstagram = reel?.sourceType === "instagram";
  const embedUrl = useMemo(() => {
    return isInstagram ? normalizeInstagramUrl(reel?.videoUrl) : reel?.videoUrl;
  }, [isInstagram, reel?.videoUrl]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeydown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !reel) return null;

  return (
    <div className="reels-modal-backdrop" onClick={onClose}>
      <div className="reels-modal" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="reels-modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ✕
        </button>

        {isInstagram ? (
          <div className="reels-modal-frame-wrap">
            <iframe
              src={embedUrl}
              title={reel.title || "Instagram Reel"}
              className="reels-modal-iframe"
              allowTransparency="true"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        ) : (
          <video
            src={reel.videoUrl}
            className="reels-modal-video"
            controls
            autoPlay
            playsInline
          />
        )}
      </div>
    </div>
  );
}

export default ReelsModal;