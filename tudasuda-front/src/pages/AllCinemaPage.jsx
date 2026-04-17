import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";

const API_BASE_URL = "http://localhost:4000";

function formatCinemaDate(dateString, language) {
  const date = new Date(`${dateString}T00:00:00`);

  return {
    weekday: new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
      weekday: "short",
    }).format(date),
    day: new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
      day: "numeric",
    }).format(date),
    month: new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
      month: "short",
    }).format(date),
  };
}

function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getExtendedCinemaDates(totalAfter = 24) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = [];

  for (let i = 0; i <= totalAfter; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(formatDateToISO(d));
  }

  return dates;
}

function getCurrentCinemaWeekRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDay = today.getDay();
  const daysSinceThursday = (currentDay - 4 + 7) % 7;

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysSinceThursday);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return {
    today: formatDateToISO(today),
    start: formatDateToISO(startDate),
    end: formatDateToISO(endDate),
  };
}

function groupSessionsByDate(sessions = []) {
  const grouped = new Map();

  sessions.forEach((session) => {
    if (!session.sessionDate) return;

    const dateKey = new Date(session.sessionDate).toISOString().split("T")[0];

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }

    grouped.get(dateKey).push(session);
  });

  return grouped;
}

function normalizeMovie(movie) {
  const translation = movie.translations?.[0] || null;

  return {
    id: movie.id,
    slug: movie.slug,
    image: movie.posterImage || movie.coverImage,
    title: translation?.title || "",
    subtitle: translation?.genre || "",
    location: translation?.country || "",
    releaseDate: movie.releaseDate
      ? new Date(movie.releaseDate).toISOString().split("T")[0]
      : "",
    isFeatured: movie.isFeatured,
    sessions: movie.sessions || [],
  };
}

