import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { theatreEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

function AllTheatrePage() {
  const { language } = useLanguage();
  const [activeDay, setActiveDay] = useState("today");

  const uiText = {
    ru: {
      title: "Все спектакли",
      description:
        "Театральная афиша Ташкента: спектакли, премьеры и постановки на сегодня, завтра и выходные.",
      open: "Открыть спектакль",
      filters: {
        today: "Сегодня",
        tomorrow: "Завтра",
        weekend: "Выходные",
      },
      noResults: "На выбранный день спектаклей пока нет.",
      sessions: "Показы",
    },
    uz: {
      title: "Barcha spektakllar",
      description:
        "Toshkent teatr afishasi: bugun, ertaga va dam olish kunlari uchun spektakllar va premyeralar.",
      open: "Spektaklni ochish",
      filters: {
        today: "Bugun",
        tomorrow: "Ertaga",
        weekend: "Dam olish",
      },
      noResults: "Tanlangan kun uchun spektakllar hozircha yo‘q.",
      sessions: "Namoyishlar",
    },
  };

  const t = uiText[language] || uiText.ru;

  const filteredTheatre = useMemo(() => {
    return theatreEvents.filter((item) => {
      const sessions = item.schedule?.[activeDay];
      return Array.isArray(sessions) && sessions.length > 0;
    });
  }, [activeDay]);

  return (
    <>
      <Seo title={t.title} description={t.description} />

      <section className="all-theatre-page">
        <div className="container">
          <div className="all-theatre-header">
            <h1>{t.title}</h1>

            <div className="all-theatre-filters">
              <button
                type="button"
                className={activeDay === "today" ? "active" : ""}
                onClick={() => setActiveDay("today")}
              >
                {t.filters.today}
              </button>

              <button
                type="button"
                className={activeDay === "tomorrow" ? "active" : ""}
                onClick={() => setActiveDay("tomorrow")}
              >
                {t.filters.tomorrow}
              </button>

              <button
                type="button"
                className={activeDay === "weekend" ? "active" : ""}
                onClick={() => setActiveDay("weekend")}
              >
                {t.filters.weekend}
              </button>
            </div>
          </div>

          {filteredTheatre.length ? (
            <div className="all-theatre-grid">
              {filteredTheatre.map((item) => {
                const title = getLocalizedValue(item.title, language);
                const subtitle = getLocalizedValue(item.subtitle, language);
                const location = getLocalizedValue(item.location, language);
                const category = getLocalizedValue(item.categoryLabel, language);
                const sessions = item.schedule?.[activeDay] || [];

                return (
                  <article key={item.id} className="all-theatre-card">
                    <Link
                      to={`/${language}/news/${item.slug}`}
                      className="all-theatre-card-link"
                      aria-label={`${t.open}: ${title}`}
                    >
                      <div className="all-theatre-image-wrap">
                        <img
                          src={item.image}
                          alt={title}
                          className="all-theatre-image"
                        />
                        {category && (
                          <span className="all-theatre-badge">{category}</span>
                        )}
                      </div>

                      <div className="all-theatre-card-body">
                        <h3>{title}</h3>

                        {subtitle && (
                          <p className="all-theatre-subtitle">{subtitle}</p>
                        )}

                        {location && (
                          <p className="all-theatre-location">{location}</p>
                        )}

                        {sessions.length > 0 && (
                          <div className="all-theatre-sessions">
                            <span className="all-theatre-sessions-label">
                              {t.sessions}:
                            </span>

                            <div className="all-theatre-sessions-list">
                              {sessions.map((session) => (
                                <span
                                  key={`${item.id}-${activeDay}-${session}`}
                                  className="all-theatre-session-chip"
                                >
                                  {session}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="all-theatre-empty">{t.noResults}</div>
          )}
        </div>
      </section>
    </>
  );
}

export default AllTheatrePage;