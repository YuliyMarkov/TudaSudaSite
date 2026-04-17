import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";

const API_BASE_URL = "http://localhost:4000";

function AllStoriesPage() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const uiText = {
    ru: {
      title: "Новости и статьи",
      description:
        "Городские новости, редакционные материалы, статьи и полезные подборки о Ташкенте и Узбекистане.",
      filters: {
        all: "Все",
        news: "Новости",
        articles: "Статьи",
      },
      typeLabels: {
        news: "Новость",
        articles: "Статья",
      },
      loading: "Загрузка материалов...",
      error: "Не удалось загрузить материалы.",
      empty: "Материалов пока нет.",
    },
    uz: {
      title: "Yangiliklar va maqolalar",
      description:
        "Toshkent va O‘zbekiston haqidagi shahar yangiliklari, tahririyat materiallari va foydali maqolalar.",
      filters: {
        all: "Barchasi",
        news: "Yangiliklar",
        articles: "Maqolalar",
      },
      typeLabels: {
        news: "Yangilik",
        articles: "Maqola",
      },
      loading: "Materiallar yuklanmoqda...",
      error: "Materiallarni yuklab bo‘lmadi.",
      empty: "Hozircha materiallar yo‘q.",
    },
  };

  const t = uiText[language] || uiText.ru;

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
        console.error("LOAD STORIES ERROR:", error);
        setLoadError(t.error);
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStories();
  }, [language, t.error]);

  const normalizedStories = useMemo(() => {
    return stories.map((item) => {
      const translation = item.translations?.[0] || null;

      return {
        id: item.id,
        slug: item.slug,
        type: item.type || "news",
        image: item.coverImage,
        title: translation?.title || "",
        text: translation?.excerpt || "",
      };
    });
  }, [stories]);

  const filteredStories = useMemo(() => {
    return activeFilter === "all"
      ? normalizedStories
      : normalizedStories.filter((item) => item.type === activeFilter);
  }, [activeFilter, normalizedStories]);

  return (
    <>
      <Seo title={t.title} description={t.description} />

      <section className="all-news-page">
        <div className="container">
          <div className="all-news-header">
            <h1>{t.title}</h1>
            <p className="all-news-description">{t.description}</p>

            <div className="all-news-filters">
              <button
                type="button"
                className={activeFilter === "all" ? "active" : ""}
                onClick={() => setActiveFilter("all")}
              >
                {t.filters.all}
              </button>

              <button
                type="button"
                className={activeFilter === "news" ? "active" : ""}
                onClick={() => setActiveFilter("news")}
              >
                {t.filters.news}
              </button>

              <button
                type="button"
                className={activeFilter === "articles" ? "active" : ""}
                onClick={() => setActiveFilter("articles")}
              >
                {t.filters.articles}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="all-news-empty">{t.loading}</div>
          ) : loadError ? (
            <div className="all-news-empty">{loadError}</div>
          ) : filteredStories.length ? (
            <div className="all-news-grid">
              {filteredStories.map((item) => {
                const typeLabel =
                  item.type && t.typeLabels[item.type]
                    ? t.typeLabels[item.type]
                    : "";

                return (
                  <article key={item.slug} className="all-news-card">
                    <Link
                      to={`/${language}/stories/${item.slug}`}
                      className="all-news-card-link"
                    >
                      {item.image ? <img src={item.image} alt={item.title} /> : null}

                      <div className="all-news-card-body">
                        {typeLabel ? (
                          <span className="all-news-card-type">{typeLabel}</span>
                        ) : null}

                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="all-news-empty">{t.empty}</div>
          )}
        </div>
      </section>
    </>
  );
}

export default AllStoriesPage;