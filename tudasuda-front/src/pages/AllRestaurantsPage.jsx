import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";
import AdBlock from "../components/AdBlock";

const API_BASE_URL = "";

function AllRestaurantsPage() {
  const { language } = useLanguage();

  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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
      emptyText:
        "Этот раздел скоро будет заполнен подборкой ресторанов и гастрономических мест.",
      loading: "Загрузка заведений...",
      error: "Не удалось загрузить заведения.",
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
      loading: "Joylar yuklanmoqda...",
      error: "Joylarni yuklab bo‘lmadi.",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/restaurants?status=published&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load restaurants");
        }

        const data = await response.json();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD RESTAURANTS ERROR:", error);
        setLoadError(t.error);
        setRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadRestaurants();
  }, [language, t.error]);

  const normalizedRestaurants = useMemo(() => {
    return restaurants.map((restaurant) => {
      const translation = restaurant.translations?.[0] || null;

      const formatList =
        restaurant.formats?.map((item) => item.value).filter(Boolean) || [];

      return {
        id: restaurant.id,
        slug: restaurant.slug,
        cover: restaurant.coverImage,
        title: translation?.title || "",
        type: translation?.type || "",
        cuisine: translation?.cuisine || "",
        averageCheck: translation?.averageCheck || "",
        description: translation?.description || "",
        mustVisit: translation?.mustVisit || "",
        formatList,
      };
    });
  }, [restaurants]);

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

            <AdBlock />

            {isLoading ? (
              <div className="restaurants-empty-state">
                <h2>{t.loading}</h2>
              </div>
            ) : loadError ? (
              <div className="restaurants-empty-state">
                <h2>{t.error}</h2>
              </div>
            ) : !normalizedRestaurants.length ? (
              <div className="restaurants-empty-state">
                <h2>{t.emptyTitle}</h2>
                <p>{t.emptyText}</p>
              </div>
            ) : (
              <div className="restaurants-grid">
                {normalizedRestaurants.map((restaurant) => {
                  return (
                    <article className="restaurant-card" key={restaurant.slug}>
                      <Link
                        to={`/${language}/restaurants/${restaurant.slug}`}
                        className="restaurant-card-link"
                      >
                        <div className="restaurant-card-image-wrap">
                          <img
                            src={restaurant.cover}
                            alt={restaurant.title}
                            className="restaurant-card-image"
                          />
                        </div>

                        <div className="restaurant-card-body">
                          <h2>{restaurant.title}</h2>

                          <div className="restaurant-card-meta">
                            {restaurant.type && (
                              <span className="restaurant-card-chip">
                                {restaurant.type}
                              </span>
                            )}

                            {restaurant.cuisine && (
                              <span className="restaurant-card-chip">
                                {restaurant.cuisine}
                              </span>
                            )}

                            {restaurant.averageCheck && (
                              <span className="restaurant-card-chip">
                                {restaurant.averageCheck}
                              </span>
                            )}
                          </div>

                          <div className="restaurant-card-info">
                            <div className="restaurant-card-row">
                              <span className="restaurant-card-label">
                                {t.cuisine}:
                              </span>
                              <span className="restaurant-card-value">
                                {restaurant.cuisine}
                              </span>
                            </div>

                            <div className="restaurant-card-row">
                              <span className="restaurant-card-label">
                                {t.averageCheck}:
                              </span>
                              <span className="restaurant-card-value">
                                {restaurant.averageCheck}
                              </span>
                            </div>

                            {!!restaurant.formatList.length && (
                              <div className="restaurant-card-row">
                                <span className="restaurant-card-label">
                                  {t.format}:
                                </span>
                                <span className="restaurant-card-value">
                                  {restaurant.formatList.join(", ")}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="restaurant-card-description">
                            {restaurant.description}
                          </p>

                          {!!restaurant.mustVisit && (
                            <div className="restaurant-card-highlight">
                              <strong>👉</strong>{" "}
                              <span>{restaurant.mustVisit}</span>
                            </div>
                          )}

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