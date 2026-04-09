import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cinemaEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCinemaDate(dateString, language) {
  const locale = language === "uz" ? "uz-UZ" : "ru-RU";
  const date = new Date(`${dateString}T00:00:00`);

  return {
    weekday: new Intl.DateTimeFormat(locale, {
      weekday: "short",
    }).format(date),
    day: new Intl.DateTimeFormat(locale, {
      day: "numeric",
    }).format(date),
    month: new Intl.DateTimeFormat(locale, {
      month: "short",
    }).format(date),
  };
}

function formatSelectedDateLabel(dateString, language) {
  const locale = language === "uz" ? "uz-UZ" : "ru-RU";
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function getActiveCinemaWeekRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDay = today.getDay(); // 0 = Sunday
  const daysSinceThursday = (currentDay - 4 + 7) % 7;

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysSinceThursday);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return {
    start: formatDateToISO(startDate),
    end: formatDateToISO(endDate),
  };
}

function getExtendedCinemaDates(totalBefore = 10, totalAfter = 24) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = [];

  for (let i = -totalBefore; i <= totalAfter; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(formatDateToISO(date));
  }

  return dates;
}

function getMovieFirstDate(movie) {
  const dates = Object.keys(movie.schedule || {}).sort((a, b) =>
    a.localeCompare(b)
  );

  return dates.length ? dates[0] : null;
}

