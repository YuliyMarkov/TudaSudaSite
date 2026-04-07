import { Link } from "react-router-dom";
import { moreNewsInitial } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";

function TudaStories() {
  const { language } = useLanguage();

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

  return (
    <section className="more-news-section">
      <div className="more-news-header">
        <h2>{t.title}</h2>
      </div>

      <div className="more-news-grid">
        {moreNewsInitial.map((item, index) => {
          const title = getLocalizedValue(item.title, language);
          const text = getLocalizedValue(item.text, language);

          return (
            <article className="more-news-card" key={index}>
              <Link
                to={`/${language}/stories/${item.slug}`}
                className="more-news-card-link"
              >
                <img src={item.image} alt={title} />
                <h3>{title}</h3>
                <p>{text}</p>
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