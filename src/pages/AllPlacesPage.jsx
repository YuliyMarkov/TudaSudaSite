import { Link } from "react-router-dom";
import { placesEvents } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

function AllPlacesPage() {
  const { language } = useLanguage();

  const uiText = {
    ru: {
      title: "Все места",
      description:
        "Интересные места Ташкента: парки, прогулочные зоны, пространства для отдыха и досуга.",
      open: "Открыть место",
    },
    uz: {
      title: "Barcha joylar",
      description:
        "Toshkentdagi qiziqarli joylar: bog‘lar, sayr zonalari va dam olish maskanlari.",
      open: "Joyni ochish",
    },
  };

  const t = uiText[language] || uiText.ru;

  return (
    <>
      <Seo title={t.title} description={t.description} />

      <section className="all-places-page">
        <div className="container">
          <div className="all-places-header">
            <h1>{t.title}</h1>
          </div>

          <div className="all-places-grid">
            {placesEvents.map((place) => {
              const title = getLocalizedValue(place.title, language);
              const subtitle = getLocalizedValue(place.subtitle, language);
              const location = getLocalizedValue(place.location, language);
              const category = getLocalizedValue(place.categoryLabel, language);

              return (
                <article key={place.id} className="all-places-card">
                  <Link
                    to={`/${language}/news/${place.slug}`}
                    className="all-places-card-link"
                    aria-label={`${t.open}: ${title}`}
                  >
                    <div className="all-places-card-image-wrap">
                      <img
                        src={place.image}
                        alt={title}
                        className="all-places-card-image"
                      />
                      {category && (
                        <span className="all-places-card-badge">{category}</span>
                      )}
                    </div>

                    <div className="all-places-card-body">
                      <h3>{title}</h3>

                      <div className="all-places-card-meta">
                        {subtitle && (
                          <span className="all-places-card-subtitle">
                            {subtitle}
                          </span>
                        )}
                        {location && (
                          <span className="all-places-card-location">
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
    </>
  );
}

export default AllPlacesPage;