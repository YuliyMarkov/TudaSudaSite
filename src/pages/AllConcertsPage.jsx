import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  upcomingEvents,
  moreNewsInitial,
  moreNewsExtra,
} from "../data/homePageData";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

const allStoriesData = [...moreNewsInitial, ...moreNewsExtra];

function formatConcertDate(dateString, language) {
  const locale = language === "uz" ? "uz-UZ" : "ru-RU";

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  }).format(new Date(`${dateString}T00:00:00`));
}

function AllConcertsPage() {
  const { lang } = useParams();
  const language = lang === "uz" ? "uz" : "ru";

  const uiText = {
    ru: {
      title: "Концерты",
      description:
        "Концерты в Ташкенте: выступления зарубежных и местных артистов, музыкальные вечера и самые заметные события городской афиши.",
      empty:
        "Пока в этом разделе нет концертов. Скоро здесь появятся новые музыкальные события.",
      locationLabel: "Локация",
      dateLabel: "Дата",
      openStory: "Подробнее",
      comingSoon: "Скоро материал",
    },
    uz: {
      title: "Konsertlar",
      description:
        "Toshkentdagi dolzarb konsertlar: yirik chiqishlar, musiqiy kechalar va shahar afishasidagi eng sezilarli tadbirlar.",
      empty:
        "Hozircha bu bo‘limda konsertlar yo‘q. Tez orada bu yerda yangi musiqiy tadbirlar paydo bo‘ladi.",
      locationLabel: "Joy",
      dateLabel: "Sana",
      openStory: "Batafsil",
      comingSoon: "Material tez orada",
    },
  };

  const t = uiText[language];

  const storySlugs = useMemo(() => {
    return new Set(allStoriesData.map((item) => item.slug));
  }, []);

  const concerts = useMemo(() => {
    return upcomingEvents
      .filter((event) => {
        const category = getLocalizedValue(event.categoryLabel, language);
        return (
          category?.toLowerCase() ===
          (language === "uz" ? "konsert" : "концерт")
        );
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((event) => ({
        ...event,
        hasStory: storySlugs.has(event.slug),
      }));
  }, [language, storySlugs]);

  return (
    <>
      <Seo title={t.title} description={t.description} />

      <main className="section-page">
        <div className="container">
          <section className="section-page-hero">
            <div className="section-page-eyebrow">🎤 TudaSuda</div>
            <h1>{t.title}</h1>
            <p>{t.description}</p>
          </section>

          {concerts.length === 0 ? (
            <section className="section-page-empty">
              <p>{t.empty}</p>
            </section>
          ) : (
            <section className="section-page-grid">
              {concerts.map((event) => {
                const title = getLocalizedValue(event.title, language);
                const location = getLocalizedValue(event.location, language);
                const categoryLabel = getLocalizedValue(
                  event.categoryLabel,
                  language
                );

                const cardInner = (
                  <>
                    <div className="section-page-card-image-wrap">
                      <img
                        src={event.image}
                        alt={title}
                        className="section-page-card-image"
                      />
                      <span className="section-page-card-badge">
                        {categoryLabel}
                      </span>
                    </div>

                    <div className="section-page-card-body">
                      <h2>{title}</h2>

                      <div className="section-page-card-meta">
                        <div className="section-page-card-meta-item">
                          <span className="section-page-card-meta-label">
                            {t.dateLabel}
                          </span>
                          <span>{formatConcertDate(event.date, language)}</span>
                        </div>

                        <div className="section-page-card-meta-item">
                          <span className="section-page-card-meta-label">
                            {t.locationLabel}
                          </span>
                          <span>{location}</span>
                        </div>
                      </div>

                      <span
                        className={`section-page-card-more ${
                          event.hasStory ? "" : "is-muted"
                        }`}
                      >
                        {event.hasStory ? t.openStory : t.comingSoon}
                      </span>
                    </div>
                  </>
                );

                return (
                  <article className="section-page-card" key={event.id}>
                    {event.hasStory ? (
                      <Link
                        to={`/${language}/stories/${event.slug}`}
                        className="section-page-card-link"
                      >
                        {cardInner}
                      </Link>
                    ) : (
                      <div className="section-page-card-link is-static">
                        {cardInner}
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export default AllConcertsPage;