import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cinemaEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

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

  for (let i = 0; i <= totalAfter; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(formatDateToISO(d));
  }

  return dates;
}

function getActiveCinemaWeekRange() {
  const today = new Date();
  const currentDay = today.getDay();

  const daysUntilThursday = (4 - currentDay + 7) % 7;

  const startDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(today.getDate() + daysUntilThursday);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return {
    start: formatDateToISO(startDate),
    end: formatDateToISO(endDate),
  };
}

function AllCinemaPage() {
  const { language } = useLanguage();
  const datesRef = useRef(null);

  const uiText = {
    ru: {
      title: "Кино",
      description:
        "Киноафиша Ташкента: фильмы, премьеры, сеансы и подборка того, что сейчас идет в кино.",
      premiereTitle: "Премьеры и скоро в кино",
      todayTitle: "В кино по датам",
      noResults: "На выбранную дату фильмов пока нет.",
      sessions: "Сеансы",
      moreSessions: "Смотреть фильм",
      prevDates: "Предыдущие даты",
      nextDates: "Следующие даты",
    },
    uz: {
      title: "Kino",
      description:
        "Toshkent kinoafishasi: filmlar, premyeralar, seanslar va hozir kinoda bo‘lgan filmlar tanlovi.",
      premiereTitle: "Premyeralar va tez orada kinoda",
      todayTitle: "Sanalar bo‘yicha kinoda",
      noResults: "Tanlangan sana uchun filmlar hozircha yo‘q.",
      sessions: "Seanslar",
      moreSessions: "Filmni ko‘rish",
      prevDates: "Oldingi sanalar",
      nextDates: "Keyingi sanalar",
    },
  };

  const t = uiText[language] || uiText.ru;

  const allDates = useMemo(() => getExtendedCinemaDates(24), []);
  const activeRange = useMemo(() => getActiveCinemaWeekRange(), []);

  const todayISO = formatDateToISO(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO);

  const featuredPremieres = useMemo(() => {
    return cinemaEvents.filter((movie) => {
      const movieDates = Object.keys(movie.schedule || {}).sort((a, b) =>
        a.localeCompare(b),
      );
      return movieDates.length > 0 && movieDates[0] > activeRange.start;
    });
  }, [activeRange.start]);

  const filteredMovies = useMemo(() => {
    if (!selectedDate) return [];

    return cinemaEvents.filter((movie) => {
      const sessions = movie.schedule?.[selectedDate];
      return Array.isArray(sessions) && sessions.length > 0;
    });
  }, [selectedDate]);

  const isDateActive = (date) => {
    return date >= activeRange.start && date <= activeRange.end;
  };

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
                  const title = getLocalizedValue(movie.title, language);
                  const subtitle = getLocalizedValue(movie.subtitle, language);
                  const location = getLocalizedValue(movie.location, language);
                  const category = getLocalizedValue(
                    movie.categoryLabel,
                    language,
                  );

                  return (
                    <article key={movie.id} className="all-cinema-premiere-card">
                      <Link
                        to={`/${language}/movies/${movie.slug}`}
                        className="all-cinema-premiere-link"
                      >
                        <div className="all-cinema-premiere-poster-wrap">
                          <img
                            src={movie.image}
                            alt={title}
                            className="all-cinema-premiere-poster"
                          />
                          {category && (
                            <span className="all-cinema-badge">{category}</span>
                          )}
                        </div>

                        <div className="all-cinema-premiere-body">
                          <h3>{title}</h3>
                          {subtitle && (
                            <p className="all-cinema-subtitle">{subtitle}</p>
                          )}
                          {location && (
                            <p className="all-cinema-location">{location}</p>
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
                  const isSelected = selectedDate === date;

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

            {filteredMovies.length ? (
              <div className="all-cinema-grid all-cinema-grid--expanded">
                {filteredMovies.map((movie) => {
                  const title = getLocalizedValue(movie.title, language);
                  const subtitle = getLocalizedValue(movie.subtitle, language);
                  const location = getLocalizedValue(movie.location, language);
                  const category = getLocalizedValue(
                    movie.categoryLabel,
                    language,
                  );
                  const sessions =
                    movie.schedule?.[selectedDate]?.[0]?.sessions || [];

                  return (
                    <article key={movie.id} className="all-cinema-card">
                      <Link
                        to={`/${language}/movies/${movie.slug}`}
                        className="all-cinema-card-link"
                      >
                        <div className="all-cinema-poster-wrap">
                          <img
                            src={movie.image}
                            alt={title}
                            className="all-cinema-poster"
                          />
                          {category && (
                            <span className="all-cinema-badge">{category}</span>
                          )}
                        </div>

                        <div className="all-cinema-card-body">
                          <h3>{title}</h3>

                          {subtitle && (
                            <p className="all-cinema-subtitle">{subtitle}</p>
                          )}

                          {location && (
                            <p className="all-cinema-location">{location}</p>
                          )}

                          {sessions.length > 0 && (
                            <div className="all-cinema-sessions">
                              <span className="all-cinema-sessions-label">
                                {t.sessions}
                              </span>

                              <div className="all-cinema-sessions-list">
                                {sessions.slice(0, 4).map((s, i) => (
                                  <span
                                    key={`${movie.id}-${selectedDate}-${i}`}
                                    className="all-cinema-session-chip"
                                  >
                                    {s.time}
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