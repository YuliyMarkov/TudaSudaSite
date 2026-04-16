import { Link, useParams } from "react-router-dom";
import { eventsData } from "../data/eventsData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";
import AdBlock from "../components/AdBlock";

function EventPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  const event = eventsData.find((item) => item.slug === slug);

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
      map: "Локация на карте",
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
    },
  };

  const t = uiText[language] || uiText.ru;

  if (!event) {
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

  const title = getLocalizedValue(event.title, language);
  const description = getLocalizedValue(event.description, language);
  const categoryLabel = getLocalizedValue(event.categoryLabel, language);
  const venue = getLocalizedValue(event.venue, language);
  const address = getLocalizedValue(event.address, language);
  const date = getLocalizedValue(event.date, language);
  const time = getLocalizedValue(event.time, language);
  const duration = getLocalizedValue(event.duration, language);
  const ageLimit = getLocalizedValue(event.ageLimit, language);
  const ticketPrice = getLocalizedValue(event.ticketPrice, language);

  return (
    <>
      <Seo title={title} description={description} image={event.cover} />

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
                <img src={event.cover} alt={title} className="event-cover" />
              </div>

              <div className="event-info">
                <div className="event-type-chip">{categoryLabel}</div>

                <h1>{title}</h1>

                <p className="event-description">{description}</p>

                <div className="event-meta-grid">
                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.date}</span>
                    <span className="event-meta-value">{date}</span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.time}</span>
                    <span className="event-meta-value">{time}</span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.venue}</span>
                    <span className="event-meta-value">{venue}</span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.address}</span>
                    <span className="event-meta-value">{address}</span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.duration}</span>
                    <span className="event-meta-value">{duration}</span>
                  </div>

                  <div className="event-meta-card">
                    <span className="event-meta-label">{t.ageLimit}</span>
                    <span className="event-meta-value">{ageLimit}</span>
                  </div>
                </div>

                <div className="event-ticket-box">
                  <div className="event-ticket-info">
                    <span className="event-ticket-label">{t.tickets}</span>
                    <span className="event-ticket-price">{ticketPrice}</span>
                  </div>

                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-buy-btn"
                  >
                    {t.buyTickets}
                  </a>
                </div>
              </div>
            </div>

            {event.gallery?.length > 0 && (
              <div className="event-content-card">
                <h2>{t.gallery}</h2>
                <div className="event-gallery-grid">
                  {event.gallery.map((image, index) => (
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

              {!!event.program?.length && (
                <div className="event-content-card">
                  <h2>{t.program}</h2>
                  <ul className="event-list">
                    {event.program.map((item, index) => (
                      <li key={index}>{getLocalizedValue(item, language)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!!event.importantInfo?.length && (
                <div className="event-content-card">
                  <h2>{t.importantInfo}</h2>
                  <ul className="event-list">
                    {event.importantInfo.map((item, index) => (
                      <li key={index}>{getLocalizedValue(item, language)}</li>
                    ))}
                  </ul>
                </div>
              )}

              <AdBlock />

              <div className="event-content-card event-map-card">
                <h2>{t.map}</h2>
                <div className="event-map-wrap">
                  <iframe
                    src={event.mapEmbed}
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

export default EventPage;