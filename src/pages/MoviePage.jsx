import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { moviesData } from "../data/moviesData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

function formatDateLabel(dateString, language) {
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "short",
  }).format(date);
}

/*
  ВАЖНО:
  Сейчас рейтинг сохраняется локально, как временная основа.
  Потом эти функции можно просто заменить на API-запросы к бэкенду.
*/

function getLocalMovieRating(slug) {
  if (!slug) return 0;

  const saved = localStorage.getItem(`movie-rating-${slug}`);
  return saved ? Number(saved) : 0;
}

function saveLocalMovieRating(slug, value) {
  if (!slug) return;
  localStorage.setItem(`movie-rating-${slug}`, String(value));
}

function MoviePage() {
  const { language } = useLanguage();
  const { slug } = useParams();
  const sessionsRef = useRef(null);

  const movie = moviesData.find((item) => item.slug === slug);

  const uiText = {
    ru: {
      back: "Назад к фильмам",
      sessions: "Сеансы",
      notFoundTitle: "Фильм не найден",
      notFoundText: "Похоже, такого фильма пока нет в афише.",
      media: "Трейлер и кадры",
      country: "Страна",
      director: "Режиссёр",
      cast: "Актёрский состав",
      rating: "Рейтинг",
      premiere: "Премьера",
      home: "Главная",
      previous: "Назад",
      next: "Вперёд",
      trailer: "Трейлер",
      kinopoisk: "Кинопоиск",
      buyTickets: "Купить билеты",
      yourRating: "Оцените фильм:",
      starsAria: "Поставить оценку",
    },
    uz: {
      back: "Filmlarga qaytish",
      sessions: "Seanslar",
      notFoundTitle: "Film topilmadi",
      notFoundText: "Aftidan, bunday film hali afishada yo‘q.",
      media: "Treylеr va kadrlar",
      country: "Davlat",
      director: "Rejissyor",
      cast: "Aktyorlar",
      rating: "Reyting",
      premiere: "Premyera",
      home: "Bosh sahifa",
      previous: "Orqaga",
      next: "Oldinga",
      trailer: "Treylеr",
      kinopoisk: "Kinopoisk",
      buyTickets: "Chipta sotib olish",
      yourRating: "Filmni baholang:",
      starsAria: "Baho qo‘yish",
    },
  };

  const t = uiText[language] || uiText.ru;

  const [selectedDate, setSelectedDate] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [userRating, setUserRating] = useState(() => getLocalMovieRating(slug));

  const availableDates = useMemo(() => {
    if (!movie?.schedule) return [];
    return Object.keys(movie.schedule).sort((a, b) => a.localeCompare(b));
  }, [movie]);

  const currentSelectedDate = availableDates.includes(selectedDate)
    ? selectedDate
    : availableDates[0] || "";

  const mediaSlides = useMemo(() => {
    if (!movie) return [];

    return [
      ...(movie.trailer
        ? [
            {
              type: "trailer",
              src: movie.trailer,
              thumb: movie.poster,
              alt: `${getLocalizedValue(movie.title, language)} — ${t.trailer}`,
            },
          ]
        : []),
      ...(movie.gallery || []).map((img, index) => ({
        type: "image",
        src: img,
        thumb: img,
        alt: `${getLocalizedValue(movie.title, language)} ${index + 1}`,
      })),
    ];
  }, [movie, language, t.trailer]);

  const safeActiveIndex =
    activeIndex >= 0 && activeIndex < mediaSlides.length ? activeIndex : 0;

  const activeSlide = mediaSlides[safeActiveIndex];

  const scrollToSessions = () => {
    sessionsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleUserRating = (value) => {
    setUserRating(value);
    saveLocalMovieRating(slug, value);

    /*
      В БУДУЩЕМ ЗДЕСЬ БУДЕТ:
      await fetch(`/api/movies/${slug}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
    */
  };

  if (!movie) {
    return (
      <main className="main">
        <section className="movie-page">
          <div className="container">
            <div className="movie-not-found">
              <h1>{t.notFoundTitle}</h1>
              <p>{t.notFoundText}</p>
              <Link to={`/${language}/cinema`} className="back-link">
                {t.back}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const title = getLocalizedValue(movie.title, language);
  const description = getLocalizedValue(movie.description, language);
  const genre = getLocalizedValue(movie.info?.genre, language);
  const duration = getLocalizedValue(movie.info?.duration, language);
  const premiere = getLocalizedValue(movie.info?.premiere, language);
  const country = getLocalizedValue(movie.info?.country, language);
  const director = getLocalizedValue(movie.info?.director, language);

  const cast = Array.isArray(movie.info?.cast)
    ? movie.info.cast
        .map((item) => getLocalizedValue(item, language) || item)
        .filter(Boolean)
        .join(", ")
    : getLocalizedValue(movie.info?.cast, language) || "";

  const rating =
    movie.info?.imdb || movie.info?.kp
      ? `IMDb ${movie.info.imdb || "-"} / ${t.kinopoisk} ${
          movie.info.kp || "-"
        }`
      : "";

  const selectedSessions = movie.schedule?.[currentSelectedDate] || [];

  const goPrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? mediaSlides.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setActiveIndex((prev) =>
      prev === mediaSlides.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <Seo title={title} description={description} />

      <main className="main">
        <section className="movie-page">
          <div className="container">
            <div className="movie-breadcrumbs">
              <Link to={`/${language}`}>{t.home}</Link>
              <span> / </span>
              <Link to={`/${language}/cinema`}>{t.back}</Link>
              <span> / </span>
              <span>{title}</span>
            </div>

            <div className="movie-hero">
              <div className="movie-poster-wrap">
                <img src={movie.poster} alt={title} className="movie-poster" />
              </div>

              <div className="movie-info">
                <h1>{title}</h1>

                <div className="movie-meta">
                  {genre && <span className="movie-meta-chip">{genre}</span>}
                  {duration && (
                    <span className="movie-meta-chip">{duration}</span>
                  )}
                  {movie.info?.age && (
                    <span className="movie-meta-chip">{movie.info.age}</span>
                  )}
                  {premiere && (
                    <span className="movie-meta-chip">{premiere}</span>
                  )}
                </div>

                <div className="movie-details">
                  {country && (
                    <div className="movie-detail-row">
                      <span className="movie-detail-label">{t.country}:</span>
                      <span className="movie-detail-value">{country}</span>
                    </div>
                  )}

                  {director && (
                    <div className="movie-detail-row">
                      <span className="movie-detail-label">{t.director}:</span>
                      <span className="movie-detail-value">{director}</span>
                    </div>
                  )}

                  {cast && (
                    <div className="movie-detail-row">
                      <span className="movie-detail-label">{t.cast}:</span>
                      <span className="movie-detail-value">{cast}</span>
                    </div>
                  )}

                  {rating && (
                    <div className="movie-detail-row">
                      <span className="movie-detail-label">{t.rating}:</span>
                      <span className="movie-detail-value">{rating}</span>
                    </div>
                  )}

                  <div className="movie-user-rating-row">
                    <span className="movie-detail-label">{t.yourRating}</span>

                    <div
                      className="movie-user-rating-stars"
                      role="radiogroup"
                      aria-label={t.yourRating}
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`movie-star-btn ${
                            userRating >= value ? "active" : ""
                          }`}
                          onClick={() => handleUserRating(value)}
                          aria-label={`${t.starsAria} ${value}`}
                          aria-pressed={userRating === value}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {premiere && (
                    <div className="movie-detail-row">
                      <span className="movie-detail-label">{t.premiere}:</span>
                      <span className="movie-detail-value">{premiere}</span>
                    </div>
                  )}
                </div>

                <p className="movie-description">{description}</p>

                <button
                  type="button"
                  className="buy-tickets-btn"
                  onClick={scrollToSessions}
                >
                  🎟 {t.buyTickets}
                </button>
              </div>
            </div>

            {mediaSlides.length > 0 && (
              <div className="movie-media-section">
                <div className="movie-media-header">
                  <h2>{t.media}</h2>

                  {mediaSlides.length > 1 && (
                    <div className="movie-media-nav">
                      <button
                        type="button"
                        className="movie-media-arrow"
                        onClick={goPrev}
                        aria-label={t.previous}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className="movie-media-arrow"
                        onClick={goNext}
                        aria-label={t.next}
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>

                <div className="movie-media-slider">
                  <div className="movie-media-stage">
                    {activeSlide?.type === "trailer" ? (
                      <div className="movie-media-frame movie-media-frame-video">
                        <iframe
                          src={activeSlide.src}
                          title={`${title} trailer`}
                          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="movie-media-frame movie-media-frame-image">
                        <img src={activeSlide?.src} alt={activeSlide?.alt} />
                      </div>
                    )}
                  </div>

                  {mediaSlides.length > 1 && (
                    <div className="movie-media-thumbs">
                      {mediaSlides.map((item, index) => (
                        <button
                          key={`${item.type}-${index}`}
                          type="button"
                          className={`movie-media-thumb ${
                            safeActiveIndex === index ? "active" : ""
                          }`}
                          onClick={() => setActiveIndex(index)}
                          aria-label={
                            item.type === "trailer"
                              ? t.trailer
                              : `${title} ${index + 1}`
                          }
                        >
                          <img src={item.thumb} alt={item.alt} />
                          {item.type === "trailer" && (
                            <span className="movie-media-thumb-badge">▶</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="movie-schedule-section" ref={sessionsRef}>
              <h2>{t.sessions}</h2>

              <div className="movie-date-tabs">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    className={`movie-date-tab ${
                      currentSelectedDate === date ? "active" : ""
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {formatDateLabel(date, language)}
                  </button>
                ))}
              </div>

              <div className="movie-cinemas-list">
                {selectedSessions.map((cinemaItem, index) => (
                  <div
                    className="movie-cinema-card"
                    key={`${cinemaItem.cinema}-${index}`}
                  >
                    <h3>{cinemaItem.cinema}</h3>

                    <div className="movie-session-buttons">
                      {cinemaItem.sessions.map((session) => (
                        <a
                          key={`${cinemaItem.cinema}-${session.time}`}
                          href={session.url}
                          className="movie-session-button"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {session.time}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default MoviePage;