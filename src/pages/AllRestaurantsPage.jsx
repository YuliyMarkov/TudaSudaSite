import { Link } from "react-router-dom";
import { restaurantsData } from "../data/restaurantsData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";
import AdBlock from "../components/AdBlock";

function AllRestaurantsPage() {
  const { language } = useLanguage();

  const uiText = {
    ru: {
      title: "Рестораны",
      description:
        "Подборка ресторанов, кафе и гастрономических мест Ташкента для свиданий, встреч с друзьями и спокойных семейных ужинов.",
      averageCheck: "Средний чек",
      cuisine: "Кухня",
      format: "Формат",
      openCard: "Открыть место",
      emptyTitle: "Пока заведений нет",
      emptyText: "Этот раздел скоро будет заполнен подборкой ресторанов и гастрономических мест.",
    },
    uz: {
      title: "Restoranlar",
      description:
        "Toshkentdagi restoranlar, kafelar va gastronomik joylar tanlovi — uchrashuvlar, do‘stlar bilan yig‘ilishlar va oilaviy kechki ovqatlar uchun.",
      averageCheck: "O‘rtacha чек",
      cuisine: "Oshxona",
      format: "Format",
      openCard: "Joyni ochish",
      emptyTitle: "Hozircha joylar yo‘q",
      emptyText:
        "Bu bo‘lim tez orada restoranlar va gastronomik joylar tanlovi bilan to‘ldiriladi.",
    },
  };

  const t = uiText[language] || uiText.ru;

  return (
    <>
      <Seo title={t.title} description={t.description} />

      <main className="main">
        <section className="restaurants-page">
          <div className="container">
            <div className="restaurants-hero">
              <h1>{t.title}</h1>
              <p>{t.description}</p>
            </div>

            <AdBlock/>

            {!restaurantsData.length ? (
              <div className="restaurants-empty-state">
                <h2>{t.emptyTitle}</h2>
                <p>{t.emptyText}</p>
              </div>
            ) : (
              <div className="restaurants-grid">
                {restaurantsData.map((restaurant) => {
                  const title = getLocalizedValue(restaurant.title, language);
                  const type = getLocalizedValue(restaurant.type, language);
                  const cuisine = getLocalizedValue(restaurant.cuisine, language);
                  const averageCheck = getLocalizedValue(
                    restaurant.averageCheck,
                    language
                  );
                  const description = getLocalizedValue(
                    restaurant.description,
                    language
                  );
                  const mustVisit = getLocalizedValue(
                    restaurant.mustVisit,
                    language
                  );
                  const formatList =
                    restaurant.format?.[language] ||
                    restaurant.format?.ru ||
                    [];

                  return (
                    <article
                      className="restaurant-card"
                      key={restaurant.slug}
                    >
                      <Link
                        to={`/${language}/restaurants/${restaurant.slug}`}
                        className="restaurant-card-link"
                      >
                        <div className="restaurant-card-image-wrap">
                          <img
                            src={restaurant.cover}
                            alt={title}
                            className="restaurant-card-image"
                          />
                        </div>

                        <div className="restaurant-card-body">
                          <h2>{title}</h2>

                          <div className="restaurant-card-meta">
                            <span className="restaurant-card-chip">{type}</span>
                            <span className="restaurant-card-chip">
                              {cuisine}
                            </span>
                            <span className="restaurant-card-chip">
                              {averageCheck}
                            </span>
                          </div>

                          <div className="restaurant-card-info">
                            <div className="restaurant-card-row">
                              <span className="restaurant-card-label">
                                {t.cuisine}:
                              </span>
                              <span className="restaurant-card-value">
                                {cuisine}
                              </span>
                            </div>

                            <div className="restaurant-card-row">
                              <span className="restaurant-card-label">
                                {t.averageCheck}:
                              </span>
                              <span className="restaurant-card-value">
                                {averageCheck}
                              </span>
                            </div>

                            {!!formatList.length && (
                              <div className="restaurant-card-row">
                                <span className="restaurant-card-label">
                                  {t.format}:
                                </span>
                                <span className="restaurant-card-value">
                                  {formatList.join(", ")}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="restaurant-card-description">
                            {description}
                          </p>

                          <div className="restaurant-card-highlight">
                            <strong>👉</strong> <span>{mustVisit}</span>
                          </div>

                          <span className="restaurant-card-button">
                            {t.openCard}
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default AllRestaurantsPage;