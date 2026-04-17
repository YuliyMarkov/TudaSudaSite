import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "http://localhost:4000";

function PlacesSection() {
  const { language } = useLanguage();

  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    async function loadPlaces() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/places?status=published&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load places");
        }

        const data = await response.json();
        setPlaces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD PLACES SECTION ERROR:", error);
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlaces();
  }, [language]);

  const normalizedPlaces = useMemo(() => {
    return places.slice(0, 6).map((place) => {
      const translation = place.translations?.[0] || null;

      return {
        id: place.id,
        slug: place.slug,
        image: place.coverImage,
        title: translation?.title || "",
        subtitle: translation?.type || "",
        location: translation?.address || "",
        category: translation?.category || "",
      };
    });
  }, [places]);

  if (isLoading || !normalizedPlaces.length) return null;

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
          {normalizedPlaces.map((place) => {
            return (
              <article key={place.id} className="places-card">
                <Link
                  to={`/${language}/places/${place.slug}`}
                  className="places-card-link"
                  aria-label={`${t.open}: ${place.title}`}
                >
                  <div className="places-card-image-wrap">
                    <img
                      src={place.image}
                      alt={place.title}
                      className="places-card-image"
                    />
                    {place.category && (
                      <span className="places-card-badge">{place.category}</span>
                    )}
                  </div>

                  <div className="places-card-body">
                    <h3>{place.title}</h3>

                    <div className="places-card-meta">
                      {place.subtitle && (
                        <span className="places-card-subtitle">
                          {place.subtitle}
                        </span>
                      )}
                      {place.location && (
                        <span className="places-card-location">
                          {place.location}
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