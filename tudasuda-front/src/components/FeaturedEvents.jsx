import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hls from "hls.js";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "http://localhost:4000";

function buildSlideLink(language, slide) {
  const linkType = slide.linkType || "custom";
  const linkUrl = slide.linkUrl || "";

  if (linkType === "custom") {
    if (!linkUrl) return `/${language}`;
    if (linkUrl.startsWith("http://") || linkUrl.startsWith("https://")) {
      return linkUrl;
    }
    if (linkUrl.startsWith("/")) return linkUrl;
    return `/${language}/${linkUrl}`;
  }

  switch (linkType) {
    case "stories":
      return slide.linkUrl
        ? `/${language}/stories/${slide.linkUrl}`
        : `/${language}/stories`;

    case "movies":
    case "cinema":
      return slide.linkUrl
        ? `/${language}/movies/${slide.linkUrl}`
        : `/${language}/cinema`;

    case "event":
      return slide.linkUrl
        ? `/${language}/events/${slide.linkUrl}`
        : `/${language}/events`;

    case "concerts":
      return slide.linkUrl
        ? `/${language}/events/${slide.linkUrl}`
        : `/${language}/events?filter=concert`;

    case "theatre":
      return slide.linkUrl
        ? `/${language}/events/${slide.linkUrl}`
        : `/${language}/events?filter=theatre`;

    case "exhibitions":
      return slide.linkUrl
        ? `/${language}/events/${slide.linkUrl}`
        : `/${language}/events?filter=exhibition`;

    case "kids":
      return slide.linkUrl
        ? `/${language}/events/${slide.linkUrl}`
        : `/${language}/events?filter=kids`;

    case "restaurants":
      return slide.linkUrl
        ? `/${language}/restaurants/${slide.linkUrl}`
        : `/${language}/restaurants`;

    case "places":
      return slide.linkUrl
        ? `/${language}/places/${slide.linkUrl}`
        : `/${language}/places`;

    default:
      return `/${language}`;
  }
}

function FeaturedEvents() {
  const { language } = useLanguage();

  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const videoRefs = useRef([]);
  const hlsRefs = useRef([]);

  const uiText = {
    ru: {
      main: "Главные события",
      prev: "Предыдущее событие",
      next: "Следующее событие",
      open: "Открыть событие",
    },
    uz: {
      main: "Asosiy tadbirlar",
      prev: "Oldingi tadbir",
      next: "Keyingi tadbir",
      open: "Tadbirni ochish",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadSlides() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/hero-slides?lang=${language}&activeOnly=true`
        );

        if (!response.ok) {
          throw new Error("Failed to load hero slides");
        }

        const data = await response.json();
        setSlides(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD HERO SLIDES ERROR:", error);
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSlides();
  }, [language]);

  const normalizedSlides = useMemo(() => {
    return slides
      .filter((item) => item.isActive !== false)
      .map((item) => {
        const translation = item.translations?.[0] || null;

        return {
          id: item.id,
          title: translation?.title || "",
          subtitle: translation?.subtitle || "",
          poster: item.previewImage,
          hoverMediaType: item.hoverMediaType || "image",
          hoverMediaUrl: item.hoverMediaUrl || "",
          linkType: item.linkType || "custom",
          linkUrl: item.linkUrl || "",
        };
      })
      .filter((item) => item.poster);
  }, [slides]);

  const totalSlides = normalizedSlides.length;

  useEffect(() => {
    setCurrentSlide(0);
    setIsHovered(false);
  }, [language, totalSlides]);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setIsHovered(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    setIsHovered(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsHovered(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;

    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (Math.abs(diff) < swipeThreshold) return;

    if (diff > 0) {
      goToNext();
    } else {
      goToPrev();
    }
  };

  const getSlidePosition = (index) => {
    if (index === currentSlide) return "active";
    if (index === (currentSlide - 1 + totalSlides) % totalSlides) return "prev";
    if (index === (currentSlide + 1) % totalSlides) return "next";

    const distanceForward = (index - currentSlide + totalSlides) % totalSlides;
    const distanceBackward = (currentSlide - index + totalSlides) % totalSlides;

    return distanceBackward < distanceForward ? "hidden-left" : "hidden-right";
  };

  useEffect(() => {
    hlsRefs.current.forEach((hls) => {
      if (hls) hls.destroy();
    });
    hlsRefs.current = [];

    normalizedSlides.forEach((slide, index) => {
      const videoEl = videoRefs.current[index];
      const videoSrc =
        slide.hoverMediaType === "video" ? slide.hoverMediaUrl : "";

      if (!videoEl || !videoSrc) return;

      if (videoSrc.endsWith(".m3u8")) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
          });

          hls.loadSource(videoSrc);
          hls.attachMedia(videoEl);

          hls.on(Hls.Events.ERROR, (_, data) => {
            console.error("HLS error:", data);
          });

          hlsRefs.current[index] = hls;
        } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
          videoEl.src = videoSrc;
          videoEl.load();
        }
      } else {
        videoEl.src = videoSrc;
        videoEl.load();
      }
    });

    return () => {
      hlsRefs.current.forEach((hls) => {
        if (hls) hls.destroy();
      });
      hlsRefs.current = [];
    };
  }, [normalizedSlides]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === currentSlide && isHovered) {
        video.play().catch(() => {});
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          // ignore
        }
      }
    });
  }, [currentSlide, isHovered]);

  if (isLoading || !normalizedSlides.length) return null;

  return (
    <section className="featured-events">
      <div className="container">
        <div className="featured-events-header">
          <h2>{t.main}</h2>
        </div>

        <div className="featured-events-carousel-wrap">
          <button
            className="featured-events-nav prev"
            type="button"
            aria-label={t.prev}
            onClick={goToPrev}
          >
            &#10094;
          </button>

          <div
            className="featured-events-carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {normalizedSlides.map((slide, index) => {
              const positionClass = getSlidePosition(index);
              const title = slide.title;
              const subtitle = slide.subtitle;
              const alt = slide.title;
              const hasVideo =
                slide.hoverMediaType === "video" && Boolean(slide.hoverMediaUrl);
              const href = buildSlideLink(language, slide);
              const isExternal =
                href.startsWith("http://") || href.startsWith("https://");

              const content = (
                <>
                  <div className="event-slide-media">
                    <img
                      src={slide.poster}
                      alt={alt || title}
                      className="event-slide-poster"
                    />

                    {hasVideo ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        className="event-slide-video"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : null}
                  </div>

                  <div className="event-slide-overlay">
                    <h3>{title}</h3>
                    {subtitle ? <p>{subtitle}</p> : null}
                  </div>
                </>
              );

              return (
                <article
                  key={slide.id}
                  className={`event-slide ${positionClass}`}
                  onMouseEnter={() => {
                    if (index === currentSlide) setIsHovered(true);
                  }}
                  onMouseLeave={() => {
                    if (index === currentSlide) setIsHovered(false);
                  }}
                  onClick={() => {
                    if (index !== currentSlide) goToSlide(index);
                  }}
                >
                  {isExternal ? (
                    <a
                      href={href}
                      className="event-slide-link"
                      aria-label={`${t.open}: ${title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (index !== currentSlide) {
                          e.preventDefault();
                          goToSlide(index);
                        }
                      }}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className="event-slide-link"
                      aria-label={`${t.open}: ${title}`}
                      onClick={(e) => {
                        if (index !== currentSlide) {
                          e.preventDefault();
                          goToSlide(index);
                        }
                      }}
                    >
                      {content}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>

          <button
            className="featured-events-nav next"
            type="button"
            aria-label={t.next}
            onClick={goToNext}
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedEvents;