import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deletePlaceById, fetchAdminPlaces } from "../api/places";

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

function getTranslation(place, locale = "ru") {
  return (
    place?.translations?.find((item) => item.locale === locale) ||
    place?.translations?.[0] ||
    null
  );
}

function getPlaceTitle(place) {
  return getTranslation(place)?.title || "Без названия";
}

function getPlaceType(place) {
  return getTranslation(place)?.type || "—";
}

function getPlaceCategory(place) {
  return getTranslation(place)?.category || "—";
}

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlaces() {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await fetchAdminPlaces();

        if (!isMounted) return;

        setPlaces(data);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить места");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedPlaces = useMemo(() => {
    return [...places].sort((a, b) => {
      const dateA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [places]);

  async function handleDelete(place) {
    const confirmed = window.confirm(
      `Удалить место «${getPlaceTitle(place)}»? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    try {
      setDeleteError("");
      setDeletingId(place.id);

      await deletePlaceById(place.id);
      setPlaces((prev) => prev.filter((item) => item.id !== place.id));
    } catch (error) {
      setDeleteError(error.message || "Не удалось удалить место");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Места</h1>
          <p>
            Управление карточками мест, контактами, картой, highlights, ценами
            и тегами “подойдёт для”.
          </p>
        </div>

        <Link to="/places/create" className="admin-primary-btn">
          Создать место
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
          <p>Загрузка мест...</p>
        </div>
      ) : normalizedPlaces.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Статус</th>
                <th>Формат</th>
                <th>Категория</th>
                <th>Цены</th>
                <th>Highlights</th>
                <th>Подойдёт для</th>
                <th>Избранное</th>
                <th>Обновлён</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {normalizedPlaces.map((place) => (
                <tr key={place.id}>
                  <td>{place.id}</td>
                  <td>
                    <div className="admin-table-title-cell">
                      <strong>{getPlaceTitle(place)}</strong>
                      <span>{place.slug}</span>
                    </div>
                  </td>
                  <td>{getStatusLabel(place.status)}</td>
                  <td>{getPlaceType(place)}</td>
                  <td>{getPlaceCategory(place)}</td>
                  <td>{place.prices?.length || 0}</td>
                  <td>{place.highlights?.length || 0}</td>
                  <td>{place.suitableFor?.length || 0}</td>
                  <td>{place.isFeatured ? "Да" : "Нет"}</td>
                  <td>{formatDate(place.updatedAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/places/${place.id}/edit`}
                        className="admin-secondary-btn"
                      >
                        Редактировать
                      </Link>

                      <button
                        type="button"
                        className="admin-danger-btn"
                        onClick={() => handleDelete(place)}
                        disabled={deletingId === place.id}
                      >
                        {deletingId === place.id ? "Удаление..." : "Удалить"}
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
          <p>Мест пока нет.</p>
        </div>
      )}
    </section>
  );
}

export default PlacesPage;