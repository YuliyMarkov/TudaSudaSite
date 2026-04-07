import { useMemo, useState } from "react";
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

function MoviePage() {
  const { language } = useLanguage();
  const { slug } = useParams();

  const movie = moviesData.find((item) => item.slug === slug);

  const uiText = {
    ru: {
      back: "Назад к фильмам",
      trailer: "Смотреть трейлер",
      sessions: "Сеансы",
      cinemas: "Кинотеатры",
      notFoundTitle: "Фильм не найден",
      notFoundText: "Похоже, такого фильма пока нет в афише.",
      gallery: "Кадры",
    },
    uz: {
      back: "Filmlarga qaytish",
      trailer: "Treylеrni ko‘rish",
      sessions: "Seanslar",
      cinemas: "Kinoteatrlar",
      notFoundTitle: "Film topilmadi",
      notFoundText: "Aftidan, bunday film hali afishada yo‘q.",
      gallery: "Kadrlar",
    },
  };

  const t = uiText[language] || uiText.ru;

  const availableDates = useMemo(() => {
    if (!movie?.schedule) return [];
    return Object.keys(movie.schedule).sort((a, b) => a.localeCompare(b));
  }, [movie]);

  const [selectedDate, setSelectedDate] = useState(availableDates[0] || "");

  if (!movie) {
    return (
      <main className="main">
        <section className="movie-page">
          <div className="container">
            <div className="movie-not-found">
              <h1>{t.notFoundTitle}</h1>
              <p>{t.notFoundText}</p>
              <Link to={`/${language}/cinema`} className="movie-back-link">
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
  const genre = getLocalizedValue(movie.info.genre, language);
  const duration = getLocalizedValue(movie.info.duration, language);
  const premiere = getLocalizedValue(movie.info.premiere, language);

  const selectedSessions = movie.schedule?.[selectedDate] || [];

  return (
    <>
      <Seo title={title} description={description} />

      <main className="main">
        <section className="movie-page">
          <div className="container">
            <div className="movie-breadcrumbs">
              <Link to={`/${language}`}>Home</Link>
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
                  <span className="movie-meta-chip">{genre}</span>
                  <span className="movie-meta-chip">{duration}</span>
                  <span className="movie-meta-chip">{movie.info.age}</span>
                  <span className="movie-meta-chip">{premiere}</span>
                </div>

                <p className="movie-description">{description}</p>

                <a
                  href={movie.trailer}
                  className="movie-trailer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.trailer}
                </a>
              </div>
            </div>

            {movie.gallery?.length > 0 && (
              <div className="movie-gallery-section">
                <h2>{t.gallery}</h2>
                <div className="movie-gallery">
                  {movie.gallery.map((image, index) => (
                    <div className="movie-gallery-item" key={`${movie.slug}-${index}`}>
                      <img src={image} alt={`${title} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.trailer && (
              <div className="movie-trailer-section">
                <div className="movie-trailer-frame">
                  <iframe
                    src={movie.trailer}
                    title={title}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="movie-schedule-section">
              <h2>{t.sessions}</h2>

              <div className="movie-date-tabs">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    className={`movie-date-tab ${selectedDate === date ? "active" : ""}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {formatDateLabel(date, language)}
                  </button>
                ))}
              </div>

              <div className="movie-cinemas-list">
                {selectedSessions.map((cinemaItem, index) => (
                  <div className="movie-cinema-card" key={`${selectedDate}-${index}`}>
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