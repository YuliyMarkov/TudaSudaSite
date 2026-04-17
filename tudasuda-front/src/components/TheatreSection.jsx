import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "http://localhost:4000";

function TheatreSection() {
  const { language } = useLanguage();
  const sliderRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const uiText = {
    ru: {
      title: "Театр",
      more: "Все спектакли",
      open: "Открыть",
      prev: "Назад",
      next: "Вперед",
      badge: "Театр",
    },
    uz: {
      title: "Teatr",
      more: "Barcha spektakllar",
      open: "Ochish",
      prev: "Orqaga",
      next: "Oldinga",
      badge: "Teatr",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadTheatreEvents() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/events?status=published&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load theatre events");
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD THEATRE EVENTS ERROR:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadTheatreEvents();
  }, [language]);

  const theatreEvents = useMemo(() => {
    return events
      .filter((item) => item.type === "theatre")
      .map((item) => {
        const translation = item.translations?.[0] || null;

        return {
          id: item.id,
          slug: item.slug,
          image: item.coverImage,
          title: translation?.title || "",
          subtitle: translation?.shortDescription || "",
          location: translation?.address || "",
        };
      });
  }, [events]);

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = slider.clientWidth * 0.8;
    slider.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading || !theatreEvents.length) return null;

  return (
    <section className="theatre-section">
      <div className="container">
        <div className="theatre-header">
          <h2>{t.title}</h2>

          <Link to={`/${language}/events?filter=theatre`} className="theatre-more">
            {t.more}
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="theatre-slider-wrap">
          <button
            className="theatre-nav prev"
            onClick={() => scrollSlider("prev")}
            type="button"
            aria-label={t.prev}
          >
            &#10094;
          </button>

          <div ref={sliderRef} className="theatre-slider">
            <div className="theatre-track">
              {theatreEvents.map((item) => {
                return (
                  <article key={item.id} className="theatre-card">
                    <Link
                      to={`/${language}/events/${item.slug}`}
                      className="theatre-card-link"
                      aria-label={`${t.open}: ${item.title}`}
                    >
                      <div className="theatre-image-wrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="theatre-image"
                        />
                        <span className="theatre-badge">{t.badge}</span>
                      </div>

                      <div className="theatre-body">
                        <h3>{item.title}</h3>

                        <div className="theatre-meta">
                          {item.subtitle && <span>{item.subtitle}</span>}
                          {item.location && (
                            <span className="theatre-location">
                              {item.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            className="theatre-nav next"
            onClick={() => scrollSlider("next")}
            type="button"
            aria-label={t.next}
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}

export default TheatreSection;