function AllCinemaPage() {
  const { language } = useLanguage();
  const datesRef = useRef(null);

  const uiText = {
    ru: {
      title: "Кино",
      description:
        "Киноафиша Ташкента: фильмы, премьеры, сеансы и подборка того, что сейчас идет в кино.",
      open: "Открыть фильм",
      premiereTitle: "Премьеры и скоро в кино",
      todayTitle: "В кино по датам",
      noResults: "На выбранную дату фильмов пока нет.",
      sessions: "Сеансы",
      moreSessions: "Смотреть фильм",
      selectedDate: "Выбрана дата",
      prevDates: "Предыдущие даты",
      nextDates: "Следующие даты",
    },
    uz: {
      title: "Kino",
      description:
        "Toshkent kinoafishasi: filmlar, premyeralar, seanslar va hozir kinoda bo‘lgan filmlar tanlovi.",
      open: "Filmni ochish",
      premiereTitle: "Premyeralar va tez orada kinoda",
      todayTitle: "Sanalar bo‘yicha kinoda",
      noResults: "Tanlangan sana uchun filmlar hozircha yo‘q.",
      sessions: "Seanslar",
      moreSessions: "Filmni ko‘rish",
      selectedDate: "Tanlangan sana",
      prevDates: "Oldingi sanalar",
      nextDates: "Keyingi sanalar",
    },
  };

  const t = uiText[language] || uiText.ru;

  const activeRange = useMemo(() => getActiveCinemaWeekRange(), []);
  const allDates = useMemo(() => getExtendedCinemaDates(10, 24), []);

  const [selectedDate, setSelectedDate] = useState(activeRange.start);

  const featuredPremieres = useMemo(() => {
    return cinemaEvents.filter((movie) => {
      const firstDate = getMovieFirstDate(movie);
      return firstDate && firstDate > activeRange.end;
    });
  }, [activeRange.end]);

  const filteredMovies = useMemo(() => {
    if (!selectedDate) return [];

    return cinemaEvents.filter((movie) => {
      const sessions = movie.schedule?.[selectedDate];
      return Array.isArray(sessions) && sessions.length > 0;
    });
  }, [selectedDate]);

  const selectedDateLabel = useMemo(() => {
    return formatSelectedDateLabel(selectedDate, language);
  }, [selectedDate, language]);

  const isDateActive = (date) => {
    return date >= activeRange.start && date <= activeRange.end;
  };

  const handleDateClick = (date) => {
    if (!isDateActive(date)) return;
    setSelectedDate(date);
  };

  const scrollDates = (direction) => {
    if (!datesRef.current) return;

    datesRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!datesRef.current) return;

    const activeButton = datesRef.current.querySelector(
      `[data-date="${selectedDate}"]`
    );

    if (!activeButton) return;

    activeButton.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedDate]);

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

          {featuredPremieres.length > 0 ? (
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
                    language
                  );

                  return (
                    <article
                      key={movie.id}
                      className="all-cinema-premiere-card"
                    >
                      <Link
                        to={`/${language}/movies/${movie.slug}`}
                        className="all-cinema-premiere-link"
                        aria-label={`${t.open}: ${title}`}
                      >
                        <div className="all-cinema-premiere-poster-wrap">
                          <img
                            src={movie.image}
                            alt={title}
                            className="all-cinema-premiere-poster"
                          />

                          {category ? (
                            <span className="all-cinema-badge">{category}</span>
                          ) : null}
                        </div>

                        <div className="all-cinema-premiere-body">
                          <h3>{title}</h3>

                          {subtitle ? (
                            <p className="all-cinema-subtitle">{subtitle}</p>
                          ) : null}

                          {location ? (
                            <p className="all-cinema-location">{location}</p>
                          ) : null}
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="all-cinema-today-section">
            <div className="all-cinema-section-head all-cinema-section-head--with-date">
              <div>
                <h2>{t.todayTitle}</h2>
                <p className="all-cinema-selected-date">
                  {t.selectedDate}: {selectedDateLabel}
                </p>
              </div>
            </div>

            <div className="cinema-calendar-wrap">
              <button
                type="button"
                className="cinema-calendar-nav prev"
                onClick={() => scrollDates("left")}
                aria-label={t.prevDates}
              >
                &#10094;
              </button>

              <div className="cinema-calendar-dates" ref={datesRef}>
                {allDates.map((date) => {
                  const formatted = formatCinemaDate(date, language);
                  const active = isDateActive(date);

                  return (
                    <button
                      key={date}
                      type="button"
                      data-date={date}
                      className={`cinema-calendar-date ${
                        selectedDate === date ? "active" : ""
                      } ${!active ? "inactive" : ""}`}
                      onClick={() => handleDateClick(date)}
                      disabled={!active}
                    >
                      <span className="cinema-calendar-weekday">
                        {formatted.weekday}
                      </span>
                      <span className="cinema-calendar-day">
                        {formatted.day}
                      </span>
                      <span className="cinema-calendar-month">
                        {formatted.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="cinema-calendar-nav next"
                onClick={() => scrollDates("right")}
                aria-label={t.nextDates}
              >
                &#10095;
              </button>
            </div>

            {filteredMovies.length > 0 ? (
              <div className="all-cinema-grid all-cinema-grid--expanded">
                {filteredMovies.map((movie) => {
                  const title = getLocalizedValue(movie.title, language);
                  const subtitle = getLocalizedValue(movie.subtitle, language);
                  const location = getLocalizedValue(movie.location, language);
                  const category = getLocalizedValue(
                    movie.categoryLabel,
                    language
                  );
                  const cinemaBlocks = movie.schedule?.[selectedDate] || [];

                  const flattenedSessions = cinemaBlocks
                    .flatMap((block) => block.sessions || [])
                    .slice(0, 4);

                  return (
                    <article key={movie.id} className="all-cinema-card">
                      <Link
                        to={`/${language}/movies/${movie.slug}`}
                        className="all-cinema-card-link"
                        aria-label={`${t.open}: ${title}`}
                      >
                        <div className="all-cinema-poster-wrap">
                          <img
                            src={movie.image}
                            alt={title}
                            className="all-cinema-poster"
                          />

                          {category ? (
                            <span className="all-cinema-badge">{category}</span>
                          ) : null}
                        </div>

                        <div className="all-cinema-card-body">
                          <h3>{title}</h3>

                          {subtitle ? (
                            <p className="all-cinema-subtitle">{subtitle}</p>
                          ) : null}

                          {location ? (
                            <p className="all-cinema-location">{location}</p>
                          ) : null}

                          {flattenedSessions.length > 0 ? (
                            <div className="all-cinema-sessions">
                              <span className="all-cinema-sessions-label">
                                {t.sessions}:
                              </span>

                              <div className="all-cinema-sessions-list">
                                {flattenedSessions.map((session, index) => (
                                  <span
                                    key={`${movie.id}-${selectedDate}-${session.time}-${index}`}
                                    className="all-cinema-session-chip"
                                  >
                                    {session.time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : null}

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