function AllCinemaPage() {
  const { language } = useLanguage();
  const datesRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const uiText = {
    ru: {
      title: "Кино",
      description:
        "Киноафиша Ташкента: фильмы, премьеры, сеансы и подборка того, что сейчас идет в кино.",
      premiereTitle: "Премьеры и скоро в кино",
      todayTitle: "Выберите дату",
      noResults: "На выбранную дату фильмов пока нет.",
      sessions: "Сеансы",
      moreSessions: "Смотреть фильм",
      prevDates: "Предыдущие даты",
      nextDates: "Следующие даты",
      loading: "Загрузка фильмов...",
      error: "Не удалось загрузить фильмы.",
    },
    uz: {
      title: "Kino",
      description:
        "Toshkent kinoafishasi: filmlar, premyeralar, seanslar va hozir kinoda bo‘lgan filmlar tanlovi.",
      premiereTitle: "Premyeralar va tez orada kinoda",
      todayTitle: "Sanani tanlang",
      noResults: "Tanlangan sana uchun filmlar hozircha yo‘q.",
      sessions: "Seanslar",
      moreSessions: "Filmni ko‘rish",
      prevDates: "Oldingi sanalar",
      nextDates: "Keyingi sanalar",
      loading: "Filmlar yuklanmoqda...",
      error: "Filmlarni yuklab bo‘lmadi.",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadMovies() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/movies?status=published&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load movies");
        }

        const data = await response.json();
        setMovies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD MOVIES ERROR:", error);
        setLoadError(t.error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadMovies();
  }, [language, t.error]);

  const normalizedMovies = useMemo(
    () => movies.map((movie) => normalizeMovie(movie)),
    [movies]
  );

  const allDates = useMemo(() => getExtendedCinemaDates(24), []);
  const activeRange = useMemo(() => getCurrentCinemaWeekRange(), []);

  const [selectedDate, setSelectedDate] = useState(activeRange.today);

  const isDateActive = (date) => {
    return date >= activeRange.today && date <= activeRange.end;
  };

  const currentSelectedDate = isDateActive(selectedDate)
    ? selectedDate
    : activeRange.today;

  const featuredPremieres = useMemo(() => {
    return normalizedMovies.filter((movie) => {
      if (!movie.releaseDate) return false;
      return movie.releaseDate > activeRange.end;
    });
  }, [normalizedMovies, activeRange.end]);

  const filteredMovies = useMemo(() => {
    if (!currentSelectedDate) return [];

    return normalizedMovies.filter((movie) => {
      const groupedSessions = groupSessionsByDate(movie.sessions);
      return groupedSessions.has(currentSelectedDate);
    });
  }, [normalizedMovies, currentSelectedDate]);

  const handleDateClick = (date) => {
    if (!isDateActive(date)) return;
    setSelectedDate(date);
  };

  const scrollDates = (direction) => {
    if (!datesRef.current) return;

    const amount = direction === "left" ? -320 : 320;

    datesRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Seo title={t.title} description={t.description} />

      <section className="all-cinema-page">
        <div className="container">
          <div className="all-cinema-header all-cinema-header--rich">
            <div className="all-cinema-header-text">
              <h1>{t.title}</h1>
              <p>{t.description}</p>
            </div>
          </div>

          {featuredPremieres.length > 0 && (
            <div className="all-cinema-premieres-section">
              <div className="all-cinema-section-head">
                <h2>{t.premiereTitle}</h2>
              </div>

              <div className="all-cinema-premieres-grid">
                {featuredPremieres.map((movie) => {
                  return (
                    <article key={movie.id} className="all-cinema-premiere-card">
                      <Link
                        to={`/${language}/movies/${movie.slug}`}
                        className="all-cinema-premiere-link"
                      >
                        <div className="all-cinema-premiere-poster-wrap">
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="all-cinema-premiere-poster"
                          />
                        </div>

                        <div className="all-cinema-premiere-body">
                          <h3>{movie.title}</h3>

                          {movie.subtitle && (
                            <p className="all-cinema-subtitle">
                              {movie.subtitle}
                            </p>
                          )}

                          {movie.location && (
                            <p className="all-cinema-location">
                              {movie.location}
                            </p>
                          )}
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          <div className="all-cinema-today-section">
            <div className="all-cinema-section-head">
              <h2>{t.todayTitle}</h2>
            </div>

            <div className="upcoming-calendar-slider-wrap cinema-calendar-shell">
              <button
                className="upcoming-calendar-nav prev"
                type="button"
                aria-label={t.prevDates}
                onClick={() => scrollDates("left")}
              >
                &#10094;
              </button>

              <div
                className="upcoming-calendar-dates cinema-calendar-dates"
                ref={datesRef}
                role="tablist"
                aria-label={t.todayTitle}
              >
                {allDates.map((date) => {
                  const formatted = formatCinemaDate(date, language);
                  const active = isDateActive(date);
                  const isSelected = currentSelectedDate === date;

                  return (
                    <button
                      key={date}
                      type="button"
                      className={`upcoming-calendar-date ${
                        isSelected ? "active" : ""
                      } ${!active ? "inactive" : ""}`}
                      onClick={() => handleDateClick(date)}
                      disabled={!active}
                      role="tab"
                      aria-selected={isSelected}
                    >
                      <span className="upcoming-calendar-weekday">
                        {formatted.weekday}
                      </span>
                      <span className="upcoming-calendar-day">
                        {formatted.day}
                      </span>
                      <span className="upcoming-calendar-month">
                        {formatted.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                className="upcoming-calendar-nav next"
                type="button"
                aria-label={t.nextDates}
                onClick={() => scrollDates("right")}
              >
                &#10095;
              </button>
            </div>

            {isLoading ? (
              <div className="all-cinema-empty">{t.loading}</div>
            ) : loadError ? (
              <div className="all-cinema-empty">{loadError}</div>
            ) : filteredMovies.length ? (
              <div className="all-cinema-grid all-cinema-grid--expanded">
                {filteredMovies.map((movie) => {
                  const groupedSessions = groupSessionsByDate(movie.sessions);
                  const sessionsForDate = groupedSessions.get(currentSelectedDate) || [];
                  const uniqueTimes = sessionsForDate
                    .map((session) => session.sessionTime)
                    .filter(Boolean)
                    .slice(0, 4);

                  return (
                    <article key={movie.id} className="all-cinema-card">
                      <Link
                        to={`/${language}/movies/${movie.slug}`}
                        className="all-cinema-card-link"
                      >
                        <div className="all-cinema-poster-wrap">
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="all-cinema-poster"
                          />
                        </div>

                        <div className="all-cinema-card-body">
                          <h3>{movie.title}</h3>

                          {movie.subtitle && (
                            <p className="all-cinema-subtitle">
                              {movie.subtitle}
                            </p>
                          )}

                          {movie.location && (
                            <p className="all-cinema-location">
                              {movie.location}
                            </p>
                          )}

                          {uniqueTimes.length > 0 && (
                            <div className="all-cinema-sessions">
                              <span className="all-cinema-sessions-label">
                                {t.sessions}
                              </span>

                              <div className="all-cinema-sessions-list">
                                {uniqueTimes.map((time, i) => (
                                  <span
                                    key={`${movie.id}-${currentSelectedDate}-${time}-${i}`}
                                    className="all-cinema-session-chip"
                                  >
                                    {time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <span className="all-cinema-more-link">
                            {t.moreSessions}
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="all-cinema-empty">{t.noResults}</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default AllCinemaPage;