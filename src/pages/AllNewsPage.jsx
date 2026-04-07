import { useState } from "react"
import { Link } from "react-router-dom"
import { moreNewsInitial, moreNewsExtra } from "../data/homePageData"
import { useLanguage } from "../context/useLanguage"
import { getLocalizedValue } from "../utils/getLocalizedValue"
import Seo from "../components/Seo"

const allNewsData = [...moreNewsInitial, ...moreNewsExtra]

function AllNewsPage() {
  const { language } = useLanguage()

  const [activeFilter, setActiveFilter] = useState("all")

  const uiText = {
    ru: {
      title: "Новости и статьи",
      description:
        "Последние новости, события и интересные статьи Ташкента и Узбекистана.",
      filters: {
        all: "Все",
        news: "Новости",
        articles: "Статьи",
      },
    },
    uz: {
      title: "Yangiliklar va maqolalar",
      description:
        "Toshkent va O‘zbekistonning so‘nggi yangiliklari va maqolalari.",
      filters: {
        all: "Barchasi",
        news: "Yangiliklar",
        articles: "Maqolalar",
      },
    },
  }

  const t = uiText[language] || uiText.ru

  // пока фильтр заглушка (на будущее)
  const filteredNews =
    activeFilter === "all"
      ? allNewsData
      : allNewsData.filter((item) => item.type === activeFilter)

  return (
    <>
      <Seo
        title={t.title}
        description={t.description}
      />

      <section className="all-news-page">
        <div className="container">

          {/* HEADER */}
          <div className="all-news-header">
            <h1>{t.title}</h1>

            <div className="all-news-filters">
              <button
                className={activeFilter === "all" ? "active" : ""}
                onClick={() => setActiveFilter("all")}
              >
                {t.filters.all}
              </button>

              <button
                className={activeFilter === "news" ? "active" : ""}
                onClick={() => setActiveFilter("news")}
              >
                {t.filters.news}
              </button>

              <button
                className={activeFilter === "articles" ? "active" : ""}
                onClick={() => setActiveFilter("articles")}
              >
                {t.filters.articles}
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="all-news-grid">
            {filteredNews.map((item, index) => {
              const title = getLocalizedValue(item.title, language)
              const text = getLocalizedValue(item.text, language)

              return (
                <article key={index} className="all-news-card">
                  <Link
                    to={`/${language}/news/${item.slug}`}
                    className="all-news-card-link"
                  >
                    <img src={item.image} alt={title} />

                    <div className="all-news-card-body">
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}

export default AllNewsPage