import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminHeroSlides } from "../api/heroSlides";
import { fetchAdminReels } from "../api/reels";
import { fetchAdminMovies } from "../api/movies";
import { fetchAdminPlaces } from "../api/places";
import { fetchAdminRestaurants } from "../api/restaurants";
import { fetchAdminStories } from "../api/stories";
import { fetchAdminEvents } from "../api/events";

function getTranslation(item, locale = "ru") {
  return (
    item?.translations?.find((translation) => translation.locale === locale) ||
    item?.translations?.[0] ||
    null
  );
}

function getTitle(item, fallback = "Без названия") {
  return getTranslation(item)?.title || fallback;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function buildLatestItems(items, type) {
  return [...items]
    .sort((a, b) => {
      const timeA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: getTitle(item),
      updatedAt: item.updatedAt,
      status: item.status || "—",
      editPath: `/${type}/${item.id}/edit`,
    }));
}

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [heroSlides, setHeroSlides] = useState([]);
  const [reels, setReels] = useState([]);
  const [stories, setStories] = useState([]);
  const [events, setEvents] = useState([]);
  const [movies, setMovies] = useState([]);
  const [places, setPlaces] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setLoadError("");

        const [
          heroSlidesData,
          reelsData,
          storiesData,
          eventsData,
          moviesData,
          placesData,
          restaurantsData,
        ] = await Promise.all([
          fetchAdminHeroSlides(),
          fetchAdminReels(),
          fetchAdminStories(),
          fetchAdminEvents(),
          fetchAdminMovies(),
          fetchAdminPlaces(),
          fetchAdminRestaurants(),
        ]);

        if (!isMounted) return;

        setHeroSlides(Array.isArray(heroSlidesData) ? heroSlidesData : []);
        setReels(Array.isArray(reelsData) ? reelsData : []);
        setStories(Array.isArray(storiesData) ? storiesData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setPlaces(Array.isArray(placesData) ? placesData : []);
        setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : []);
      } catch (error) {
        if (!isMounted) return;
        console.error("LOAD DASHBOARD ERROR:", error);
        setLoadError(error.message || "Не удалось загрузить данные дашборда");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    return [
      {
        label: "Слайды главной",
        value: heroSlides.length,
        extra: `${heroSlides.filter((item) => item.isActive).length} активных`,
      },
      {
        label: "Рилсы",
        value: reels.length,
        extra: `${reels.filter((item) => item.isActive).length} активных`,
      },
      {
        label: "Материалы",
        value: stories.length,
        extra: `${stories.filter((item) => item.status === "published").length} опубликовано`,
      },
      {
        label: "События",
        value: events.length,
        extra: `${events.filter((item) => item.status === "published").length} опубликовано`,
      },
      {
        label: "Фильмы",
        value: movies.length,
        extra: `${movies.filter((item) => item.status === "published").length} опубликовано`,
      },
      {
        label: "Места",
        value: places.length,
        extra: `${places.filter((item) => item.status === "published").length} опубликовано`,
      },
      {
        label: "Рестораны",
        value: restaurants.length,
        extra: `${restaurants.filter((item) => item.status === "published").length} опубликовано`,
      },
    ];
  }, [heroSlides, reels, stories, events, movies, places, restaurants]);

  const quickActions = [
    { to: "/hero-slides/create", label: "Новый слайд" },
    { to: "/reels/create", label: "Новый рилс" },
    { to: "/stories/create", label: "Новый материал" },
    { to: "/events/create", label: "Новое событие" },
    { to: "/movies/create", label: "Новый фильм" },
    { to: "/places/create", label: "Новое место" },
    { to: "/restaurants/create", label: "Новый ресторан" },
  ];

  const latestStories = useMemo(
    () => buildLatestItems(stories, "stories"),
    [stories]
  );
  const latestEvents = useMemo(
    () => buildLatestItems(events, "events"),
    [events]
  );
  const latestMovies = useMemo(
    () => buildLatestItems(movies, "movies"),
    [movies]
  );

  return (
    <section className="admin-dashboard">
      <div className="admin-section-header">
        <div>
          <h1>Админка TudaSuda</h1>
          <p>
            Главная панель управления контентом: статистика, быстрые действия и
            последние обновления.
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="admin-alert admin-alert--error">{loadError}</div>
      ) : null}

      {isLoading ? (
        <div className="admin-card">
          <p>Загрузка дашборда...</p>
        </div>
      ) : (
        <>
          <div className="dashboard-stats-grid">
            {stats.map((item) => (
              <div className="dashboard-stat-card" key={item.label}>
                <span className="dashboard-stat-label">{item.label}</span>
                <strong className="dashboard-stat-value">{item.value}</strong>
                <span className="dashboard-stat-extra">{item.extra}</span>
              </div>
            ))}
          </div>

          <section className="admin-card">
            <div className="admin-section-header">
              <div>
                <h2>Быстрые действия</h2>
                <p>Самые частые действия для наполнения главной и каталога.</p>
              </div>
            </div>

            <div className="dashboard-actions-grid">
              {quickActions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="dashboard-action-card"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </section>

          <div className="dashboard-lists-grid">
            <section className="admin-card">
              <div className="admin-section-header">
                <div>
                  <h2>Последние материалы</h2>
                </div>
                <Link to="/stories" className="admin-secondary-btn">
                  Все материалы
                </Link>
              </div>

              <div className="dashboard-list">
                {latestStories.length ? (
                  latestStories.map((item) => (
                    <Link
                      key={`story-${item.id}`}
                      to={item.editPath}
                      className="dashboard-list-item"
                    >
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          {item.status} · обновлено {formatDate(item.updatedAt)}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>Материалов пока нет.</p>
                )}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-section-header">
                <div>
                  <h2>Последние события</h2>
                </div>
                <Link to="/events" className="admin-secondary-btn">
                  Все события
                </Link>
              </div>

              <div className="dashboard-list">
                {latestEvents.length ? (
                  latestEvents.map((item) => (
                    <Link
                      key={`event-${item.id}`}
                      to={item.editPath}
                      className="dashboard-list-item"
                    >
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          {item.status} · обновлено {formatDate(item.updatedAt)}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>Событий пока нет.</p>
                )}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-section-header">
                <div>
                  <h2>Последние фильмы</h2>
                </div>
                <Link to="/movies" className="admin-secondary-btn">
                  Все фильмы
                </Link>
              </div>

              <div className="dashboard-list">
                {latestMovies.length ? (
                  latestMovies.map((item) => (
                    <Link
                      key={`movie-${item.id}`}
                      to={item.editPath}
                      className="dashboard-list-item"
                    >
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          {item.status} · обновлено {formatDate(item.updatedAt)}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>Фильмов пока нет.</p>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardPage;