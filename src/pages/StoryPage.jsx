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
    return content;
  }

  if (typeof content === "object") {
    const localized = content[language] ?? content.ru ?? content.uz;

    if (Array.isArray(localized)) {
      return localized;
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
  const text = getLocalizedValue(story.text, currentLang);
  const description = text || title;

  const contentParagraphs = normalizeContent(
    story.content,
    currentLang,
    text
  );

  const uiText = {
    ru: {
      back: "← Назад к материалам",
    },
    uz: {
      back: "← Materiallarga qaytish",
    },
  };

  const t = uiText[currentLang] || uiText.ru;

  return (
    <>
      <Seo title={title} description={description} />

      <main className="story-page">
        <div className="container">
          <div className="story-page-top">
            <Link to={`/${currentLang}/stories`} className="story-back-link">
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
              <h1>{title}</h1>

              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{description}</p>
              )}
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export default StoryPage;