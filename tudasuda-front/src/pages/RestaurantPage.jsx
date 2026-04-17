import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";
import AdBlock from "../components/AdBlock";

const API_BASE_URL = "http://localhost:4000";

function getBrowserToken() {
  const storageKey = "restaurant-browser-token";
  const existing = localStorage.getItem(storageKey);

  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `browser_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(storageKey, generated);
  return generated;
}

function RestaurantPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const [browserToken, setBrowserToken] = useState("");
  const [userRating, setUserRating] = useState(0);

  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  const uiText = {
    ru: {
      home: "Главная",
      back: "Рестораны",
      notFoundTitle: "Заведение не найдено",
      notFoundText: "Похоже, такого места пока нет в каталоге.",
      type: "Формат",
      cuisine: "Кухня",
      averageCheck: "Средний чек",
      address: "Адрес",
      workingHours: "Режим работы",
      phone: "Телефон",
      contacts: "Контакты",
      prices: "Цены",
      topDishes: "Топ-блюда",
      format: "Для кого",
      atmosphere: "Атмосфера",
      amenities: "Удобства",
      mustVisit: "Кому сюда идти",
      yourRating: "Оцените место:",
      starsAria: "Поставить оценку",
      map: "Локация на карте",
      instagram: "Instagram",
      telegram: "Telegram",
      website: "Сайт",
      phoneContact: "Телефон",
      parking: "Парковка",
      wifi: "Wi-Fi",
      booking: "Бронь",
      delivery: "Доставка",
      smoking: "Курение",
      terrace: "Терраса",
      music: "Музыка",
      loading: "Загрузка заведения...",
      error: "Не удалось загрузить заведение.",
      averageRating: "Средняя оценка",
      votes: "голосов",
      ratingError: "Не удалось сохранить оценку.",
      noData: "Уточняется",
    },
    uz: {
      home: "Bosh sahifa",
      back: "Restoranlar",
      notFoundTitle: "Joy topilmadi",
      notFoundText: "Aftidan, bunday joy hozircha katalogda yo‘q.",
      type: "Format",
      cuisine: "Oshxona",
      averageCheck: "O‘rtacha чек",
      address: "Manzil",
      workingHours: "Ish vaqti",
      phone: "Telefon",
      contacts: "Kontaktlar",
      prices: "Narxlar",
      topDishes: "Top taomlar",
      format: "Kimlar uchun",
      atmosphere: "Muhit",
      amenities: "Qulayliklar",
      mustVisit: "Kimlar kelishi kerak",
      yourRating: "Joyni baholang:",
      starsAria: "Baho qo‘yish",
      map: "Xaritadagi joylashuv",
      instagram: "Instagram",
      telegram: "Telegram",
      website: "Sayt",
      phoneContact: "Telefon",
      parking: "Avtoturargoh",
      wifi: "Wi-Fi",
      booking: "Bron",
      delivery: "Yetkazib berish",
      smoking: "Chekish",
      terrace: "Terrasa",
      music: "Musiqa",
      loading: "Joy yuklanmoqda...",
      error: "Joyni yuklab bo‘lmadi.",
      averageRating: "O‘rtacha baho",
      votes: "ta ovoz",
      ratingError: "Bahoni saqlab bo‘lmadi.",
      noData: "Aniqlanmoqda",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    const token = getBrowserToken();
    setBrowserToken(token);
  }, []);

  useEffect(() => {
    if (!browserToken) return;

    async function loadRestaurant() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/restaurants/${slug}?lang=${language}&browserToken=${encodeURIComponent(browserToken)}`
        );

        if (response.status === 404) {
          setRestaurant(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load restaurant");
        }

        const data = await response.json();
        setRestaurant(data);
        setUserRating(data.userRating || 0);
      } catch (error) {
        console.error("LOAD RESTAURANT ERROR:", error);
        setLoadError(t.error);
        setRestaurant(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadRestaurant();
  }, [slug, language, browserToken, t.error]);

  const handleUserRating = async (value) => {
    if (!restaurant?.id || !browserToken || isRatingLoading) return;

    try {
      setIsRatingLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/restaurants/${restaurant.id}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            browserToken,
            value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save rating");
      }

      const data = await response.json();

      setUserRating(data.userRating || value);
      setRestaurant((prev) =>
        prev
          ? {
              ...prev,
              ratingAverage:
                typeof data.ratingAverage === "number"
                  ? data.ratingAverage
                  : prev.ratingAverage,
              ratingCount:
                typeof data.ratingCount === "number"
                  ? data.ratingCount
                  : prev.ratingCount,
              userRating: data.userRating || value,
            }
          : prev
      );
    } catch (error) {
      console.error("RATE RESTAURANT ERROR:", error);
      alert(t.ratingError);
    } finally {
      setIsRatingLoading(false);
    }
  };

  const normalizedRestaurant = useMemo(() => {
    if (!restaurant) return null;

    const translation = restaurant.translations?.[0] || null;

    const formatList =
      restaurant.formats?.map((item) => item.value).filter(Boolean) || [];

    const priceItems =
      restaurant.prices?.map((item) => item.value).filter(Boolean) || [];

    const topDishes =
      restaurant.dishes?.map((dish) => ({
        image: dish.image,
        title: dish.title,
      })) || [];

    const amenityItems = [
      restaurant.parking ? t.parking : null,
      restaurant.wifi ? t.wifi : null,
      restaurant.booking ? t.booking : null,
      restaurant.delivery ? t.delivery : null,
      restaurant.smoking ? t.smoking : null,
      restaurant.terrace ? t.terrace : null,
      restaurant.music ? t.music : null,
    ].filter(Boolean);

    return {
      id: restaurant.id,
      slug: restaurant.slug,
      cover: restaurant.coverImage,
      mapEmbed: restaurant.mapEmbed,
      phone: restaurant.phone,
      instagram: restaurant.instagram,
      telegram: restaurant.telegram,
      website: restaurant.website,
      ratingAverage: restaurant.ratingAverage || 0,
      ratingCount: restaurant.ratingCount || 0,
      title: translation?.title || "",
      type: translation?.type || "",
      cuisine: translation?.cuisine || "",
      address: translation?.address || "",
      workingHours: translation?.workingHours || "",
      averageCheck: translation?.averageCheck || "",
      description: translation?.description || "",
      atmosphere: translation?.atmosphere || "",
      mustVisit: translation?.mustVisit || "",
      formatList,
      priceItems,
      topDishes,
      amenityItems,
    };
  }, [restaurant, t]);

  if (isLoading) {
    return (
      <main className="main">
        <section className="restaurant-page">
          <div className="container">
            <div className="restaurant-not-found">
              <p>{t.loading}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="main">
        <section className="restaurant-page">
          <div className="container">
            <div className="restaurant-not-found">
              <h1>{t.error}</h1>
              <Link to={`/${language}/restaurants`} className="back-link">
                {t.back}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!normalizedRestaurant) {
    return (
      <main className="main">
        <section className="restaurant-page">
          <div className="container">
            <div className="restaurant-not-found">
              <h1>{t.notFoundTitle}</h1>
              <p>{t.notFoundText}</p>
              <Link to={`/${language}/restaurants`} className="back-link">
                {t.back}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const {
    title,
    type,
    cuisine,
    address,
    workingHours,
    averageCheck,
    description,
    atmosphere,
    mustVisit,
    formatList,
    amenityItems,
    priceItems,
    topDishes,
    cover,
    phone,
    instagram,
    telegram,
    website,
    mapEmbed,
    ratingAverage,
    ratingCount,
  } = normalizedRestaurant;

  return (
    <>
      <Seo title={title} description={description} />

      <main className="main">
        <section className="restaurant-page">
          <div className="container">
            <div className="restaurant-breadcrumbs">
              <Link to={`/${language}`}>{t.home}</Link>
              <span> / </span>
              <Link to={`/${language}/restaurants`}>{t.back}</Link>
              <span> / </span>
              <span>{title}</span>
            </div>

            <div className="restaurant-hero">
              <div className="restaurant-cover-wrap">
                <img src={cover} alt={title} className="restaurant-cover" />
              </div>

              <div className="restaurant-info">
                <h1>{title}</h1>

                <div className="restaurant-meta">
                  {type && <span className="restaurant-meta-chip">{type}</span>}
                  {cuisine && (
                    <span className="restaurant-meta-chip">{cuisine}</span>
                  )}
                  {averageCheck && (
                    <span className="restaurant-meta-chip">
                      {averageCheck}
                    </span>
                  )}
                </div>

                <div className="restaurant-details">
                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">
                      {t.address}:
                    </span>
                    <span className="restaurant-detail-value">
                      {address || t.noData}
                    </span>
                  </div>

                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">
                      {t.workingHours}:
                    </span>
                    <span className="restaurant-detail-value">
                      {workingHours || t.noData}
                    </span>
                  </div>

                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">
                      {t.phone}:
                    </span>
                    <span className="restaurant-detail-value">
                      {phone || t.noData}
                    </span>
                  </div>

                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">
                      {t.averageRating}:
                    </span>
                    <span className="restaurant-detail-value">
                      {ratingAverage > 0
                        ? `${ratingAverage.toFixed(1)} / 5 (${ratingCount} ${t.votes})`
                        : `0 / 5 (${ratingCount} ${t.votes})`}
                    </span>
                  </div>
                </div>

                <p className="restaurant-description">{description}</p>

                <div className="restaurant-user-rating-row">
                  <span className="restaurant-detail-label">
                    {t.yourRating}
                  </span>

                  <div
                    className="restaurant-user-rating-stars"
                    role="radiogroup"
                    aria-label={t.yourRating}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`restaurant-star-btn ${
                          userRating >= value ? "active" : ""
                        }`}
                        onClick={() => handleUserRating(value)}
                        aria-label={`${t.starsAria} ${value}`}
                        aria-pressed={userRating === value}
                        disabled={isRatingLoading}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="restaurant-sections">
              <div className="restaurant-content-card">
                <h2>{t.prices}</h2>
                <ul className="restaurant-price-list">
                  {priceItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="restaurant-content-card">
                <h2>{t.topDishes}</h2>
                <div className="restaurant-dishes-grid">
                  {topDishes.map((dish, index) => (
                    <div className="restaurant-dish-card" key={index}>
                      <img src={dish.image} alt={dish.title} />
                      <span>{dish.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="restaurant-content-card">
                <h2>{t.format}</h2>
                <div className="restaurant-tags">
                  {formatList.map((item, index) => (
                    <span key={index} className="restaurant-tag">
                      {item}
                    </span>
                  ))}
                </div>

                <h2 className="restaurant-subtitle">{t.atmosphere}</h2>
                <p className="restaurant-text">{atmosphere || t.noData}</p>
              </div>

              <div className="restaurant-content-card">
                <h2>{t.amenities}</h2>
                <div className="restaurant-tags">
                  {amenityItems.map((item, index) => (
                    <span key={index} className="restaurant-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="restaurant-highlight-card">
                <h2>{t.mustVisit}</h2>
                <p>{mustVisit || t.noData}</p>
              </div>

              <div className="restaurant-content-card">
                <h2>{t.contacts}</h2>
                <div className="restaurant-social-links">
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="restaurant-social-link"
                    >
                      {t.instagram}
                    </a>
                  )}

                  {telegram && (
                    <a
                      href={telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="restaurant-social-link"
                    >
                      {t.telegram}
                    </a>
                  )}

                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="restaurant-social-link"
                    >
                      {t.phoneContact}
                    </a>
                  )}

                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="restaurant-social-link"
                    >
                      {t.website}
                    </a>
                  )}
                </div>
              </div>

              <AdBlock />

              {mapEmbed && (
                <div className="restaurant-content-card restaurant-map-card">
                  <h2>{t.map}</h2>
                  <div className="restaurant-map-wrap">
                    <iframe
                      src={mapEmbed}
                      title={`${title} map`}
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default RestaurantPage;