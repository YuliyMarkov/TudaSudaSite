import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/useLanguage";

const API_BASE_URL = "";

function NewsFeed() {
  const { language } = useLanguage();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const uiText = {
    ru: {
      title: "Новости Узбекистана",
      more: "Смотреть ещё",
      error: "Не удалось загрузить материалы.",
    },
    uz: {
      title: "O‘zbekiston yangiliklari",
      more: "Yana ko‘rish",
      error: "Materiallarni yuklab bo‘lmadi.",
    },
  };

  const t = uiText[language] || uiText.ru;
  const errorText =
    language === "uz"
      ? "Materiallarni yuklab bo‘lmadi."
      : "Не удалось загрузить материалы.";

  useEffect(() => {
    async function loadStories() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/stories?status=published&lang=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to load stories");
        }

        const data = await response.json();
        setStories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD NEWS FEED ERROR:", error);
        setLoadError(errorText);
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStories();
  }, [language, errorText]);

  const normalizedStories = useMemo(() => {
    return stories
      .map((item) => {
        const translation = item.translations?.[0] || null;

        return {
          id: item.id,
          slug: item.slug,
          type: item.type || "news",
          image: item.coverImage,
          title: translation?.title || "",
          text: translation?.excerpt || "",
          publishedAt: item.publishedAt || item.createdAt,
          isFeatured: Boolean(item.isFeatured),
        };
      })
      .sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) {
          return Number(b.isFeatured) - Number(a.isFeatured);
        }

        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

        return bDate - aDate;
      })
      .slice(0, 6);
  }, [stories]);

  return (
    <section className="content-grid">
      <section className="news-feed-section">
        <div className="news-feed-header">
          <h2>{t.title}</h2>
          <Link to={`/${language}/stories`} className="news-more">
            {t.more} <span className="arrow">→</span>
          </Link>
        </div>

        {isLoading ? null : loadError ? (
          <div className="news-feed-empty">{loadError}</div>
        ) : normalizedStories.length ? (
          <div className="news-feed">
            {normalizedStories.map((item) => (
              <article className="news-card" key={item.id}>
                <Link
                  to={`/${language}/stories/${item.slug}`}
                  className="news-card-link"
                >
                  {item.image ? <img src={item.image} alt={item.title} /> : null}
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
}

export default NewsFeed;