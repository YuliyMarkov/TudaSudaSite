import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hls from "hls.js";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "";

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

function isCoarsePointer() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches;
}

function FeaturedEvents() {
  const { language } = useLanguage();

  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [canUseHoverVideo, setCanUseHoverVideo] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const activeVideoRef = useRef(null);
  const activeHlsRef = useRef(null);
  const loadedVideoSrcRef = useRef("");

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
    setCanUseHoverVideo(!isCoarsePointer());
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSlides() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/hero-slides?lang=${language}&activeOnly=true`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load hero slides");
        }

        const data = await response.json();
        setSlides(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("LOAD HERO SLIDES ERROR:", error);
        setSlides([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadSlides();

    return () => {
      controller.abort();
    };
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
  const activeSlide = normalizedSlides[currentSlide] || null;

  useEffect(() => {
    setCurrentSlide(0);
    setIsHovered(false);
  }, [language, totalSlides]);

  useEffect(() => {
    return () => {
      if (activeHlsRef.current) {
        activeHlsRef.current.destroy();
        activeHlsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!activeVideoRef.current) return;

    const videoEl = activeVideoRef.current;
    const videoSrc =
      canUseHoverVideo &&
      isHovered &&
      activeSlide?.hoverMediaType === "video"
        ? activeSlide.hoverMediaUrl
        : "";

    if (!videoSrc) {
      videoEl.pause();

      try {
        videoEl.currentTime = 0;
      } catch {
        // ignore
      }

      return;
    }

    if (loadedVideoSrcRef.current === videoSrc) {
      videoEl.play().catch(() => {});
      return;
    }

    if (activeHlsRef.current) {
      activeHlsRef.current.destroy();
      activeHlsRef.current = null;
    }

    loadedVideoSrcRef.current = videoSrc;
    videoEl.removeAttribute("src");
    videoEl.load();

    if (videoSrc.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 8,
          maxMaxBufferLength: 12,
          startFragPrefetch: false,
        });

        hls.loadSource(videoSrc);
        hls.attachMedia(videoEl);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoEl.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error("HLS error:", data);
        });

        activeHlsRef.current = hls;
      } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
        videoEl.src = videoSrc;
        videoEl.load();
        videoEl.play().catch(() => {});
      }
    } else {
      videoEl.src = videoSrc;
      videoEl.load();
      videoEl.play().catch(() => {});
    }
  }, [activeSlide, canUseHoverVideo, isHovered]);

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

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    touchEndX.current = event.changedTouches[0].clientX;

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
                canUseHoverVideo &&
                index === currentSlide &&
                slide.hoverMediaType === "video" &&
                Boolean(slide.hoverMediaUrl);
              const href = buildSlideLink(language, slide);
              const isExternal =
                href.startsWith("http://") || href.startsWith("https://");
              const isActive = index === currentSlide;

              const content = (
                <>
                  <div className="event-slide-media">
                    <img
                      src={slide.poster}
                      alt={alt || title}
                      className="event-slide-poster"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />

                    {hasVideo ? (
                      <video
                        ref={activeVideoRef}
                        className="event-slide-video"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-hidden="true"
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
                    if (isActive && canUseHoverVideo) setIsHovered(true);
                  }}
                  onMouseLeave={() => {
                    if (isActive && canUseHoverVideo) setIsHovered(false);
                  }}
                  onClick={() => {
                    if (!isActive) goToSlide(index);
                  }}
                >
                  {isExternal ? (
                    <a
                      href={href}
                      className="event-slide-link"
                      aria-label={`${t.open}: ${title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        if (!isActive) {
                          event.preventDefault();
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
                      onClick={(event) => {
                        if (!isActive) {
                          event.preventDefault();
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