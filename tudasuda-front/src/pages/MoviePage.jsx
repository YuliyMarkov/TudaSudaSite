import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";

const API_BASE_URL = "http://localhost:4000";

function formatDateLabel(dateString, language) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "short",
  }).format(date);
}

function getBrowserToken() {
  const storageKey = "movie-browser-token";
  const existing = localStorage.getItem(storageKey);

  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `browser_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(storageKey, generated);
  return generated;
}

function groupSessionsByDateAndCinema(sessions = []) {
  const groupedByDate = new Map();

  sessions.forEach((session) => {
    if (!session.sessionDate) return;

    const dateKey = new Date(session.sessionDate).toISOString().split("T")[0];

    if (!groupedByDate.has(dateKey)) {
      groupedByDate.set(dateKey, new Map());
    }

    const cinemasMap = groupedByDate.get(dateKey);
    const cinemaKey = session.cinemaName || "—";

    if (!cinemasMap.has(cinemaKey)) {
      cinemasMap.set(cinemaKey, []);
    }

    cinemasMap.get(cinemaKey).push({
      time: session.sessionTime,
      url: session.ticketUrl,
      hallName: session.hallName,
      price: session.price,
    });
  });

  return Array.from(groupedByDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, cinemasMap]) => ({
      displayDate: dateKey,
      sessions: Array.from(cinemasMap.entries()).map(([cinema, sessions]) => ({
        cinema,
        sessions: sessions.sort((a, b) => a.time.localeCompare(b.time)),
      })),
    }));
}

function formatDuration(durationMinutes, language) {
  if (!durationMinutes || Number.isNaN(Number(durationMinutes))) return "";

  const total = Number(durationMinutes);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  if (language === "uz") {
    if (hours && minutes) return `${hours} soat ${minutes} daqiqa`;
    if (hours) return `${hours} soat`;
    return `${minutes} daqiqa`;
  }

  if (hours && minutes) return `${hours} ч ${minutes} мин`;
  if (hours) return `${hours} ч`;
  return `${minutes} мин`;
}

function formatPremiere(dateString, language) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function MoviePage() {
  const { language } = useLanguage();
  const { slug } = useParams();
  const sessionsRef = useRef(null);

  const [browserToken, setBrowserToken] = useState("");
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isRatingLoading, setIsRatingLoading] = useState(false);

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
      noSessions: "Нет сеансов",
      loading: "Загрузка фильма...",
      error: "Не удалось загрузить фильм.",
      averageRating: "Средняя оценка",
      votes: "голосов",
      ratingError: "Не удалось сохранить оценку.",
      noData: "Уточняется",
    },
    uz: {
      back: "Filmlarga qaytish",
      sessions: "Seanslar",
      notFoundTitle: "Film topilmadi",
      notFoundText: "Aftidan, bunday film hali afishada yo‘q.",
      media: "Treyler va kadrlar",
      country: "Davlat",
      director: "Rejissyor",
      cast: "Aktyorlar",
      rating: "Reyting",
      premiere: "Premyera",
      home: "Bosh sahifa",
      previous: "Orqaga",
      next: "Oldinga",
      trailer: "Treyler",
      kinopoisk: "Kinopoisk",
      buyTickets: "Chipta sotib olish",
      yourRating: "Filmni baholang:",
      starsAria: "Baho qo‘yish",
      noSessions: "Seanslar yo‘q",
      loading: "Film yuklanmoqda...",
      error: "Filmni yuklab bo‘lmadi.",
      averageRating: "O‘rtacha baho",
      votes: "ta ovoz",
      ratingError: "Bahoni saqlab bo‘lmadi.",
      noData: "Aniqlanmoqda",
    },
  };

  const t = uiText[language] || uiText.ru;

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const token = getBrowserToken();
    setBrowserToken(token);
  }, []);

  useEffect(() => {
    if (!browserToken) return;

    async function loadMovie() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/movies/${slug}?lang=${language}&browserToken=${encodeURIComponent(browserToken)}`
        );

        if (response.status === 404) {
          setMovie(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load movie");
        }

        const data = await response.json();
        setMovie(data);
        setUserRating(data.userRating || 0);
      } catch (error) {
        console.error("LOAD MOVIE ERROR:", error);
        setLoadError(t.error);
        setMovie(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadMovie();
  }, [slug, language, browserToken, t.error]);

  const scheduleEntries = useMemo(() => {
    return groupSessionsByDateAndCinema(movie?.sessions || []);
  }, [movie]);

  useEffect(() => {
    setSelectedDateIndex(0);
  }, [slug, language, movie?.id]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slug, language, movie?.id]);

  const safeSelectedDateIndex =
    selectedDateIndex >= 0 && selectedDateIndex < scheduleEntries.length
      ? selectedDateIndex
      : 0;

  const currentSelectedEntry = scheduleEntries[safeSelectedDateIndex] || null;
  const selectedSessions = currentSelectedEntry?.sessions || [];

  const normalizedMovie = useMemo(() => {
    if (!movie) return null;

    const translation = movie.translations?.[0] || null;

    const cast =
      movie.castItems?.map((item) => item.name).filter(Boolean).join(", ") || "";

    const mediaSlides = [
      ...(movie.trailerUrl
        ? [
            {
              type: "trailer",
              src: movie.trailerUrl,
              thumb: movie.posterImage || movie.coverImage,
              alt: `${translation?.title || ""} — ${t.trailer}`,
            },
          ]
        : []),
      ...(movie.galleryItems || []).map((item, index) => ({
        type: "image",
        src: item.image,
        thumb: item.image,
        alt: `${translation?.title || ""} ${index + 1}`,
      })),
    ];

    return {
      id: movie.id,
      slug: movie.slug,
      poster: movie.posterImage,
      cover: movie.coverImage,
      title: translation?.title || "",
      description: translation?.description || "",
      genre: translation?.genre || "",
      duration: formatDuration(movie.durationMinutes, language),
      premiere: formatPremiere(movie.releaseDate, language),
      country: translation?.country || "",
      director: translation?.director || "",
      cast,
      age: movie.ageRating || "",
      imdb: movie.imdbRating || "",
      kp: movie.kpRating || "",
      ratingAverage: movie.ratingAverage || 0,
      ratingCount: movie.ratingCount || 0,
      mediaSlides,
    };
  }, [movie, language, t.trailer]);

  const safeActiveIndex =
    normalizedMovie &&
    activeIndex >= 0 &&
    activeIndex < normalizedMovie.mediaSlides.length
      ? activeIndex
      : 0;

  const activeSlide = normalizedMovie?.mediaSlides?.[safeActiveIndex];

  const scrollToSessions = () => {
    sessionsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleUserRating = async (value) => {
    if (!movie?.id || !browserToken || isRatingLoading) return;

    try {
      setIsRatingLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/movies/${movie.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          browserToken,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save movie rating");
      }

      const data = await response.json();

      setUserRating(data.userRating || value);
      setMovie((prev) =>
        prev
          ? {
              ...prev,
              ratingAverage:
                typeof data.ratingAverage === "number"
                  ? data.ratingAverage
                  : prev.ratingAverage,
              ratingCount:
                typeof data.ratingCount === "number"
                  ? data.ratingCount
                  : prev.ratingCount,
              userRating: data.userRating || value,
            }
          : prev
      );
    } catch (error) {
      console.error("RATE MOVIE ERROR:", error);
      alert(t.ratingError);
    } finally {
      setIsRatingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="main">
        <section className="movie-page">
          <div className="container">
            <div className="movie-not-found">
              <p>{t.loading}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="main">
        <section className="movie-page">
          <div className="container">
            <div className="movie-not-found">
              <h1>{t.error}</h1>
              <Link to={`/${language}/cinema`} className="back-link">
                {t.back}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!normalizedMovie) {
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

  const {
    poster,
    title,
    description,
    genre,
    duration,
    premiere,
    country,
    director,
    cast,
    age,
    imdb,
    kp,
    ratingAverage,
    ratingCount,
    mediaSlides,
  } = normalizedMovie;

  const rating =
    imdb || kp
      ? `IMDb ${imdb || "-"} / ${t.kinopoisk} ${kp || "-"}`
      : "";

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? mediaSlides.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === mediaSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Seo title={title} description={description} image={poster} />

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
                <img src={poster} alt={title} className="movie-poster" />
              </div>

              <div className="movie-info">
                <h1>{title}</h1>

                <div className="movie-meta">
                  {genre && <span className="movie-meta-chip">{genre}</span>}
                  {duration && <span className="movie-meta-chip">{duration}</span>}
                  {age && <span className="movie-meta-chip">{age}</span>}
                  {premiere && <span className="movie-meta-chip">{premiere}</span>}
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

                  <div className="movie-detail-row">
                    <span className="movie-detail-label">{t.rating}:</span>
                    <span className="movie-detail-value">
                      {ratingAverage > 0
                        ? `${ratingAverage.toFixed(1)} / 5 (${ratingCount} ${t.votes})`
                        : `0 / 5 (${ratingCount} ${t.votes})`}
                    </span>
                  </div>

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
                          disabled={isRatingLoading}
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
                {scheduleEntries.map((item, index) => (
                  <button
                    key={`${item.displayDate}-${index}`}
                    type="button"
                    className={`movie-date-tab ${
                      safeSelectedDateIndex === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedDateIndex(index)}
                  >
                    {formatDateLabel(item.displayDate, language)}
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
                          key={`${cinemaItem.cinema}-${session.time}-${index}`}
                          href={session.url || "#"}
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

                {!selectedSessions.length && (
                  <div className="movie-cinema-card">
                    <h3>—</h3>
                    <div className="movie-session-buttons">
                      <span className="movie-session-button">
                        {t.noSessions}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default MoviePage;