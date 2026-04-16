import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { placesData } from "../data/placesData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

function getLocalPlaceRating(slug) {
  if (!slug) return 0;

  const saved = localStorage.getItem(`place-rating-${slug}`);
  return saved ? Number(saved) : 0;
}

function saveLocalPlaceRating(slug, value) {
  if (!slug) return;
  localStorage.setItem(`place-rating-${slug}`, String(value));
}

function PlacePage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const [userRating, setUserRating] = useState(() =>
    getLocalPlaceRating(slug)
  );

  const place = placesData.find((item) => item.slug === slug);

  const uiText = {
    ru: {
      home: "Главная",
      back: "Места",
      notFoundTitle: "Место не найдено",
      notFoundText: "Похоже, такого места пока нет в каталоге.",
      type: "Формат",
      category: "Категория",
      averageCheck: "Цены",
      address: "Адрес",
      workingHours: "Режим работы",
      phone: "Телефон",
      contacts: "Контакты",
      prices: "Цены",
      highlights: "Самое интересное здесь",
      suitableFor: "Подойдёт для",
      features: "Что здесь особенно",
      amenities: "Удобства",
      mustVisit: "Зачем сюда идти",
      yourRating: "Оцените место:",
      starsAria: "Поставить оценку",
      map: "Локация на карте",
      instagram: "Instagram",
      telegram: "Telegram",
      website: "Сайт",
      parking: "Парковка",
      wifi: "Wi-Fi",
      booking: "Бронь",
      family: "С детьми",
      terrace: "Открытая зона",
      photoZone: "Фото-зоны",
    },
    uz: {
      home: "Bosh sahifa",
      back: "Joylar",
      notFoundTitle: "Joy topilmadi",
      notFoundText: "Aftidan, bunday joy hozircha katalogda yo‘q.",
      type: "Format",
      category: "Kategoriya",
      averageCheck: "Narxlar",
      address: "Manzil",
      workingHours: "Ish vaqti",
      phone: "Telefon",
      contacts: "Kontaktlar",
      prices: "Narxlar",
      highlights: "Bu yerda eng qiziq narsa",
      suitableFor: "Kimlar uchun mos",
      features: "Bu yerda nimasi alohida",
      amenities: "Qulayliklar",
      mustVisit: "Nega bu yerga kelish kerak",
      yourRating: "Joyni baholang:",
      starsAria: "Baho qo‘yish",
      map: "Xaritadagi joylashuv",
      instagram: "Instagram",
      telegram: "Telegram",
      website: "Sayt",
      parking: "Avtoturargoh",
      wifi: "Wi-Fi",
      booking: "Bron",
      family: "Bolalar bilan",
      terrace: "Ochiq hudud",
      photoZone: "Fotozonalar",
    },
  };

  const t = uiText[language] || uiText.ru;

  const handleUserRating = (value) => {
    setUserRating(value);
    saveLocalPlaceRating(slug, value);
  };

  if (!place) {
    return (
      <main className="main">
        <section className="place-page">
          <div className="container">
            <div className="place-not-found">
              <h1>{t.notFoundTitle}</h1>
              <p>{t.notFoundText}</p>
              <Link to={`/${language}/places`} className="back-link">
                {t.back}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const title = getLocalizedValue(place.title, language);
  const type = getLocalizedValue(place.type, language);
  const category = getLocalizedValue(place.category, language);
  const address = getLocalizedValue(place.address, language);
  const workingHours = getLocalizedValue(place.workingHours, language);
  const priceLabel = getLocalizedValue(place.priceLabel, language);
  const description = getLocalizedValue(place.description, language);
  const features = getLocalizedValue(place.features, language);
  const mustVisit = getLocalizedValue(place.mustVisit, language);

  const suitableForList =
    place.suitableFor?.[language] || place.suitableFor?.ru || [];

  const amenityItems = [
    place.amenities?.parking ? t.parking : null,
    place.amenities?.wifi ? t.wifi : null,
    place.amenities?.booking ? t.booking : null,
    place.amenities?.family ? t.family : null,
    place.extras?.terrace ? t.terrace : null,
    place.extras?.photoZone ? t.photoZone : null,
  ].filter(Boolean);

  return (
    <>
      <Seo title={title} description={description} />

      <main className="main">
        <section className="place-page">
          <div className="container">
            <div className="place-breadcrumbs">
              <Link to={`/${language}`}>{t.home}</Link>
              <span> / </span>
              <Link to={`/${language}/places`}>{t.back}</Link>
              <span> / </span>
              <span>{title}</span>
            </div>

            <div className="place-hero">
              <div className="place-cover-wrap">
                <img src={place.cover} alt={title} className="place-cover" />
              </div>

              <div className="place-info">
                <h1>{title}</h1>

                <div className="place-meta">
                  <span className="place-meta-chip">{type}</span>
                  <span className="place-meta-chip">{category}</span>
                  <span className="place-meta-chip">{priceLabel}</span>
                </div>

                <div className="place-details">
                  <div className="place-detail-row">
                    <span className="place-detail-label">{t.address}:</span>
                    <span className="place-detail-value">{address}</span>
                  </div>

                  <div className="place-detail-row">
                    <span className="place-detail-label">
                      {t.workingHours}:
                    </span>
                    <span className="place-detail-value">{workingHours}</span>
                  </div>

                  {place.phone && (
                    <div className="place-detail-row">
                      <span className="place-detail-label">{t.phone}:</span>
                      <span className="place-detail-value">{place.phone}</span>
                    </div>
                  )}
                </div>

                <p className="place-description">{description}</p>

                <div className="place-user-rating-row">
                  <span className="place-detail-label">{t.yourRating}</span>

                  <div
                    className="place-user-rating-stars"
                    role="radiogroup"
                    aria-label={t.yourRating}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`place-star-btn ${
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

            <div className="place-sections">
              <div className="place-content-card">
                <h2>{t.prices}</h2>
                <ul className="place-price-list">
                  {place.prices?.map((item, index) => (
                    <li key={index}>{getLocalizedValue(item, language)}</li>
                  ))}
                </ul>
              </div>

              <div className="place-content-card">
                <h2>{t.highlights}</h2>
                <div className="place-highlights-grid">
                  {place.highlights?.map((item, index) => (
                    <div className="place-highlight-item" key={index}>
                      <img
                        src={item.image}
                        alt={getLocalizedValue(item.title, language)}
                      />
                      <span>{getLocalizedValue(item.title, language)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="place-content-card">
                <h2>{t.suitableFor}</h2>
                <div className="place-tags">
                  {suitableForList.map((item, index) => (
                    <span key={index} className="place-tag">
                      {item}
                    </span>
                  ))}
                </div>

                <h2 className="place-subtitle">{t.features}</h2>
                <p className="place-text">{features}</p>
              </div>

              <div className="place-content-card">
                <h2>{t.amenities}</h2>
                <div className="place-tags">
                  {amenityItems.map((item, index) => (
                    <span key={index} className="place-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="place-highlight-card">
                <h2>{t.mustVisit}</h2>
                <p>{mustVisit}</p>
              </div>

              <div className="place-content-card">
                <h2>{t.contacts}</h2>
                <div className="place-social-links">
                  {place.contacts?.instagram && (
                    <a
                      href={place.contacts.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="place-social-link"
                    >
                      {t.instagram}
                    </a>
                  )}

                  {place.contacts?.telegram && (
                    <a
                      href={place.contacts.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="place-social-link"
                    >
                      {t.telegram}
                    </a>
                  )}

                  {place.contacts?.website && (
                    <a
                      href={place.contacts.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="place-social-link"
                    >
                      {t.website}
                    </a>
                  )}
                </div>
              </div>

              <div className="place-content-card place-map-card">
                <h2>{t.map}</h2>
                <div className="place-map-wrap">
                  <iframe
                    src={place.mapEmbed}
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

export default PlacePage;