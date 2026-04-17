import { Link, useLocation } from "react-router-dom";
import Seo from "../components/Seo";

function NotFoundPage() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentLang = pathSegments[0] === "uz" ? "uz" : "ru";

  const uiText = {
    ru: {
      title: "Страница не найдена",
      description: "Похоже, эта ссылка больше не работает или ведёт не туда.",
      subtitle:
        "Возможно, событие уже сняли с афиши, материал перенесли или адрес просто изменился.",
      home: "На главную",
      stories: "Новости и статьи",
      cinema: "Кино",
      places: "Места",
      badge: "404",
      eyebrow: "Упс, мимо маршрута",
    },
    uz: {
      title: "Sahifa topilmadi",
      description:
        "Ko‘rinishidan, bu havola endi ishlamaydi yoki noto‘g‘ri joyga olib boradi.",
      subtitle:
        "Ehtimol, tadbir afishadan olib tashlangan, material boshqa joyga ko‘chirilgan yoki manzil o‘zgargan.",
      home: "Bosh sahifaga",
      stories: "Yangiliklar va maqolalar",
      cinema: "Kino",
      places: "Joylar",
      badge: "404",
      eyebrow: "Ups, yo‘nalishdan chiqib ketildi",
    },
  };

  const t = uiText[currentLang];

  return (
    <>
      <Seo title={`${t.badge} — ${t.title}`} description={t.description} />

      <main className="not-found-page">
        <div className="container">
          <section className="not-found-hero">
            <div
              className="not-found-glow not-found-glow-left"
              aria-hidden="true"
            />
            <div
              className="not-found-glow not-found-glow-right"
              aria-hidden="true"
            />

            <div className="not-found-card">
              <div className="not-found-eyebrow">{t.eyebrow}</div>

              <span className="not-found-badge">
                <span className="not-found-badge-text">{t.badge}</span>
              </span>

              <h1>{t.title}</h1>
              <p className="not-found-description">{t.description}</p>
              <p className="not-found-subtitle">{t.subtitle}</p>

              <div className="not-found-actions">
                <Link
                  to={`/${currentLang}`}
                  className="not-found-button primary"
                >
                  {t.home}
                </Link>

                <Link
                  to={`/${currentLang}/stories`}
                  className="not-found-button secondary"
                >
                  {t.stories}
                </Link>
              </div>

              <div className="not-found-quick-links">
                <Link to={`/${currentLang}/cinema`} className="not-found-chip">
                  🎬 {t.cinema}
                </Link>

                <Link to={`/${currentLang}/places`} className="not-found-chip">
                  📍 {t.places}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default NotFoundPage;
