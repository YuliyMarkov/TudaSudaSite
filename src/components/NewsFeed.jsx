import { Link } from "react-router-dom";
import { featuredNews } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";

function getNewsLink(language, item) {
  switch (item.linkType) {
    case "events":
      return `/${language}/events/${item.slug}`;
    case "movies":
      return `/${language}/movies/${item.slug}`;
    case "places":
      return `/${language}/places/${item.slug}`;
    case "news":
    default:
      return `/${language}/news/${item.slug}`;
  }
}

function NewsFeed() {
  const { language } = useLanguage();

  const uiText = {
    ru: {
      title: "Новости Узбекистана",
      more: "Смотреть ещё",
    },
    uz: {
      title: "O‘zbekiston yangiliklari",
      more: "Yana ko‘rish",
    },
  };

  const t = uiText[language] || uiText.ru;

  return (
    <section className="content-grid">
      <section className="news-feed-section">
        <div className="news-feed-header">
          <h2>{t.title}</h2>
          <Link to={`/${language}/category/uzbekistan`} className="news-more">
            {t.more} <span className="arrow">→</span>
          </Link>
        </div>

        <div className="news-feed">
          {featuredNews.slice(0, 6).map((item, index) => {
            const title = getLocalizedValue(item.title, language);
            const text = getLocalizedValue(item.text, language);
            const href = getNewsLink(language, item);

            return (
              <article className="news-card" key={index}>
                <Link to={href} className="news-card-link">
                  <img src={item.image} alt={title} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default NewsFeed;