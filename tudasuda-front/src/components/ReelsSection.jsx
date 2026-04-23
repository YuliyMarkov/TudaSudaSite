import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "";
const INSTAGRAM_URL = "https://www.instagram.com/tudasudauz/";

function ReelsSection({ onOpenReel }) {
  const { language } = useLanguage();
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  const uiText = {
    ru: {
      title: "Reels",
      prev: "Предыдущее видео",
      next: "Следующее видео",
      instagram: "Instagram",
      allVideos: "Смотреть все видео →",
    },
    uz: {
      title: "Reels",
      prev: "Oldingi video",
      next: "Keyingi video",
      instagram: "Instagram",
      allVideos: "Barcha videolarni ko‘rish →",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadReels() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/reels?lang=${language}&activeOnly=true`
        );

        if (!response.ok) {
          throw new Error("Failed to load reels");
        }

        const data = await response.json();
        setReels(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD REELS ERROR:", error);
        setReels([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadReels();
  }, [language]);

  const normalizedReels = useMemo(() => {
    return reels
      .map((item) => {
        const translation = item.translations?.[0] || null;

        return {
          id: item.id,
          image: item.coverImage,
          videoUrl: item.videoUrl,
          title: translation?.title || "",
          sourceType: item.sourceType || "instagram",
        };
      })
      .filter((item) => item.image && item.videoUrl);
  }, [reels]);

  const totalItems = normalizedReels.length + 1;
  const maxIndex = Math.max(0, totalItems - visibleCount);

  useEffect(() => {
    const updateMetrics = () => {
      if (!viewportRef.current || !trackRef.current) return;

      const firstItem = trackRef.current.querySelector(
        ".reels-list-item, .reels-list-item-more"
      );

      if (!firstItem) return;

      const itemWidth = firstItem.getBoundingClientRect().width;
      const trackStyle = window.getComputedStyle(trackRef.current);
      const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;
      const fullStep = itemWidth + gap;
      const viewportWidth = viewportRef.current.getBoundingClientRect().width;

      let nextVisibleCount = Math.floor((viewportWidth + gap) / fullStep);

      if (!Number.isFinite(nextVisibleCount) || nextVisibleCount < 1) {
        nextVisibleCount = 1;
      }

      const nextMaxIndex = Math.max(0, totalItems - nextVisibleCount);

      setStep(fullStep);
      setVisibleCount(nextVisibleCount);
      setIndex((prev) => Math.min(prev, nextMaxIndex));
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);

    return () => {
      window.removeEventListener("resize", updateMetrics);
    };
  }, [totalItems]);

  useEffect(() => {
    setIndex(0);
  }, [language, normalizedReels.length]);

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading || !normalizedReels.length) return null;

  return (
    <section className="reels-section">
      <div className="section-header section-header--reels">
        <h2 className="section-title">{t.title}</h2>

        <div className="section-nav">
          <button
            type="button"
            className="section-nav-btn"
            onClick={prev}
            disabled={index === 0}
            aria-label={t.prev}
          >
            ❮
          </button>

          <button
            type="button"
            className="section-nav-btn"
            onClick={next}
            disabled={index >= maxIndex}
            aria-label={t.next}
          >
            ❯
          </button>
        </div>
      </div>

      <div className="reels-viewport" ref={viewportRef}>
        <div
          className="reels-list"
          ref={trackRef}
          style={{ transform: `translateX(-${index * step}px)` }}
        >
          {normalizedReels.map((reel) => (
            <button
              key={reel.id}
              type="button"
              className="reels-list-item"
              onClick={() => onOpenReel(reel)}
              aria-label={reel.title || t.title}
            >
              <img src={reel.image} alt={reel.title || t.title} />
              <div className="reels-list-overlay">
                <span className="reels-list-play">▶</span>
                <span className="reels-list-badge">{t.instagram}</span>
              </div>
            </button>
          ))}

          <a
            className="reels-list-item-more"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
          >
            {t.allVideos}
          </a>
        </div>
      </div>
    </section>
  );
}

export default ReelsSection;