import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { moreNewsInitial, moreNewsExtra } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

const allStoriesData = [...moreNewsInitial, ...moreNewsExtra];

function AllStoriesPage() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");

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
    },
  };

  const t = uiText[language] || uiText.ru;

  const filteredStories = useMemo(() => {
    return activeFilter === "all"
      ? allStoriesData
      : allStoriesData.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

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

          <div className="all-news-grid">
            {filteredStories.map((item) => {
              const title = getLocalizedValue(item.title, language);
              const text = getLocalizedValue(item.text, language);
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
                    <img src={item.image} alt={title} />

                    <div className="all-news-card-body">
                      {typeLabel ? (
                        <span className="all-news-card-type">{typeLabel}</span>
                      ) : null}

                      <h3>{title}</h3>
                      <p>{text}</p>
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

export default AllStoriesPage;