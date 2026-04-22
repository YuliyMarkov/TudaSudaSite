import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import Seo from "../components/Seo";

const API_BASE_URL = "http://localhost:4000";

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function includesQuery(fields, query) {
  const haystack = fields
    .filter(Boolean)
    .map((item) => normalizeText(item))
    .join(" ");

  return haystack.includes(query);
}

function getScore(item, query) {
  const title = normalizeText(item.title);
  const subtitle = normalizeText(item.subtitle);
  const description = normalizeText(item.description);
  const meta = normalizeText(item.meta);

  let score = 0;

  if (title === query) score += 120;
  if (title.startsWith(query)) score += 80;
  if (title.includes(query)) score += 50;

  if (subtitle.includes(query)) score += 25;
  if (meta.includes(query)) score += 20;
  if (description.includes(query)) score += 10;

  return score;
}

function SearchPage() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
  const [stories, setStories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [places, setPlaces] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const queryFromUrl = searchParams.get("q") || "";
  const query = normalizeText(queryFromUrl);

  const uiText = {
    ru: {
      title: "Поиск",
      subtitle: "Результаты поиска по сайту",
      description:
        "Поиск по фильмам, событиям, новостям, ресторанам и местам Ташкента.",
      breadcrumbHome: "Главная",
      loading: "Ищем материалы...",
      error: "Не удалось загрузить данные для поиска.",
      emptyQuery: "Введите запрос в строке поиска.",
      noResults: "По вашему запросу ничего не найдено.",
      resultsFor: "Результаты по запросу",
      found: "Найдено",
      open: "Открыть",
      typeLabels: {
        movie: "Кино",
        event: "Афиша",
        story: "Новость / статья",
        restaurant: "Ресторан",
        place: "Место",
      },
    },
    uz: {
      title: "Qidiruv",
      subtitle: "Sayt bo‘ylab qidiruv natijalari",
      description:
        "Toshkent bo‘yicha filmlar, tadbirlar, yangiliklar, restoranlar va joylar ichidan qidiruv.",
      breadcrumbHome: "Bosh sahifa",
      loading: "Materiallar qidirilmoqda...",
      error: "Qidiruv uchun ma’lumotlarni yuklab bo‘lmadi.",
      emptyQuery: "Qidiruv satriga so‘rov kiriting.",
      noResults: "So‘rovingiz bo‘yicha hech narsa topilmadi.",
      resultsFor: "So‘rov bo‘yicha natijalar",
      found: "Topildi",
      open: "Ochish",
      typeLabels: {
        movie: "Kino",
        event: "Afisha",
        story: "Yangilik / maqola",
        restaurant: "Restoran",
        place: "Joy",
      },
    },
  };

  const t = uiText[language] || uiText.ru;

  useEffect(() => {
    async function loadAllData() {
      try {
        setIsLoading(true);
        setLoadError("");

        const [
          moviesResponse,
          eventsResponse,
          storiesResponse,
          restaurantsResponse,
          placesResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/movies?status=published&lang=${language}`),
          fetch(`${API_BASE_URL}/api/events?status=published&lang=${language}`),
          fetch(`${API_BASE_URL}/api/stories?status=published&lang=${language}`),
          fetch(
            `${API_BASE_URL}/api/restaurants?status=published&lang=${language}`
          ),
          fetch(`${API_BASE_URL}/api/places?status=published&lang=${language}`),
        ]);

        if (
          !moviesResponse.ok ||
          !eventsResponse.ok ||
          !storiesResponse.ok ||
          !restaurantsResponse.ok ||
          !placesResponse.ok
        ) {
          throw new Error("Failed to load search data");
        }

        const [
          moviesData,
          eventsData,
          storiesData,
          restaurantsData,
          placesData,
        ] = await Promise.all([
          moviesResponse.json(),
          eventsResponse.json(),
          storiesResponse.json(),
          restaurantsResponse.json(),
          placesResponse.json(),
        ]);

        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setStories(Array.isArray(storiesData) ? storiesData : []);
        setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : []);
        setPlaces(Array.isArray(placesData) ? placesData : []);
      } catch (error) {
        console.error("LOAD SEARCH DATA ERROR:", error);
        setLoadError(t.error);
        setMovies([]);
        setEvents([]);
        setStories([]);
        setRestaurants([]);
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAllData();
  }, [language, t.error]);

  const normalizedItems = useMemo(() => {
    const movieItems = movies.map((movie) => {
      const translation = movie.translations?.[0] || null;

      return {
        id: `movie-${movie.id}`,
        entityType: "movie",
        slug: movie.slug,
        href: `/${language}/movies/${movie.slug}`,
        image: movie.posterImage || movie.coverImage || "",
        title: translation?.title || "",
        subtitle: translation?.genre || "",
        description: "",
        meta: translation?.country || "",
      };
    });

    const eventItems = events.map((event) => {
      const translation = event.translations?.[0] || null;
      const firstSession = event.sessions?.[0] || null;

      return {
        id: `event-${event.id}`,
        entityType: "event",
        slug: event.slug,
        href: `/${language}/events/${event.slug}`,
        image: event.coverImage || "",
        title: translation?.title || "",
        subtitle: translation?.shortDescription || "",
        description: translation?.description || "",
        meta: [
          translation?.address || "",
          translation?.ticketPrice || firstSession?.price || "",
          event.type || "",
          event.isForKids ? "kids bolalar детям" : "",
        ]
          .filter(Boolean)
          .join(" "),
      };
    });

    const storyItems = stories.map((story) => {
      const translation = story.translations?.[0] || null;

      return {
        id: `story-${story.id}`,
        entityType: "story",
        slug: story.slug,
        href: `/${language}/stories/${story.slug}`,
        image: story.coverImage || "",
        title: translation?.title || "",
        subtitle: translation?.excerpt || "",
        description: translation?.excerpt || "",
        meta: story.type || "",
      };
    });

    const restaurantItems = restaurants.map((restaurant) => {
      const translation = restaurant.translations?.[0] || null;
      const formatList =
        restaurant.formats?.map((item) => item.value).filter(Boolean) || [];

      return {
        id: `restaurant-${restaurant.id}`,
        entityType: "restaurant",
        slug: restaurant.slug,
        href: `/${language}/restaurants/${restaurant.slug}`,
        image: restaurant.coverImage || "",
        title: translation?.title || "",
        subtitle: translation?.type || "",
        description:
          translation?.mustVisit || translation?.description || "",
        meta: [
          translation?.cuisine || "",
          translation?.averageCheck || "",
          ...formatList,
        ]
          .filter(Boolean)
          .join(" "),
      };
    });

    const placeItems = places.map((place) => {
      const translation = place.translations?.[0] || null;

      return {
        id: `place-${place.id}`,
        entityType: "place",
        slug: place.slug,
        href: `/${language}/places/${place.slug}`,
        image: place.coverImage || "",
        title: translation?.title || "",
        subtitle: translation?.type || "",
        description: translation?.address || "",
        meta: [translation?.category || "", translation?.address || ""]
          .filter(Boolean)
          .join(" "),
      };
    });

    return [
      ...movieItems,
      ...eventItems,
      ...storyItems,
      ...restaurantItems,
      ...placeItems,
    ];
  }, [movies, events, stories, restaurants, places, language]);

  const filteredResults = useMemo(() => {
    if (!query) return [];

    return normalizedItems
      .filter((item) =>
        includesQuery(
          [item.title, item.subtitle, item.description, item.meta],
          query
        )
      )
      .map((item) => ({
        ...item,
        score: getScore(item, query),
      }))
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }, [normalizedItems, query]);

  return (
    <>
      <Seo
        title={
          queryFromUrl
            ? `${t.title}: ${queryFromUrl}`
            : t.title
        }
        description={t.description}
      />

      <section className="search-page">
        <div className="container">
          <div className="breadcrumbs">
            <Link to={`/${language}`}>{t.breadcrumbHome}</Link>
            <span> / </span>
            <span>{t.title}</span>
          </div>

          <header className="search-page__header">
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </header>

          {!query ? (
            <p>{t.emptyQuery}</p>
          ) : isLoading ? (
            <p>{t.loading}</p>
          ) : loadError ? (
            <p>{loadError}</p>
          ) : filteredResults.length === 0 ? (
            <>
              <p>
                {t.resultsFor}: <strong>“{queryFromUrl}”</strong>
              </p>
              <p>{t.noResults}</p>
            </>
          ) : (
            <>
              <p>
                {t.resultsFor}: <strong>“{queryFromUrl}”</strong>
              </p>
              <p>
                {t.found}: <strong>{filteredResults.length}</strong>
              </p>

              <div className="search-results">
                {filteredResults.map((item) => (
                  <article
                    key={item.id}
                    className="search-result-card"
                  >
                    {item.image ? (
                      <Link
                        to={item.href}
                        className="search-result-card__image-link"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="search-result-card__image"
                          loading="lazy"
                        />
                      </Link>
                    ) : null}

                    <div className="search-result-card__content">
                      <div className="search-result-card__type">
                        {t.typeLabels[item.entityType]}
                      </div>

                      <h2 className="search-result-card__title">
                        <Link to={item.href}>{item.title}</Link>
                      </h2>

                      {item.subtitle ? (
                        <p className="search-result-card__subtitle">
                          {item.subtitle}
                        </p>
                      ) : null}

                      {item.description ? (
                        <p className="search-result-card__description">
                          {item.description}
                        </p>
                      ) : null}

                      <Link
                        to={item.href}
                        className="search-result-card__link"
                      >
                        {t.open}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default SearchPage;