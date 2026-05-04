import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";
import AdBlock from "../components/AdBlock";

const API_BASE_URL = "";

function AllPlacesPage() {
  const { language } = useLanguage();

  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const uiText = {
    ru: {
      title: "Все места",
      description:
        "Интересные места Ташкента: парки, прогулочные зоны, пространства для отдыха и досуга.",
      open: "Открыть место",
      home: "Главная",
      loading: "Загрузка мест...",
      error: "Не удалось загрузить места.",
      empty: "Пока мест нет.",
    },
    uz: {
      title: "Barcha joylar",
      description:
        "Toshkentdagi qiziqarli joylar: bog‘lar, sayr zonalari va dam olish maskanlari.",
      open: "Joyni ochish",
      home: "Bosh sahifa",
      loading: "Joylar yuklanmoqda...",
      error: "Joylarni yuklab bo‘lmadi.",
      empty: "Hozircha joylar yo‘q.",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadPlaces() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/places?status=published&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load places");
        }

        const data = await response.json();
        setPlaces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD PLACES ERROR:", error);
        setLoadError(t.error);
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlaces();
  }, [language, t.error]);

  const normalizedPlaces = useMemo(() => {
    return places.map((place) => {
      const translation = place.translations?.[0] || null;

      return {
        id: place.id,
        slug: place.slug,
        cover: place.coverImage,
        title: translation?.title || "",
        type: translation?.type || "",
        category: translation?.category || "",
        address: translation?.address || "",
      };
    });
  }, [places]);

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

            <AdBlock />

            {isLoading ? (
              <div className="all-places-empty">{t.loading}</div>
            ) : loadError ? (
              <div className="all-places-empty">{loadError}</div>
            ) : !normalizedPlaces.length ? (
              <div className="all-places-empty">{t.empty}</div>
            ) : (
              <div className="all-places-grid">
                {normalizedPlaces.map((place) => {
                  return (
                    <article key={place.slug} className="all-places-card">
                      <Link
                        to={`/${language}/places/${place.slug}`}
                        className="all-places-card-link"
                        aria-label={`${t.open}: ${place.title}`}
                      >
                        <div className="all-places-card-image-wrap">
                          <img
                            src={place.cover}
                            alt={place.title}
                            className="all-places-card-image"
                          />

                          {place.category && (
                            <span className="all-places-card-badge">
                              {place.category}
                            </span>
                          )}
                        </div>

                        <div className="all-places-card-body">
                          <h2>{place.title}</h2>

                          {place.type && (
                            <p className="all-places-card-subtitle">
                              {place.type}
                            </p>
                          )}

                          {place.address && (
                            <p className="all-places-card-location">
                              {place.address}
                            </p>
                          )}
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default AllPlacesPage;