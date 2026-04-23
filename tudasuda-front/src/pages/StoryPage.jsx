import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";
import StoryContentRenderer from "../components/StoryContentRenderer";

const API_BASE_URL = "";

function StoryPage() {
  const { lang, slug } = useParams();
  const { language } = useLanguage();

  const currentLang = lang || language || "ru";

  const [story, setStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const uiText = {
    ru: {
      back: "← Назад ко всем материалам",
      news: "Новость",
      article: "Статья",
      related: "Похожие материалы",
    },
    uz: {
      back: "← Barcha materiallarga qaytish",
      news: "Yangilik",
      article: "Maqola",
      related: "O‘xshash materiallar",
    },
  };

  const t = uiText[currentLang] || uiText.ru;

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setLoadError(false);

        const [storyResponse, storiesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stories/${slug}?lang=${currentLang}`),
          fetch(
            `${API_BASE_URL}/api/stories?status=published&lang=${currentLang}`
          ),
        ]);

        if (storyResponse.status === 404) {
          setStory(null);
          setStories([]);
          return;
        }

        if (!storyResponse.ok || !storiesResponse.ok) {
          throw new Error("Failed to load story data");
        }

        const storyData = await storyResponse.json();
        const storiesData = await storiesResponse.json();

        setStory(storyData);
        setStories(Array.isArray(storiesData) ? storiesData : []);
      } catch (error) {
        console.error("LOAD STORY ERROR:", error);
        setLoadError(true);
        setStory(null);
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug, currentLang]);

  const normalizedStory = useMemo(() => {
    if (!story) return null;

    const translation = story.translations?.[0] || null;
    const shortText = translation?.excerpt || "";

    return {
      slug: story.slug,
      type: story.type || "news",
      image: story.coverImage,
      title: translation?.title || "",
      shortText,
      content: translation?.content || "",
      contentJson: translation?.contentJson || null,
      seoTitle: translation?.seoTitle || translation?.title || "",
      seoDescription: translation?.seoDescription || shortText || "",
    };
  }, [story]);

  const relatedStories = useMemo(() => {
    if (!normalizedStory || !stories.length) return [];

    const normalized = stories
      .map((item) => {
        const translation = item.translations?.[0] || null;

        return {
          id: item.id,
          slug: item.slug,
          type: item.type || "news",
          image: item.coverImage,
          title: translation?.title || "",
          excerpt: translation?.excerpt || "",
          publishedAt: item.publishedAt || item.createdAt,
        };
      })
      .filter((item) => item.slug !== normalizedStory.slug);

    const sameType = normalized
      .filter((item) => item.type === normalizedStory.type)
      .sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      });

    const otherType = normalized
      .filter((item) => item.type !== normalizedStory.type)
      .sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      });

    return [...sameType, ...otherType].slice(0, 3);
  }, [stories, normalizedStory]);

  if (isLoading) {
    return null;
  }

  if (loadError || !normalizedStory) {
    return <Navigate to={`/${currentLang}/stories`} replace />;
  }

  const storyTypeLabel =
    normalizedStory.type === "news"
      ? t.news
      : normalizedStory.type === "article"
      ? t.article
      : "";

  return (
    <>
      <Seo
        title={normalizedStory.seoTitle || normalizedStory.title}
        description={normalizedStory.seoDescription || normalizedStory.title}
        image={normalizedStory.image}
      />

      <main className="story-page">
        <div className="container">
          <div className="story-page-top">
            <Link to={`/${currentLang}/stories`} className="back-link">
              {t.back}
            </Link>
          </div>

          <article className="story-page-article">
            {normalizedStory.image ? (
              <div className="story-page-cover">
                <img src={normalizedStory.image} alt={normalizedStory.title} />
              </div>
            ) : null}

            <div className="story-page-content">
              {storyTypeLabel ? (
                <div className="story-page-type">{storyTypeLabel}</div>
              ) : null}

              <h1>{normalizedStory.title}</h1>

              {normalizedStory.shortText ? (
                <div className="story-page-lead">{normalizedStory.shortText}</div>
              ) : null}

              <StoryContentRenderer
                contentJson={normalizedStory.contentJson}
                fallbackHtml={normalizedStory.content}
              />
            </div>
          </article>

          {relatedStories.length > 0 ? (
            <section className="story-related-section">
              <h2>{t.related}</h2>

              <div className="all-news-grid">
                {relatedStories.map((item) => {
                  const typeLabel =
                    item.type === "news"
                      ? t.news
                      : item.type === "article"
                      ? t.article
                      : "";

                  return (
                    <article key={item.id} className="all-news-card">
                      <Link
                        to={`/${currentLang}/stories/${item.slug}`}
                        className="all-news-card-link"
                      >
                        {item.image ? <img src={item.image} alt={item.title} /> : null}

                        <div className="all-news-card-body">
                          {typeLabel ? (
                            <span className="all-news-card-type">{typeLabel}</span>
                          ) : null}

                          <h3>{item.title}</h3>
                          <p>{item.excerpt}</p>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}

export default StoryPage;