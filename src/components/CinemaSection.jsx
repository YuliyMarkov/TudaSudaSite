import { useRef } from "react";
import { Link } from "react-router-dom";
import { cinemaEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";

function CinemaSection() {
  const { language } = useLanguage();
  const sliderRef = useRef(null);

  const uiText = {
    ru: {
      title: "Кино",
      more: "Все фильмы",
      open: "Открыть фильм",
      prev: "Предыдущие фильмы",
      next: "Следующие фильмы",
    },
    uz: {
      title: "Kino",
      more: "Barcha filmlar",
      open: "Filmni ochish",
      prev: "Oldingi filmlar",
      next: "Keyingi filmlar",
    },
  };

  const t = uiText[language] || uiText.ru;

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = slider.clientWidth * 0.82;
    slider.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  if (!cinemaEvents?.length) return null;

  return (
    <section className="cinema-section">
      <div className="container">
        <div className="cinema-header">
          <h2>{t.title}</h2>

          <Link to={`/${language}/cinema`} className="cinema-more">
            {t.more}
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="cinema-slider-wrap">
          <button
            className="cinema-nav prev"
            type="button"
            aria-label={t.prev}
            onClick={() => scrollSlider("prev")}
          >
            &#10094;
          </button>

          <div ref={sliderRef} className="cinema-slider">
            <div className="cinema-track">
              {cinemaEvents.map((movie) => {
                const title = getLocalizedValue(movie.title, language);
                const subtitle = getLocalizedValue(movie.subtitle, language);
                const location = getLocalizedValue(movie.location, language);
                const category = getLocalizedValue(movie.categoryLabel, language);

                return (
                  <article key={movie.id} className="cinema-card">
                    <Link
                      to={`/${language}/movies/${movie.slug}`}
                      className="cinema-card-link"
                      aria-label={`${t.open}: ${title}`}
                    >
                      <div className="cinema-poster-wrap">
                        <img
                          src={movie.image}
                          alt={title}
                          className="cinema-poster"
                        />
                        {category && (
                          <span className="cinema-badge">{category}</span>
                        )}
                      </div>

                      <div className="cinema-card-body">
                        <h3>{title}</h3>

                        <div className="cinema-card-meta">
                          {subtitle && (
                            <span className="cinema-card-subtitle">
                              {subtitle}
                            </span>
                          )}
                          {location && (
                            <span className="cinema-card-location">
                              {location}
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
            className="cinema-nav next"
            type="button"
            aria-label={t.next}
            onClick={() => scrollSlider("next")}
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}

export default CinemaSection;