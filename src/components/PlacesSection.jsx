import { Link } from "react-router-dom";
import { placesEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";

function PlacesSection() {
  const { language } = useLanguage();

  const uiText = {
    ru: {
      title: "Интересные места",
      more: "Смотреть все места",
      open: "Открыть место",
    },
    uz: {
      title: "Qiziqarli joylar",
      more: "Barcha joylarni ko‘rish",
      open: "Joyni ochish",
    },
  };

  const t = uiText[language] || uiText.ru;

  if (!placesEvents?.length) return null;

  return (
    <section className="places-section">
      <div className="container">
        <div className="places-header">
          <h2>{t.title}</h2>

          <Link to={`/${language}/places`} className="places-more">
            {t.more}
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="places-grid">
          {placesEvents.map((place) => {
            const title = getLocalizedValue(place.title, language);
            const subtitle = getLocalizedValue(place.subtitle, language);
            const location = getLocalizedValue(place.location, language);
            const category = getLocalizedValue(place.categoryLabel, language);

            return (
              <article key={place.id} className="places-card">
                <Link
                  to={`/${language}/places/${place.slug}`}
                  className="places-card-link"
                  aria-label={`${t.open}: ${title}`}
                >
                  <div className="places-card-image-wrap">
                    <img
                      src={place.image}
                      alt={title}
                      className="places-card-image"
                    />
                    {category && (
                      <span className="places-card-badge">{category}</span>
                    )}
                  </div>

                  <div className="places-card-body">
                    <h3>{title}</h3>

                    <div className="places-card-meta">
                      {subtitle && (
                        <span className="places-card-subtitle">
                          {subtitle}
                        </span>
                      )}
                      {location && (
                        <span className="places-card-location">
                          {location}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PlacesSection;