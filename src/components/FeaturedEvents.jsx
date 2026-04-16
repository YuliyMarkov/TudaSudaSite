import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hls from "hls.js";
import { featuredEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";

function getEventLink(language, event) {
  switch (event.linkType) {
    case "movies":
      return event.slug
        ? `/${language}/movies/${event.slug}`
        : `/${language}/cinema`;

    case "stories":
      return event.slug
        ? `/${language}/stories/${event.slug}`
        : `/${language}`;

    case "cinema":
      return event.slug
        ? `/${language}/movies/${event.slug}`
        : `/${language}/cinema`;

    case "event":
      return event.slug
        ? `/${language}/events/${event.slug}`
        : `/${language}/events`;

    case "concerts":
      return event.slug
        ? `/${language}/events/${event.slug}`
        : `/${language}/events?filter=concert`;

    case "theatre":
      return event.slug
        ? `/${language}/events/${event.slug}`
        : `/${language}/events?filter=theatre`;

    case "exhibitions":
      return event.slug
        ? `/${language}/events/${event.slug}`
        : `/${language}/events?filter=exhibition`;

    case "kids":
      return event.slug
        ? `/${language}/events/${event.slug}`
        : `/${language}/events?filter=kids`;

    case "restaurants":
      return event.slug
        ? `/${language}/restaurants/${event.slug}`
        : `/${language}/restaurants`;

    case "places":
      return event.slug
        ? `/${language}/places/${event.slug}`
        : `/${language}/places`;

    default:
      return `/${language}`;
  }
}

function FeaturedEvents() {
  const { language } = useLanguage();

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
  const totalSlides = featuredEvents.length;

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

    featuredEvents.forEach((event, index) => {
      const videoEl = videoRefs.current[index];
      const videoSrc = event.video || event.videoEmbed;

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
  }, []);

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
          /* ignore */
        }
      }
    });
  }, [currentSlide, isHovered]);

  if (!featuredEvents?.length) return null;

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
            {featuredEvents.map((event, index) => {
              const positionClass = getSlidePosition(index);
              const title = getLocalizedValue(event.title, language);
              const subtitle = getLocalizedValue(event.subtitle, language);
              const alt = getLocalizedValue(event.alt, language);
              const videoSrc = event.video || event.videoEmbed;
              const hasVideo = Boolean(videoSrc);
              const href = getEventLink(language, event);

              return (
                <article
                  key={event.slug || index}
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
                    <div className="event-slide-media">
                      <img
                        src={event.poster}
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
                  </Link>
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