import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "";

function CinemaSection() {
  const { language } = useLanguage();
  const sliderRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    async function loadMovies() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/movies?status=published&featured=true&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load featured movies");
        }

        const data = await response.json();
        setMovies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD FEATURED MOVIES ERROR:", error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadMovies();
  }, [language]);

  const normalizedMovies = useMemo(() => {
    return movies.slice(0, 6).map((movie) => {
      const translation = movie.translations?.[0] || null;

      return {
        id: movie.id,
        slug: movie.slug,
        image: movie.posterImage || movie.coverImage,
        title: translation?.title || "",
        subtitle: translation?.genre || "",
        location: translation?.country || "",
      };
    });
  }, [movies]);

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = slider.clientWidth * 0.82;
    slider.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading || !normalizedMovies.length) return null;

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
              {normalizedMovies.map((movie) => (
                <article key={movie.id} className="cinema-card">
                  <Link
                    to={`/${language}/movies/${movie.slug}`}
                    className="cinema-card-link"
                    aria-label={`${t.open}: ${movie.title}`}
                  >
                    <div className="cinema-poster-wrap">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="cinema-poster"
                      />
                    </div>

                    <div className="cinema-card-body">
                      <h3>{movie.title}</h3>

                      <div className="cinema-card-meta">
                        {movie.subtitle && (
                          <span className="cinema-card-subtitle">
                            {movie.subtitle}
                          </span>
                        )}
                        {movie.location && (
                          <span className="cinema-card-location">
                            {movie.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
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