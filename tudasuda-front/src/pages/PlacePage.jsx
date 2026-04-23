import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";
import AdBlock from "../components/AdBlock";

const API_BASE_URL = "";

function getBrowserToken() {
  const storageKey = "place-browser-token";
  const existing = localStorage.getItem(storageKey);

  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `browser_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(storageKey, generated);
  return generated;
}

function PlacePage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const [browserToken, setBrowserToken] = useState("");
  const [userRating, setUserRating] = useState(0);

  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isRatingLoading, setIsRatingLoading] = useState(false);

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
      loading: "Загрузка места...",
      error: "Не удалось загрузить место.",
      averageRating: "Средняя оценка",
      votes: "голосов",
      ratingError: "Не удалось сохранить оценку.",
      noData: "Уточняется",
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

    async function loadPlace() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/places/${slug}?lang=${language}&browserToken=${encodeURIComponent(browserToken)}`
        );

        if (response.status === 404) {
          setPlace(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load place");
        }

        const data = await response.json();
        setPlace(data);
        setUserRating(data.userRating || 0);
      } catch (error) {
        console.error("LOAD PLACE ERROR:", error);
        setLoadError(t.error);
        setPlace(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlace();
  }, [slug, language, browserToken, t.error]);

  const handleUserRating = async (value) => {
    if (!place?.id || !browserToken || isRatingLoading) return;

    try {
      setIsRatingLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/places/${place.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          browserToken,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save rating");
      }

      const data = await response.json();

      setUserRating(data.userRating || value);
      setPlace((prev) =>
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
      console.error("RATE PLACE ERROR:", error);
      alert(t.ratingError);
    } finally {
      setIsRatingLoading(false);
    }
  };

  const normalizedPlace = useMemo(() => {
    if (!place) return null;

    const translation = place.translations?.[0] || null;

    const suitableForList =
      place.suitableFor?.map((item) => item.value).filter(Boolean) || [];

    const priceItems =
      place.prices?.map((item) => item.value).filter(Boolean) || [];

    const highlights =
      place.highlights?.map((item) => ({
        image: item.image,
        title: item.title,
      })) || [];

    const amenityItems = [
      place.parking ? t.parking : null,
      place.wifi ? t.wifi : null,
      place.booking ? t.booking : null,
      place.family ? t.family : null,
      place.terrace ? t.terrace : null,
      place.photoZone ? t.photoZone : null,
    ].filter(Boolean);

    return {
      id: place.id,
      slug: place.slug,
      cover: place.coverImage,
      mapEmbed: place.mapEmbed,
      phone: place.phone,
      instagram: place.instagram,
      telegram: place.telegram,
      website: place.website,
      ratingAverage: place.ratingAverage || 0,
      ratingCount: place.ratingCount || 0,
      title: translation?.title || "",
      type: translation?.type || "",
      category: translation?.category || "",
      address: translation?.address || "",
      workingHours: translation?.workingHours || "",
      priceLabel: translation?.priceLabel || "",
      description: translation?.description || "",
      features: translation?.features || "",
      mustVisit: translation?.mustVisit || "",
      suitableForList,
      priceItems,
      highlights,
      amenityItems,
    };
  }, [place, t]);

  if (isLoading) {
    return (
      <main className="main">
        <section className="place-page">
          <div className="container">
            <div className="place-not-found">
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
        <section className="place-page">
          <div className="container">
            <div className="place-not-found">
              <h1>{t.error}</h1>
              <Link to={`/${language}/places`} className="back-link">
                {t.back}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!normalizedPlace) {
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

  const {
    title,
    type,
    category,
    address,
    workingHours,
    priceLabel,
    description,
    features,
    mustVisit,
    suitableForList,
    amenityItems,
    priceItems,
    highlights,
    cover,
    phone,
    instagram,
    telegram,
    website,
    mapEmbed,
    ratingAverage,
    ratingCount,
  } = normalizedPlace;

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
                <img src={cover} alt={title} className="place-cover" />
              </div>

              <div className="place-info">
                <h1>{title}</h1>

                <div className="place-meta">
                  {type && <span className="place-meta-chip">{type}</span>}
                  {category && <span className="place-meta-chip">{category}</span>}
                  {priceLabel && (
                    <span className="place-meta-chip">{priceLabel}</span>
                  )}
                </div>

                <div className="place-details">
                  <div className="place-detail-row">
                    <span className="place-detail-label">{t.address}:</span>
                    <span className="place-detail-value">
                      {address || t.noData}
                    </span>
                  </div>

                  <div className="place-detail-row">
                    <span className="place-detail-label">
                      {t.workingHours}:
                    </span>
                    <span className="place-detail-value">
                      {workingHours || t.noData}
                    </span>
                  </div>

                  {phone && (
                    <div className="place-detail-row">
                      <span className="place-detail-label">{t.phone}:</span>
                      <span className="place-detail-value">{phone}</span>
                    </div>
                  )}

                  <div className="place-detail-row">
                    <span className="place-detail-label">
                      {t.averageRating}:
                    </span>
                    <span className="place-detail-value">
                      {ratingAverage > 0
                        ? `${ratingAverage.toFixed(1)} / 5 (${ratingCount} ${t.votes})`
                        : `0 / 5 (${ratingCount} ${t.votes})`}
                    </span>
                  </div>
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
                        disabled={isRatingLoading}
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
                  {priceItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="place-content-card">
                <h2>{t.highlights}</h2>
                <div className="place-highlights-grid">
                  {highlights.map((item, index) => (
                    <div className="place-highlight-item" key={index}>
                      <img src={item.image} alt={item.title} />
                      <span>{item.title}</span>
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
                <p className="place-text">{features || t.noData}</p>
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
                <p>{mustVisit || t.noData}</p>
              </div>

              <div className="place-content-card">
                <h2>{t.contacts}</h2>
                <div className="place-social-links">
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="place-social-link"
                    >
                      {t.instagram}
                    </a>
                  )}

                  {telegram && (
                    <a
                      href={telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="place-social-link"
                    >
                      {t.telegram}
                    </a>
                  )}

                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="place-social-link"
                    >
                      {t.website}
                    </a>
                  )}
                </div>
              </div>

              <AdBlock />

              {mapEmbed && (
                <div className="place-content-card place-map-card">
                  <h2>{t.map}</h2>
                  <div className="place-map-wrap">
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

export default PlacePage;