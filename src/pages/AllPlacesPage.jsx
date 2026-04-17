import { Link } from "react-router-dom";
import { placesData } from "../data/placesData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";
import AdBlock from "../components/AdBlock";

function AllPlacesPage() {
  const { language } = useLanguage();

  const uiText = {
    ru: {
      title: "Все места",
      description:
        "Интересные места Ташкента: парки, прогулочные зоны, пространства для отдыха и досуга.",
      open: "Открыть место",
      home: "Главная",
    },
    uz: {
      title: "Barcha joylar",
      description:
        "Toshkentdagi qiziqarli joylar: bog‘lar, sayr zonalari va dam olish maskanlari.",
      open: "Joyni ochish",
      home: "Bosh sahifa",
    },
  };

  const t = uiText[language] || uiText.ru;

  return (
    <>
      <Seo title={t.title} description={t.description} />

      <main className="main">
        <section className="all-places-page">
          <div className="container">
            <div className="all-places-breadcrumbs">
              <Link to={`/${language}`}>{t.home}</Link>
              <span> / </span>
              <span>{t.title}</span>
            </div>

            <div className="all-places-header">
              <h1>{t.title}</h1>
              <p>{t.description}</p>
            </div>

            <AdBlock/>

            <div className="all-places-grid">
              {placesData.map((place) => {
                const title = getLocalizedValue(place.title, language);
                const type = getLocalizedValue(place.type, language);
                const category = getLocalizedValue(place.category, language);
                const address = getLocalizedValue(place.address, language);

                return (
                  <article key={place.slug} className="all-places-card">
                    <Link
                      to={`/${language}/places/${place.slug}`}
                      className="all-places-card-link"
                      aria-label={`${t.open}: ${title}`}
                    >
                      <div className="all-places-card-image-wrap">
                        <img
                          src={place.cover}
                          alt={title}
                          className="all-places-card-image"
                        />

                        {category && (
                          <span className="all-places-card-badge">
                            {category}
                          </span>
                        )}
                      </div>

                      <div className="all-places-card-body">
                        <h2>{title}</h2>

                        {type && (
                          <p className="all-places-card-subtitle">{type}</p>
                        )}

                        {address && (
                          <p className="all-places-card-location">{address}</p>
                        )}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default AllPlacesPage;