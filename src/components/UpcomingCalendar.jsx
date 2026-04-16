import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { upcomingEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDateLabel(dateString, language) {
  const date = new Date(`${dateString}T00:00:00`);

  const weekday = new Intl.DateTimeFormat(
    language === "uz" ? "uz-UZ" : "ru-RU",
    { weekday: "short" }
  ).format(date);

  const day = new Intl.DateTimeFormat(
    language === "uz" ? "uz-UZ" : "ru-RU",
    { day: "numeric" }
  ).format(date);

  const month = new Intl.DateTimeFormat(
    language === "uz" ? "uz-UZ" : "ru-RU",
    { month: "short" }
  ).format(date);

  return {
    weekday,
    day,
    month,
  };
}

function getUpcomingEventLink(language, event, categoryLabel) {
  const normalizedCategory = String(categoryLabel || "").trim().toLowerCase();

  const eventCategories = [
    "концерт",
    "театр",
    "выставка",
    "детям",
    "шоу",
    "konsert",
    "teatr",
    "ko‘rgazma",
    "korgazma",
    "bolalar",
    "shou",
  ];

  if (eventCategories.includes(normalizedCategory) && event.slug) {
    return `/${language}/events/${event.slug}`;
  }

  return `/${language}/events`;
}

function UpcomingCalendar() {
  const { language } = useLanguage();
  const activeDateRef = useRef(null);
  const sliderRef = useRef(null);

  const uiText = {
    ru: {
      title: "Календарь",
      more: "Все события",
      empty: "На эту дату событий пока нет",
      open: "Открыть событие",
      prev: "Предыдущие события",
      next: "Следующие события",
    },
    uz: {
      title: "Kalendar",
      more: "Barcha tadbirlar",
      empty: "Bu sana uchun hozircha tadbirlar yo‘q",
      open: "Tadbirni ochish",
      prev: "Oldingi tadbirlar",
      next: "Keyingi tadbirlar",
    },
  };

  const t = uiText[language] || uiText.ru;

  const todayIso = useMemo(() => {
    return toIsoDate(new Date());
  }, []);

  const calendarDates = useMemo(() => {
    const start = new Date(`${todayIso}T00:00:00`);
    return Array.from({ length: 60 }, (_, index) => {
      return toIsoDate(addDays(start, index));
    });
  }, [todayIso]);

  const [selectedDate, setSelectedDate] = useState(todayIso);

  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter((event) => event.date === selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (activeDateRef.current) {
      activeDateRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate]);

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = slider.clientWidth * 0.82;
    slider.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  if (!calendarDates.length) return null;

  return (
    <section className="upcoming-calendar-section">
      <div className="container">
        <div className="upcoming-calendar-header">
          <h2>{t.title}</h2>

          <Link to={`/${language}/events`} className="upcoming-calendar-more">
            {t.more}
            <span className="arrow">→</span>
          </Link>
        </div>

        <div
          className="upcoming-calendar-dates"
          role="tablist"
          aria-label={t.title}
        >
          {calendarDates.map((date) => {
            const { weekday, day, month } = formatDateLabel(date, language);
            const isActive = date === selectedDate;
            const hasEvents = upcomingEvents.some((event) => event.date === date);

            return (
              <button
                key={date}
                ref={isActive ? activeDateRef : null}
                type="button"
                className={`upcoming-calendar-date ${isActive ? "active" : ""} ${
                  hasEvents ? "has-events" : ""
                }`}
                onClick={() => setSelectedDate(date)}
                role="tab"
                aria-selected={isActive}
              >
                <span className="upcoming-calendar-weekday">{weekday}</span>
                <span className="upcoming-calendar-day">{day}</span>
                <span className="upcoming-calendar-month">{month}</span>
                {hasEvents && <span className="upcoming-calendar-dot" />}
              </button>
            );
          })}
        </div>

        {filteredEvents.length ? (
          <div className="upcoming-calendar-slider-wrap">
            <button
              className="upcoming-calendar-nav prev"
              type="button"
              aria-label={t.prev}
              onClick={() => scrollSlider("prev")}
            >
              &#10094;
            </button>

            <div ref={sliderRef} className="upcoming-calendar-slider">
              <div className="upcoming-calendar-track">
                {filteredEvents.map((event) => {
                  const title = getLocalizedValue(event.title, language);
                  const location = getLocalizedValue(event.location, language);
                  const category = getLocalizedValue(event.categoryLabel, language);
                  const href = getUpcomingEventLink(language, event, category);

                  return (
                    <article key={event.id} className="upcoming-event-card">
                      <Link
                        to={href}
                        className="upcoming-event-link"
                        aria-label={`${t.open}: ${title}`}
                      >
                        <div className="upcoming-event-image-wrap">
                          <img
                            src={event.image}
                            alt={title}
                            className="upcoming-event-image"
                          />
                          {category && (
                            <span className="upcoming-event-badge">
                              {category}
                            </span>
                          )}
                        </div>

                        <div className="upcoming-event-body">
                          <h3>{title}</h3>

                          <div className="upcoming-event-meta">
                            {location && (
                              <span className="upcoming-event-location">
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
              className="upcoming-calendar-nav next"
              type="button"
              aria-label={t.next}
              onClick={() => scrollSlider("next")}
            >
              &#10095;
            </button>
          </div>
        ) : (
          <div className="upcoming-calendar-empty">{t.empty}</div>
        )}
      </div>
    </section>
  );
}

export default UpcomingCalendar;