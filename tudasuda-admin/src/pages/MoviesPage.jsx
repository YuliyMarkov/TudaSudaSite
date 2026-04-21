import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteMovieById, fetchAdminMovies } from "../api/movies";

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

function getStatusLabel(status) {
  switch (status) {
    case "published":
      return "Опубликован";
    case "archived":
      return "Архив";
    case "draft":
    default:
      return "Черновик";
  }
}

function getTranslation(movie, locale = "ru") {
  return (
    movie?.translations?.find((item) => item.locale === locale) ||
    movie?.translations?.[0] ||
    null
  );
}

function getMovieTitle(movie) {
  return getTranslation(movie)?.title || "Без названия";
}

function getMovieGenre(movie) {
  return getTranslation(movie)?.genre || "—";
}

function getMovieDirector(movie) {
  return getTranslation(movie)?.director || "—";
}

function getMovieCountry(movie) {
  return getTranslation(movie)?.country || "—";
}

function getNearestSessionDate(movie) {
  if (!Array.isArray(movie?.sessions) || !movie.sessions.length) {
    return "—";
  }

  const timestamps = movie.sessions
    .map((item) => new Date(item.startAt).getTime())
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b);

  if (!timestamps.length) return "—";

  return formatDate(timestamps[0]);
}

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMovies() {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await fetchAdminMovies();

        if (!isMounted) return;

        setMovies(data);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить фильмы");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      const dateA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [movies]);

  async function handleDelete(movie) {
    const confirmed = window.confirm(
      `Удалить фильм «${getMovieTitle(movie)}»? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    try {
      setDeleteError("");
      setDeletingId(movie.id);

      await deleteMovieById(movie.id);
      setMovies((prev) => prev.filter((item) => item.id !== movie.id));
    } catch (error) {
      setDeleteError(error.message || "Не удалось удалить фильм");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Фильмы</h1>
          <p>
            Управление карточками фильмов, премьерами, сеансами, галереей,
            трейлерами и актёрским составом.
          </p>
        </div>

        <Link to="/movies/create" className="admin-primary-btn">
          Создать фильм
        </Link>
      </div>

      {loadError ? (
        <div className="admin-alert admin-alert--error">{loadError}</div>
      ) : null}

      {deleteError ? (
        <div className="admin-alert admin-alert--error">{deleteError}</div>
      ) : null}

      {isLoading ? (
        <div className="admin-card">
          <p>Загрузка фильмов...</p>
        </div>
      ) : normalizedMovies.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Статус</th>
                <th>Премьера</th>
                <th>Ближайший сеанс</th>
                <th>Жанр</th>
                <th>Режиссёр</th>
                <th>Страна</th>
                <th>Сеансы</th>
                <th>Кадры</th>
                <th>Избранное</th>
                <th>Обновлён</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {normalizedMovies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>
                    <div className="admin-table-title-cell">
                      <strong>{getMovieTitle(movie)}</strong>
                      <span>{movie.slug}</span>
                    </div>
                  </td>
                  <td>{getStatusLabel(movie.status)}</td>
                  <td>{formatDate(movie.releaseDate)}</td>
                  <td>{getNearestSessionDate(movie)}</td>
                  <td>{getMovieGenre(movie)}</td>
                  <td>{getMovieDirector(movie)}</td>
                  <td>{getMovieCountry(movie)}</td>
                  <td>{movie.sessions?.length || 0}</td>
                  <td>{movie.galleryItems?.length || 0}</td>
                  <td>{movie.isFeatured ? "Да" : "Нет"}</td>
                  <td>{formatDate(movie.updatedAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/movies/${movie.id}/edit`}
                        className="admin-secondary-btn"
                      >
                        Редактировать
                      </Link>

                      <button
                        type="button"
                        className="admin-danger-btn"
                        onClick={() => handleDelete(movie)}
                        disabled={deletingId === movie.id}
                      >
                        {deletingId === movie.id ? "Удаление..." : "Удалить"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-card">
          <p>Фильмов пока нет.</p>
        </div>
      )}
    </section>
  );
}

export default MoviesPage;