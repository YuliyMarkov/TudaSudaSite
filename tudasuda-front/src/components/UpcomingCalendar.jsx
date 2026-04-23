import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "";

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

function getEventCategoryLabel(category, language) {
  const labels = {
    ru: {
      concert: "Концерт",
      theatre: "Театр",
      exhibition: "Выставка",
      kids: "Детям",
      movie: "Кино",
    },
    uz: {
      concert: "Konsert",
      theatre: "Teatr",
      exhibition: "Ko‘rgazma",
      kids: "Bolalar uchun",
      movie: "Kino",
    },
  };

  return labels[language]?.[category] || labels.ru?.[category] || "";
}

function groupEventsByDate(events = []) {
  const grouped = new Map();

  events.forEach((event) => {
    const sessions = Array.isArray(event.sessions) ? event.sessions : [];

    sessions.forEach((session) => {
      if (!session?.startAt) return;

      const dateKey = new Date(session.startAt)
        .toISOString()
        .split("T")[0];

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }

      grouped.get(dateKey).push({
        id: `event-${event.id}-${session.startAt}`,
        sourceId: event.id,
        slug: event.slug,
        image: event.coverImage || event.posterImage || "",
        title: event.translations?.[0]?.title || "",
        location:
          event.translations?.[0]?.venue ||
          event.translations?.[0]?.address ||
          "",
        category: event.isForKids
          ? "kids"
          : event.type === "concert"
            ? "concert"
            : event.type === "theatre"
              ? "theatre"
              : event.type === "exhibition"
                ? "exhibition"
                : "",
        href: `/events/${event.slug}`,
        sortDate: session.startAt,
        isFeatured: Boolean(event.isFeatured),
      });
    });
  });

  return grouped;
}

function groupMoviesByDate(movies = []) {
  const grouped = new Map();

  movies.forEach((movie) => {
    const dates = Array.isArray(movie.calendarDates) ? movie.calendarDates : [];
    const translation = movie.translations?.[0] || null;

    dates.forEach((calendarDate) => {
      if (!calendarDate?.date) return;

      const dateKey = new Date(calendarDate.date).toISOString().split("T")[0];

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }

      grouped.get(dateKey).push({
        id: `movie-${movie.id}-${dateKey}`,
        sourceId: movie.id,
        slug: movie.slug,
        image: movie.posterImage || movie.coverImage || "",
        title: translation?.title || "",
        location: translation?.country || "",
        category: "movie",
        href: `/movies/${movie.slug}`,
        sortDate: calendarDate.date,
        isFeatured: Boolean(movie.isFeatured),
      });
    });
  });

  return grouped;
}

function dedupeItems(items = []) {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.category}-${item.sourceId}-${item.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mergeGroupedItems(eventsMap, moviesMap) {
  const merged = new Map();
  const allKeys = new Set([...eventsMap.keys(), ...moviesMap.keys()]);

  allKeys.forEach((dateKey) => {
    const events = eventsMap.get(dateKey) || [];
    const movies = moviesMap.get(dateKey) || [];

    const combined = dedupeItems(
      [...events, ...movies].filter((item) => item.title && item.image && item.href)
    );

    combined.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }

      const timeA = a.sortDate ? new Date(a.sortDate).getTime() : 0;
      const timeB = b.sortDate ? new Date(b.sortDate).getTime() : 0;

      return timeA - timeB;
    });

    merged.set(dateKey, combined);
  });

  return merged;
}

function UpcomingCalendar() {
  const { language } = useLanguage();
  const activeDateRef = useRef(null);
  const sliderRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [movies, setMovies] = useState([]);
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
    let isMounted = true;

    async function loadCalendarItems() {
      try {
        setIsLoading(true);
        setLoadError("");

        const [eventsResponse, moviesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events?status=published&lang=${language}`),
          fetch(`${API_BASE_URL}/api/movies?status=published&lang=${language}`),
        ]);

        if (!eventsResponse.ok || !moviesResponse.ok) {
          throw new Error("Failed to load calendar items");
        }

        const [eventsData, moviesData] = await Promise.all([
          eventsResponse.json(),
          moviesResponse.json(),
        ]);

        if (!isMounted) return;

        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setMovies(Array.isArray(moviesData) ? moviesData : []);
      } catch (error) {
        console.error("LOAD UPCOMING CALENDAR ERROR:", error);

        if (!isMounted) return;
        setEvents([]);
        setMovies([]);
        setLoadError(t.error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCalendarItems();

    return () => {
      isMounted = false;
    };
  }, [language, t.error]);

  const groupedEvents = useMemo(() => groupEventsByDate(events), [events]);
  const groupedMovies = useMemo(() => groupMoviesByDate(movies), [movies]);
  const groupedItems = useMemo(
    () => mergeGroupedItems(groupedEvents, groupedMovies),
    [groupedEvents, groupedMovies]
  );

  const todayIso = useMemo(() => toIsoDate(new Date()), []);

  const calendarDates = useMemo(() => {
    const start = new Date(`${todayIso}T00:00:00`);
    return Array.from({ length: 60 }, (_, index) => {
      return toIsoDate(addDays(start, index));
    });
  }, [todayIso]);

  const [selectedDate, setSelectedDate] = useState(todayIso);

  const filteredItems = useMemo(() => {
    return groupedItems.get(selectedDate) || [];
  }, [groupedItems, selectedDate]);

  useEffect(() => {
    if (activeDateRef.current) {
      activeDateRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: 0,
        behavior: "auto",
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
            const hasItems = groupedItems.has(date);

            return (
              <button
                key={date}
                ref={isActive ? activeDateRef : null}
                type="button"
                className={`upcoming-calendar-date ${isActive ? "active" : ""} ${
                  hasItems ? "has-events" : ""
                }`}
                onClick={() => setSelectedDate(date)}
                role="tab"
                aria-selected={isActive}
              >
                <span className="upcoming-calendar-weekday">{weekday}</span>
                <span className="upcoming-calendar-day">{day}</span>
                <span className="upcoming-calendar-month">{month}</span>
                {hasItems && <span className="upcoming-calendar-dot" />}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="upcoming-calendar-empty">{t.loading}</div>
        ) : loadError ? (
          <div className="upcoming-calendar-empty">{loadError}</div>
        ) : filteredItems.length ? (
          <div className="upcoming-calendar-slider-wrap">
            <button
              className="upcoming-calendar-nav prev"
              type="button"
              aria-label={t.prev}
              onClick={() => scrollSlider("prev")}
            >
              &#10094;
            </button>

            <div
              ref={sliderRef}
              className="upcoming-calendar-slider"
              key={selectedDate}
            >
              <div className="upcoming-calendar-track">
                {filteredItems.map((item) => {
                  const category = getEventCategoryLabel(item.category, language);

                  return (
                    <article key={item.id} className="upcoming-event-card">
                      <Link
                        to={`/${language}${item.href}`}
                        className="upcoming-event-link"
                        aria-label={`${t.open}: ${item.title}`}
                      >
                        <div className="upcoming-event-image-wrap">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="upcoming-event-image"
                          />
                          {category && (
                            <span className="upcoming-event-badge">
                              {category}
                            </span>
                          )}
                        </div>

                        <div className="upcoming-event-body">
                          <h3>{item.title}</h3>

                          <div className="upcoming-event-meta">
                            {item.location ? (
                              <span className="upcoming-event-location">
                                {item.location}
                              </span>
                            ) : null}
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