import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import AdBlock from "../components/AdBlock";
import Seo from "../components/Seo";

const API_BASE_URL = "";

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

function normalizeTextContent(value) {
  if (!value || typeof value !== "string") return [];

  return value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractMapSrc(mapEmbed) {
  if (!mapEmbed || typeof mapEmbed !== "string") return "";

  const trimmed = mapEmbed.trim();

  if (!trimmed) return "";

  if (trimmed.startsWith("<iframe")) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    return match?.[1] || "";
  }

  return trimmed;
}

function getCategoryLabel(event, t) {
  if (event.isForKids) return t.kids;

  switch (event.type) {
    case "concert":
      return t.concert;
    case "theatre":
      return t.theatre;
    case "exhibition":
      return t.exhibition;
    case "festival":
      return t.festival;
    case "standup":
      return t.standup;
    case "masterclass":
      return t.masterclass;
    case "kids":
      return t.kids;
    default:
      return t.all;
  }
}

function EventPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

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
      ticketModalClose: "Закрыть",
      program: "Что ждет гостей",
      importantInfo: "Важно знать",
      map: "Локация",
      loading: "Загрузка события...",
      error: "Не удалось загрузить событие.",
      concert: "Концерты",
      theatre: "Спектакли",
      exhibition: "Выставки",
      festival: "Фестивали",
      standup: "Стендап",
      masterclass: "Мастер-классы",
      kids: "Для детей",
      all: "Событие",
      noDate: "Уточняется",
      noTime: "Уточняется",
      noVenue: "Уточняется",
      noAddress: "Уточняется",
      noDuration: "Уточняется",
      noAge: "Уточняется",
      noPrice: "Уточняется",
      noDescription: "Описание скоро появится.",
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
      ticketModalClose: "Yopish",
      program: "Dastur",
      importantInfo: "Muhim ma’lumot",
      map: "Xaritadagi joylashuv",
      loading: "Tadbir yuklanmoqda...",
      error: "Tadbirni yuklab bo‘lmadi.",
      concert: "Konsertlar",
      theatre: "Spektakllar",
      exhibition: "Ko‘rgazmalar",
      festival: "Festivallar",
      standup: "Stendap",
      masterclass: "Master-klasslar",
      kids: "Bolalar uchun",
      all: "Tadbir",
      noDate: "Aniqlanmoqda",
      noTime: "Aniqlanmoqda",
      noVenue: "Aniqlanmoqda",
      noAddress: "Aniqlanmoqda",
      noDuration: "Aniqlanmoqda",
      noAge: "Aniqlanmoqda",
      noPrice: "Aniqlanmoqda",
      noDescription: "Tavsif tez orada qo‘shiladi.",
    },
  };

  const t = uiText[language] || uiText.ru;
  const errorText =
    language === "uz"
      ? "Tadbirni yuklab bo‘lmadi."
      : "Не удалось загрузить событие.";

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
        setLoadError(errorText);
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [slug, language, errorText]);

  useEffect(() => {
    if (!isTicketModalOpen) return;

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setIsTicketModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    };
  }, [isTicketModalOpen]);

  const normalizedEvent = useMemo(() => {
    if (!event) return null;

    const translation = event.translations?.[0] || null;
    const sessions = Array.isArray(event.sessions) ? event.sessions : [];
    const firstSession = sessions[0] || null;

    return {
      slug: event.slug,
      cover: event.coverImage || event.posterImage || "",
      poster: event.posterImage || "",
      ticketUrl: firstSession?.ticketUrl || event.ticketUrl || "",
      mapSrc: extractMapSrc(event.mapEmbed),
      title: translation?.title || "",
      subtitle: translation?.subtitle || "",
      description: translation?.description || "",
      descriptionParagraphs: normalizeTextContent(translation?.description),
      shortDescription: translation?.shortDescription || "",
      categoryLabel: getCategoryLabel(event, t),
      venue: translation?.venue || "",
      address: translation?.address || "",
      duration: translation?.duration || "",
      ageLimit: translation?.ageLimit || "",
      ticketPrice: translation?.ticketPrice || firstSession?.price || "",
      sessions,
      gallery:
        event.galleryItems?.map((item) => item.image).filter(Boolean) || [],
      program:
        event.programItems?.map((item) => item.value).filter(Boolean) || [],
      importantInfo:
        event.importantInfoItems?.map((item) => item.value).filter(Boolean) ||
        [],
      seoTitle: translation?.seoTitle || translation?.title || "",
      seoDescription:
        translation?.seoDescription ||
        translation?.shortDescription ||
        translation?.description ||
        "",
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
              <h1>{loadError}</h1>
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
    subtitle,
    description,
    descriptionParagraphs,
    shortDescription,
    categoryLabel,
    venue,
    address,
    duration,
    ageLimit,
    ticketPrice,
    cover,
    gallery,
    program,
    importantInfo,
    mapSrc,
    ticketUrl,
    sessions,
    seoTitle,
    seoDescription,
  } = normalizedEvent;

  return (
    <>
      <Seo
        title={seoTitle || title}
        description={seoDescription || shortDescription || title}
        image={cover}
      />

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
                {cover ? (
                  <img src={cover} alt={title} className="event-cover" />
                ) : null}
              </div>

              <div className="event-info">
                <div className="event-type-chip">{categoryLabel}</div>

                <h1>{title}</h1>

                {subtitle ? <p className="event-subtitle">{subtitle}</p> : null}

                {shortDescription ? (
                  <p className="event-description">{shortDescription}</p>
                ) : description ? (
                  <p className="event-description">{description}</p>
                ) : null}

                <div className="event-meta-grid">
                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.date}</span>
                    <span className="event-meta-value">
                      {sessions[0]?.startAt
                        ? formatDate(sessions[0].startAt, language)
                        : t.noDate}
                    </span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.time}</span>
                    <span className="event-meta-value">
                      {sessions[0]?.startAt
                        ? formatTime(sessions[0].startAt, language)
                        : t.noTime}
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
                      {address || t.noAddress}
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

                  {ticketUrl ? (
                    <button
                      type="button"
                      className="event-buy-btn"
                      onClick={() => setIsTicketModalOpen(true)}
                    >
                      {t.buyTickets}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {gallery?.length > 0 ? (
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
            ) : null}

            <div className="event-sections">
              <div className="event-content-card">
                <h2>{t.about}</h2>

                {descriptionParagraphs.length ? (
                  <div className="event-text-content">
                    {descriptionParagraphs.map((paragraph, index) => (
                      <p className="event-text" key={index}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : description ? (
                  <p className="event-text">{description}</p>
                ) : shortDescription ? (
                  <p className="event-text">{shortDescription}</p>
                ) : (
                  <p className="event-text">{t.noDescription}</p>
                )}
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

              {mapSrc ? (
                <div className="event-content-card event-map-card">
                  <h2>{t.map}</h2>
                  <div className="event-map-wrap">
                    <iframe
                      src={mapSrc}
                      title={`${title} map`}
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      {isTicketModalOpen ? (
        <div
          className="ticket-modal-backdrop"
          onClick={() => setIsTicketModalOpen(false)}
        >
          <div
            className="ticket-iframe-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="ticket-modal-close"
              onClick={() => setIsTicketModalOpen(false)}
              aria-label={t.ticketModalClose}
            >
              ✕
            </button>

            <iframe
              src={ticketUrl}
              title={t.buyTickets}
              className="ticket-modal-iframe"
              loading="lazy"
              allow="payment; clipboard-write; web-share"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default EventPage;