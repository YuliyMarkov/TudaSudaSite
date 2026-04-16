import { useRef } from "react";
import { Link } from "react-router-dom";
import { theatreEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";

function TheatreSection() {
  const { language } = useLanguage();
  const sliderRef = useRef(null);

  const uiText = {
    ru: {
      title: "Театр",
      more: "Все спектакли",
      open: "Открыть",
      prev: "Назад",
      next: "Вперед",
    },
    uz: {
      title: "Teatr",
      more: "Barcha spektakllar",
      open: "Ochish",
      prev: "Orqaga",
      next: "Oldinga",
    },
  };

  const t = uiText[language] || uiText.ru;

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = slider.clientWidth * 0.8;
    slider.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  if (!theatreEvents?.length) return null;

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
                const title = getLocalizedValue(item.title, language);
                const subtitle = getLocalizedValue(item.subtitle, language);
                const location = getLocalizedValue(item.location, language);
                const category = getLocalizedValue(
                  item.categoryLabel,
                  language
                );

                return (
                  <article key={item.id} className="theatre-card">
                    <Link
                      to={`/${language}/events/${item.slug}`}
                      className="theatre-card-link"
                      aria-label={`${t.open}: ${title}`}
                    >
                      <div className="theatre-image-wrap">
                        <img
                          src={item.image}
                          alt={title}
                          className="theatre-image"
                        />
                        <span className="theatre-badge">{category}</span>
                      </div>

                      <div className="theatre-body">
                        <h3>{title}</h3>

                        <div className="theatre-meta">
                          <span>{subtitle}</span>
                          <span className="theatre-location">
                            {location}
                          </span>
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