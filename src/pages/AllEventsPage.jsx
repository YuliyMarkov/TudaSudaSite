import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { eventsData } from "../data/eventsData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

const VALID_FILTERS = ["all", "concert", "theatre", "exhibition", "kids"];
const INITIAL_VISIBLE_COUNT = 12;
const LOAD_MORE_STEP = 6;

function AllEventsPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleCounts, setVisibleCounts] = useState({
    all: INITIAL_VISIBLE_COUNT,
    concert: INITIAL_VISIBLE_COUNT,
    theatre: INITIAL_VISIBLE_COUNT,
    exhibition: INITIAL_VISIBLE_COUNT,
    kids: INITIAL_VISIBLE_COUNT,
  });

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
      showMore: "Показать ещё",
      empty: "Событий по выбранному фильтру пока нет.",
      home: "Главная",
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
      showMore: "Yana ko‘rsatish",
      empty: "Tanlangan filtr bo‘yicha hozircha tadbirlar yo‘q.",
      home: "Bosh sahifa",
    },
  };

  const t = uiText[language] || uiText.ru;

  const filterFromUrl = searchParams.get("filter");
  const activeFilter =
    filterFromUrl && VALID_FILTERS.includes(filterFromUrl)
      ? filterFromUrl
      : "all";

  const handleFilterChange = (filter) => {
    if (filter === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({ filter });
  };

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") {
      return eventsData;
    }

    if (activeFilter === "kids") {
      return eventsData.filter((event) => event.isForKids);
    }

    return eventsData.filter((event) => event.type === activeFilter);
  }, [activeFilter]);

  const visibleCount = visibleCounts[activeFilter] ?? INITIAL_VISIBLE_COUNT;
  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = filteredEvents.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCounts((prev) => ({
      ...prev,
      [activeFilter]: (prev[activeFilter] ?? INITIAL_VISIBLE_COUNT) + LOAD_MORE_STEP,
    }));
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
                onClick={() => handleFilterChange("all")}
              >
                {t.filters.all}
              </button>

              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "concert" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("concert")}
              >
                {t.filters.concert}
              </button>

              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "theatre" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("theatre")}
              >
                {t.filters.theatre}
              </button>

              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "exhibition" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("exhibition")}
              >
                {t.filters.exhibition}
              </button>

              <button
                type="button"
                className={`all-events-filter-btn ${
                  activeFilter === "kids" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("kids")}
              >
                {t.filters.kids}
              </button>
            </div>

            {visibleEvents.length > 0 ? (
              <>
                <div className="all-events-grid">
                  {visibleEvents.map((event) => {
                    const title = getLocalizedValue(event.title, language);
                    const shortDescription = getLocalizedValue(
                      event.shortDescription,
                      language
                    );
                    const categoryLabel = getLocalizedValue(
                      event.categoryLabel,
                      language
                    );
                    const date = getLocalizedValue(event.date, language);
                    const ticketPrice = getLocalizedValue(
                      event.ticketPrice,
                      language
                    );

                    return (
                      <article className="all-events-card" key={event.slug}>
                        <Link
                          to={`/${language}/events/${event.slug}`}
                          className="all-events-card-link"
                        >
                          <div className="all-events-card-image-wrap">
                            <img
                              src={event.cover}
                              alt={title}
                              className="all-events-card-image"
                            />

                            <span className="all-events-card-badge">
                              {categoryLabel}
                            </span>
                          </div>

                          <div className="all-events-card-body">
                            <h2>{title}</h2>

                            <p className="all-events-card-description">
                              {shortDescription}
                            </p>

                            <div className="all-events-card-meta">
                              <div className="all-events-card-meta-row">
                                <span className="all-events-card-meta-label">
                                  {t.date}
                                </span>
                                <span className="all-events-card-meta-value">
                                  {date}
                                </span>
                              </div>

                              <div className="all-events-card-meta-row">
                                <span className="all-events-card-meta-label">
                                  {t.price}
                                </span>
                                <span className="all-events-card-meta-value">
                                  {ticketPrice}
                                </span>
                              </div>
                            </div>

                            <span className="all-events-card-more">
                              {t.more}
                            </span>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>

                {hasMore && (
                  <div className="all-events-more-wrap">
                    <button
                      type="button"
                      className="all-events-more-btn"
                      onClick={handleShowMore}
                    >
                      {t.showMore}
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