import { Link, Navigate, useParams } from "react-router-dom";
import { moreNewsInitial, moreNewsExtra } from "../data/homePageData";
import { useLanguage } from "../context/useLanguage";
import { getLocalizedValue } from "../utils/getLocalizedValue";
import Seo from "../components/Seo";

const allStoriesData = [...moreNewsInitial, ...moreNewsExtra];

function normalizeContent(content, language, fallbackText = "") {
  if (!content) {
    return fallbackText ? [fallbackText] : [];
  }

  if (Array.isArray(content)) {
    return content.filter(Boolean);
  }

  if (typeof content === "object") {
    const localized = content[language] ?? content.ru ?? content.uz;

    if (Array.isArray(localized)) {
      return localized.filter(Boolean);
    }

    if (typeof localized === "string" && localized.trim()) {
      return [localized];
    }
  }

  if (typeof content === "string" && content.trim()) {
    return [content];
  }

  return fallbackText ? [fallbackText] : [];
}

function StoryPage() {
  const { lang, slug } = useParams();
  const { language } = useLanguage();

  const currentLang = lang || language || "ru";
  const story = allStoriesData.find((item) => item.slug === slug);

  if (!story) {
    return <Navigate to={`/${currentLang}/stories`} replace />;
  }

  const title = getLocalizedValue(story.title, currentLang);
  const shortText = getLocalizedValue(story.text, currentLang);
  const paragraphs = normalizeContent(story.content, currentLang, shortText);

  const uiText = {
    ru: {
      back: "← Назад ко всем материалам",
      news: "Новость",
      articles: "Статья",
    },
    uz: {
      back: "← Barcha materiallarga qaytish",
      news: "Yangilik",
      articles: "Maqola",
    },
  };

  const t = uiText[currentLang] || uiText.ru;

  const storyTypeLabel =
    story.type === "news" ? t.news : story.type === "articles" ? t.articles : "";

  return (
    <>
      <Seo title={title} description={shortText || title} />

      <main className="story-page">
        <div className="container">
          <div className="story-page-top">
            <Link to={`/${currentLang}/stories`} className="back-link">
              {t.back}
            </Link>
          </div>

          <article className="story-page-article">
            {story.image ? (
              <div className="story-page-cover">
                <img src={story.image} alt={title} />
              </div>
            ) : null}

            <div className="story-page-content">
              {storyTypeLabel ? (
                <div className="story-page-type">{storyTypeLabel}</div>
              ) : null}

              <h1>{title}</h1>

              {shortText ? <div className="story-page-lead">{shortText}</div> : null}

              <div className="story-page-body">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export default StoryPage;