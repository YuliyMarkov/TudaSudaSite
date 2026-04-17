import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "http://localhost:4000";

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

function groupEventsByDate(events = []) {
  const grouped = new Map();

  events.forEach((event) => {
    const firstSession = event.sessions?.[0];
    if (!firstSession?.startAt) return;

    const dateKey = new Date(firstSession.startAt).toISOString().split("T")[0];

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }

    grouped.get(dateKey).push(event);
  });

  return grouped;
}

function normalizeUpcomingEvent(event) {
  const translation = event.translations?.[0] || null;

  return {
    id: event.id,
    slug: event.slug,
    image: event.coverImage,
    title: translation?.title || "",
    location: translation?.address || "",
    category:
      event.isForKids
        ? "kids"
        : event.type === "concert"
        ? "concert"
        : event.type === "theatre"
        ? "theatre"
        : event.type === "exhibition"
        ? "exhibition"
        : "",
  };
}

function getEventCategoryLabel(category, language) {
  const labels = {
    ru: {
      concert: "Концерт",
      theatre: "Театр",
      exhibition: "Выставка",
      kids: "Детям",
    },
    uz: {
      concert: "Konsert",
      theatre: "Teatr",
      exhibition: "Ko‘rgazma",
      kids: "Bolalar uchun",
    },
  };

  return labels[language]?.[category] || labels.ru?.[category] || "";
}

function UpcomingCalendar() {
  const { language } = useLanguage();
  const activeDateRef = useRef(null);
  const sliderRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const uiText = {
    ru: {
      title: "Календарь",
      more: "Все события",
      empty: "На эту дату событий пока нет",
      open: "Открыть событие",
      prev: "Предыдущие события",
      next: "Следующие события",
      loading: "Загрузка событий...",
      error: "Не удалось загрузить события",
    },
    uz: {
      title: "Kalendar",
      more: "Barcha tadbirlar",
      empty: "Bu sana uchun hozircha tadbirlar yo‘q",
      open: "Tadbirni ochish",
      prev: "Oldingi tadbirlar",
      next: "Keyingi tadbirlar",
      loading: "Tadbirlar yuklanmoqda...",
      error: "Tadbirlarni yuklab bo‘lmadi",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/events?status=published&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD UPCOMING EVENTS ERROR:", error);
        setEvents([]);
        setLoadError(t.error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [language, t.error]);

    const groupedEvents = useMemo(() => groupEventsByDate(events), [events]);

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
    const items = groupedEvents.get(selectedDate) || [];
    return items.map((event) => normalizeUpcomingEvent(event));
  }, [groupedEvents, selectedDate]);

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
            const hasEvents = groupedEvents.has(date);

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

        {isLoading ? (
          <div className="upcoming-calendar-empty">{t.loading}</div>
        ) : loadError ? (
          <div className="upcoming-calendar-empty">{loadError}</div>
        ) : filteredEvents.length ? (
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
                  const category = getEventCategoryLabel(event.category, language);

                  return (
                    <article key={event.id} className="upcoming-event-card">
                      <Link
                        to={`/${language}/events/${event.slug}`}
                        className="upcoming-event-link"
                        aria-label={`${t.open}: ${event.title}`}
                      >
                        <div className="upcoming-event-image-wrap">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="upcoming-event-image"
                          />
                          {category && (
                            <span className="upcoming-event-badge">
                              {category}
                            </span>
                          )}
                        </div>

                        <div className="upcoming-event-body">
                          <h3>{event.title}</h3>

                          <div className="upcoming-event-meta">
                            {event.location && (
                              <span className="upcoming-event-location">
                                {event.location}
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