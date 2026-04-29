import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";

const INITIAL_VISIBLE_COUNT = 12;
const LOAD_MORE_COUNT = 12;
const ALLOWED_FILTERS = ["all", "concert", "theatre", "exhibition", "kids"];
const API_BASE_URL = "";

function formatEventDate(dateString, language) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  const day = date.getDate();

  const time = new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const months = {
    ru: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ],
    uz: [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avgust",
      "sentabr",
      "oktabr",
      "noyabr",
      "dekabr",
    ],
  };

  const month =
    months[language]?.[date.getMonth()] || months.ru[date.getMonth()];

  return `${day} ${month}, ${time}`;
}

function AllEventsPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const filterFromUrl = searchParams.get("filter");
  const activeFilter =
    filterFromUrl && ALLOWED_FILTERS.includes(filterFromUrl)
      ? filterFromUrl
      : "all";

  const uiText = {
    ru: {
      title: "Афиша",
      subtitle:
        "Концерты, спектакли, выставки и события для детей в Ташкенте — всё в одном разделе. Выбирайте событие, смотрите детали и переходите к покупке билетов.",
      filters: {
        all: "Все события",
        concert: "Концерты",
        theatre: "Спектакли",
        exhibition: "Выставки",
        kids: "Для детей",
      },
      date: "Дата",
      price: "Билеты",
      more: "Подробнее",
      loadMore: "Показать ещё",
      empty: "Событий по выбранному фильтру пока нет.",
      home: "Главная",
      loading: "Загрузка событий...",
      error: "Не удалось загрузить события.",
    },
    uz: {
      title: "Afisha",
      subtitle:
        "Toshkentdagi konsertlar, spektakllar, ko‘rgazmalar va bolalar uchun tadbirlar — hammasi bitta bo‘limda. Tadbirni tanlang, tafsilotlarni ko‘ring va chipta xaridiga o‘ting.",
      filters: {
        all: "Barcha tadbirlar",
        concert: "Konsertlar",
        theatre: "Spektakllar",
        exhibition: "Ko‘rgazmalar",
        kids: "Bolalar uchun",
      },
      date: "Sana",
      price: "Chiptalar",
      more: "Batafsil",
      loadMore: "Yana ko‘rsatish",
      empty: "Tanlangan filtr bo‘yicha hozircha tadbirlar yo‘q.",
      home: "Bosh sahifa",
      loading: "Tadbirlar yuklanmoqda...",
      error: "Tadbirlarni yuklab bo‘lmadi.",
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
        console.error("LOAD EVENTS ERROR:", error);
        setLoadError(t.error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [language, t.error]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeFilter, language]);

  const setFilter = (filter) => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);

    if (filter === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ filter });
    }
  };

  const normalizedEvents = useMemo(() => {
    return events.map((event) => {
      const translation = event.translations?.[0] || null;
      const firstSession = event.sessions?.[0] || null;

      return {
        id: event.id,
        slug: event.slug,
        type: event.type,
        isForKids: event.isForKids,
        coverImage: event.coverImage,
        title: translation?.title || "",
        shortDescription: translation?.shortDescription || "",
        description: translation?.description || "",
        address: translation?.address || "",
        ticketPrice: translation?.ticketPrice || firstSession?.price || "",
        date: firstSession?.startAt || null,
      };
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") {
      return normalizedEvents;
    }

    if (activeFilter === "kids") {
      return normalizedEvents.filter((event) => event.isForKids);
    }

    return normalizedEvents.filter((event) => event.type === activeFilter);
  }, [normalizedEvents, activeFilter]);

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  return (
    <>
      <Seo title={t.title} description={t.subtitle} />

      <main className="main">
        <section className="all-events-page">
          <div className="container">
            <div className="all-events-breadcrumbs">
              <Link to={`/${language}`}>{t.home}</Link>
              <span> / </span>
              <span>{t.title}</span>
            </div>

            <div className="all-events-header">
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>

            <div className="all-events-filters">
              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "all" ? "active" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                {t.filters.all}
              </button>

              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "concert" ? "active" : ""
                }`}
                onClick={() => setFilter("concert")}
              >
                {t.filters.concert}
              </button>

              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "theatre" ? "active" : ""
                }`}
                onClick={() => setFilter("theatre")}
              >
                {t.filters.theatre}
              </button>

              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "exhibition" ? "active" : ""
                }`}
                onClick={() => setFilter("exhibition")}
              >
                {t.filters.exhibition}
              </button>

              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "kids" ? "active" : ""
                }`}
                onClick={() => setFilter("kids")}
              >
                {t.filters.kids}
              </button>
            </div>

            {isLoading ? (
              <div className="all-events-empty">{t.loading}</div>
            ) : loadError ? (
              <div className="all-events-empty">{loadError}</div>
            ) : visibleEvents.length > 0 ? (
              <>
                <div className="all-events-grid">
                  {visibleEvents.map((event) => (
                    <article className="all-events-card" key={event.slug}>
                      <Link
                        to={`/${language}/events/${event.slug}`}
                        className="all-events-card-link"
                      >
                        <div className="all-events-card-image-wrap">
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="all-events-card-image"
                          />

                          <span className="all-events-card-badge">
                            {activeFilter === "kids"
                              ? t.filters.kids
                              : event.type === "concert"
                                ? t.filters.concert
                                : event.type === "theatre"
                                  ? t.filters.theatre
                                  : event.type === "exhibition"
                                    ? t.filters.exhibition
                                    : t.filters.all}
                          </span>
                        </div>

                        <div className="all-events-card-body">
                          <h2>{event.title}</h2>

                          <p className="all-events-card-description">
                            {event.shortDescription}
                          </p>

                          <div className="all-events-card-meta">
                            <div className="all-events-card-meta-row">
                              <span className="all-events-card-meta-label">
                                {t.date}
                              </span>
                              <span className="all-events-card-meta-value">
                                {formatEventDate(event.date, language)}
                              </span>
                            </div>

                            <div className="all-events-card-meta-row">
                              <span className="all-events-card-meta-label">
                                {t.price}
                              </span>
                              <span className="all-events-card-meta-value">
                                {event.ticketPrice}
                              </span>
                            </div>
                          </div>

                          <span className="all-events-card-more">{t.more}</span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>

                {hasMore && (
                  <div className="more-news-action">
                    <button
                      className="more-news-button"
                      type="button"
                      onClick={handleLoadMore}
                    >
                      {t.loadMore}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="all-events-empty">{t.empty}</div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default AllEventsPage;