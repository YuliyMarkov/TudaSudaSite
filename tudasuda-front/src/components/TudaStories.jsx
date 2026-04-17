import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "http://localhost:4000";

function TudaStories() {
  const { language } = useLanguage();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const uiText = {
    ru: {
      title: "Новости и статьи",
      loadMore: "Смотреть все",
    },
    uz: {
      title: "Yangiliklar va maqolalar",
      loadMore: "Barchasini ko‘rish",
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadStories() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/stories?status=published&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load stories");
        }

        const data = await response.json();
        setStories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD TUDA STORIES ERROR:", error);
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStories();
  }, [language]);

  const normalizedStories = useMemo(() => {
    return stories
      .map((item) => {
        const translation = item.translations?.[0] || null;

        return {
          id: item.id,
          slug: item.slug,
          image: item.coverImage,
          title: translation?.title || "",
          text: translation?.excerpt || "",
          publishedAt: item.publishedAt || item.createdAt,
          isFeatured: Boolean(item.isFeatured),
        };
      })
      .sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      });
  }, [stories]);

  const visibleStories = useMemo(() => {
    const featured = normalizedStories.filter((item) => item.isFeatured);
    if (featured.length >= 6) return featured.slice(0, 6);
    if (featured.length > 0) {
      const rest = normalizedStories.filter((item) => !item.isFeatured);
      return [...featured, ...rest].slice(0, 6);
    }
    return normalizedStories.slice(0, 6);
  }, [normalizedStories]);

  if (isLoading || !visibleStories.length) return null;

  return (
    <section className="more-news-section">
      <div className="more-news-header">
        <h2>{t.title}</h2>
      </div>

      <div className="more-news-grid">
        {visibleStories.map((item) => {
          return (
            <article className="more-news-card" key={item.id}>
              <Link
                to={`/${language}/stories/${item.slug}`}
                className="more-news-card-link"
              >
                {item.image ? <img src={item.image} alt={item.title} /> : null}

                <div className="more-news-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      <div className="more-news-action">
        <Link to={`/${language}/stories`} className="more-news-button">
          {t.loadMore}
        </Link>
      </div>
    </section>
  );
}

export default TudaStories;