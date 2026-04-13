import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { restaurantsData } from "../data/restaurantsData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

/*
  LOCAL STORAGE РЕЙТИНГ
*/

function getLocalRestaurantRating(slug) {
  if (!slug) return 0;

  const saved = localStorage.getItem(`restaurant-rating-${slug}`);
  return saved ? Number(saved) : 0;
}

function saveLocalRestaurantRating(slug, value) {
  if (!slug) return;
  localStorage.setItem(`restaurant-rating-${slug}`, String(value));
}

function RestaurantPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const [userRating, setUserRating] = useState(() =>
    getLocalRestaurantRating(slug)
  );

  const restaurant = restaurantsData.find((item) => item.slug === slug);

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
      socials: "Соцсети",
      prices: "Примеры цен",
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
      parking: "Парковка",
      wifi: "Wi-Fi",
      booking: "Бронь",
      delivery: "Доставка",
      smoking: "Курение",
      terrace: "Терраса",
      music: "Музыка",
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
      socials: "Ijtimoiy tarmoqlar",
      prices: "Narxlar misollari",
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
      parking: "Avtoturargoh",
      wifi: "Wi-Fi",
      booking: "Bron",
      delivery: "Yetkazib berish",
      smoking: "Chekish",
      terrace: "Terrasa",
      music: "Musiqa",
    },
  };

  const t = uiText[language] || uiText.ru;

  const handleUserRating = (value) => {
    setUserRating(value);
    saveLocalRestaurantRating(slug, value);
  };

  if (!restaurant) {
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

  const title = getLocalizedValue(restaurant.title, language);
  const type = getLocalizedValue(restaurant.type, language);
  const cuisine = getLocalizedValue(restaurant.cuisine, language);
  const address = getLocalizedValue(restaurant.address, language);
  const workingHours = getLocalizedValue(restaurant.workingHours, language);
  const averageCheck = getLocalizedValue(restaurant.averageCheck, language);
  const description = getLocalizedValue(restaurant.description, language);
  const atmosphere = getLocalizedValue(restaurant.atmosphere, language);
  const mustVisit = getLocalizedValue(restaurant.mustVisit, language);

  const formatList =
    restaurant.format?.[language] || restaurant.format?.ru || [];

  const amenityItems = [
    restaurant.amenities?.parking ? t.parking : null,
    restaurant.amenities?.wifi ? t.wifi : null,
    restaurant.amenities?.booking ? t.booking : null,
    restaurant.amenities?.delivery ? t.delivery : null,
    restaurant.amenities?.smoking ? t.smoking : null,
    restaurant.extras?.terrace ? t.terrace : null,
    restaurant.extras?.music ? t.music : null,
  ].filter(Boolean);

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
                <img
                  src={restaurant.cover}
                  alt={title}
                  className="restaurant-cover"
                />
              </div>

              <div className="restaurant-info">
                <h1>{title}</h1>

                <div className="restaurant-meta">
                  <span className="restaurant-meta-chip">{type}</span>
                  <span className="restaurant-meta-chip">{cuisine}</span>
                  <span className="restaurant-meta-chip">{averageCheck}</span>
                </div>

                <div className="restaurant-details">
                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">
                      {t.address}:
                    </span>
                    <span className="restaurant-detail-value">{address}</span>
                  </div>

                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">
                      {t.workingHours}:
                    </span>
                    <span className="restaurant-detail-value">
                      {workingHours}
                    </span>
                  </div>

                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">
                      {t.phone}:
                    </span>
                    <span className="restaurant-detail-value">
                      {restaurant.phone}
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
                  {restaurant.prices?.map((item, index) => (
                    <li key={index}>{getLocalizedValue(item, language)}</li>
                  ))}
                </ul>
              </div>

              <div className="restaurant-content-card">
                <h2>{t.topDishes}</h2>
                <div className="restaurant-dishes-grid">
                  {restaurant.topDishes?.map((dish, index) => (
                    <div className="restaurant-dish-card" key={index}>
                      <img
                        src={dish.image}
                        alt={getLocalizedValue(dish.title, language)}
                      />
                      <span>{getLocalizedValue(dish.title, language)}</span>
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
                <p className="restaurant-text">{atmosphere}</p>
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
                <p>{mustVisit}</p>
              </div>

              <div className="restaurant-content-card">
                <h2>{t.socials}</h2>
                <div className="restaurant-social-links">
                  {restaurant.socials?.instagram && (
                    <a
                      href={restaurant.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="restaurant-social-link"
                    >
                      {t.instagram}
                    </a>
                  )}

                  {restaurant.socials?.telegram && (
                    <a
                      href={restaurant.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="restaurant-social-link"
                    >
                      {t.telegram}
                    </a>
                  )}
                </div>
              </div>

              <div className="restaurant-content-card restaurant-map-card">
                <h2>{t.map}</h2>
                <div className="restaurant-map-wrap">
                  <iframe
                    src={restaurant.mapEmbed}
                    title={`${title} map`}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default RestaurantPage;