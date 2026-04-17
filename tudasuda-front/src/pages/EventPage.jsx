import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import AdBlock from "../components/AdBlock";
import Seo from "../components/Seo";

const API_BASE_URL = "http://localhost:4000";

function formatDate(dateString, language) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(dateString, language) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function EventPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const uiText = {
    ru: {
      home: "Главная",
      back: "Афиша",
      notFoundTitle: "Событие не найдено",
      notFoundText: "Похоже, такого события пока нет в каталоге.",
      about: "О событии",
      gallery: "Фотогалерея",
      date: "Дата",
      time: "Время",
      venue: "Площадка",
      address: "Адрес",
      duration: "Длительность",
      ageLimit: "Возраст",
      tickets: "Билеты",
      buyTickets: "Купить билеты",
      program: "Что ждет гостей",
      importantInfo: "Важно знать",
      map: "Локация",
      loading: "Загрузка события...",
      error: "Не удалось загрузить событие.",
      concert: "Концерты",
      theatre: "Спектакли",
      exhibition: "Выставки",
      kids: "Для детей",
      all: "Событие",
      noDate: "Уточняется",
      noTime: "Уточняется",
      noVenue: "Уточняется",
      noDuration: "Уточняется",
      noAge: "Уточняется",
      noPrice: "Уточняется",
    },
    uz: {
      home: "Bosh sahifa",
      back: "Afisha",
      notFoundTitle: "Tadbir topilmadi",
      notFoundText: "Aftidan, bunday tadbir hozircha katalogda yo‘q.",
      about: "Tadbir haqida",
      gallery: "Fotogalereya",
      date: "Sana",
      time: "Vaqt",
      venue: "Maydon",
      address: "Manzil",
      duration: "Davomiyligi",
      ageLimit: "Yosh",
      tickets: "Chiptalar",
      buyTickets: "Chipta sotib olish",
      program: "Dastur",
      importantInfo: "Muhim ma’lumot",
      map: "Xaritadagi joylashuv",
      loading: "Tadbir yuklanmoqda...",
      error: "Tadbirni yuklab bo‘lmadi.",
      concert: "Konsertlar",
      theatre: "Spektakllar",
      exhibition: "Ko‘rgazmalar",
      kids: "Bolalar uchun",
      all: "Tadbir",
      noDate: "Aniqlanmoqda",
      noTime: "Aniqlanmoqda",
      noVenue: "Aniqlanmoqda",
      noDuration: "Aniqlanmoqda",
      noAge: "Aniqlanmoqda",
      noPrice: "Aniqlanmoqda",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadEvent() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/events/${slug}?lang=${language}`
        );

        if (response.status === 404) {
          setEvent(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load event");
        }

        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("LOAD EVENT ERROR:", error);
        setLoadError(t.error);
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [slug, language, t.error]);

  const normalizedEvent = useMemo(() => {
    if (!event) return null;

    const translation = event.translations?.[0] || null;
    const firstSession = event.sessions?.[0] || null;

    const categoryLabel = event.isForKids
      ? t.kids
      : event.type === "concert"
      ? t.concert
      : event.type === "theatre"
      ? t.theatre
      : event.type === "exhibition"
      ? t.exhibition
      : t.all;

    return {
      slug: event.slug,
      cover: event.coverImage,
      ticketUrl: firstSession?.ticketUrl || event.ticketUrl,
      mapEmbed: event.mapEmbed,
      title: translation?.title || "",
      description: translation?.description || "",
      shortDescription: translation?.shortDescription || "",
      categoryLabel,
      venue: translation?.venue || "",
      address: translation?.address || "",
      date: firstSession?.startAt || null,
      time: firstSession?.startAt || null,
      duration: translation?.duration || "",
      ageLimit: translation?.ageLimit || "",
      ticketPrice: translation?.ticketPrice || firstSession?.price || "",
      gallery:
        event.galleryItems?.map((item) => item.image).filter(Boolean) || [],
      program:
        event.programItems?.map((item) => item.value).filter(Boolean) || [],
      importantInfo:
        event.importantInfoItems?.map((item) => item.value).filter(Boolean) ||
        [],
    };
  }, [event, t]);

  if (isLoading) {
    return (
      <main className="main">
        <section className="event-page">
          <div className="container">
            <div className="event-not-found">
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
        <section className="event-page">
          <div className="container">
            <div className="event-not-found">
              <h1>{t.error}</h1>
              <Link to={`/${language}/events`} className="back-link">
                {t.back}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!normalizedEvent) {
    return (
      <main className="main">
        <section className="event-page">
          <div className="container">
            <div className="event-not-found">
              <h1>{t.notFoundTitle}</h1>
              <p>{t.notFoundText}</p>
              <Link to={`/${language}/events`} className="back-link">
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
    description,
    categoryLabel,
    venue,
    address,
    date,
    time,
    duration,
    ageLimit,
    ticketPrice,
    cover,
    gallery,
    program,
    importantInfo,
    mapEmbed,
    ticketUrl,
  } = normalizedEvent;

  return (
    <>
      <Seo title={title} description={description} image={cover} />

      <main className="main">
        <section className="event-page">
          <div className="container">
            <div className="event-breadcrumbs">
              <Link to={`/${language}`}>{t.home}</Link>
              <span> / </span>
              <Link to={`/${language}/events`}>{t.back}</Link>
              <span> / </span>
              <span>{title}</span>
            </div>

            <div className="event-hero">
              <div className="event-cover-wrap">
                <img src={cover} alt={title} className="event-cover" />
              </div>

              <div className="event-info">
                <div className="event-type-chip">{categoryLabel}</div>

                <h1>{title}</h1>

                <p className="event-description">{description}</p>

                <div className="event-meta-grid">
                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.date}</span>
                    <span className="event-meta-value">
                      {date ? formatDate(date, language) : t.noDate}
                    </span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.time}</span>
                    <span className="event-meta-value">
                      {time ? formatTime(time, language) : t.noTime}
                    </span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.venue}</span>
                    <span className="event-meta-value">
                      {venue || t.noVenue}
                    </span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.address}</span>
                    <span className="event-meta-value">
                      {address || t.noVenue}
                    </span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.duration}</span>
                    <span className="event-meta-value">
                      {duration || t.noDuration}
                    </span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.ageLimit}</span>
                    <span className="event-meta-value">
                      {ageLimit || t.noAge}
                    </span>
                  </div>
                </div>

                <div className="event-ticket-box">
                  <div className="event-ticket-info">
                    <span className="event-ticket-label">{t.tickets}</span>
                    <span className="event-ticket-price">
                      {ticketPrice || t.noPrice}
                    </span>
                  </div>

                  {ticketUrl && (
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-buy-btn"
                    >
                      {t.buyTickets}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {gallery?.length > 0 && (
              <div className="event-content-card">
                <h2>{t.gallery}</h2>
                <div className="event-gallery-grid">
                  {gallery.map((image, index) => (
                    <div className="event-gallery-item" key={index}>
                      <img src={image} alt={`${title} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="event-sections">
              <div className="event-content-card">
                <h2>{t.about}</h2>
                <p className="event-text">{description}</p>
              </div>

              {!!program?.length && (
                <div className="event-content-card">
                  <h2>{t.program}</h2>
                  <ul className="event-list">
                    {program.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!!importantInfo?.length && (
                <div className="event-content-card">
                  <h2>{t.importantInfo}</h2>
                  <ul className="event-list">
                    {importantInfo.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <AdBlock />

              {mapEmbed && (
                <div className="event-content-card event-map-card">
                  <h2>{t.map}</h2>
                  <div className="event-map-wrap">
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

export default EventPage;