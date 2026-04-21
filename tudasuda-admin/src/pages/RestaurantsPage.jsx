import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteRestaurantById,
  fetchAdminRestaurants,
} from "../api/restaurants";

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

function getTranslation(restaurant, locale = "ru") {
  return (
    restaurant?.translations?.find((item) => item.locale === locale) ||
    restaurant?.translations?.[0] ||
    null
  );
}

function getRestaurantTitle(restaurant) {
  return getTranslation(restaurant)?.title || "Без названия";
}

function getRestaurantType(restaurant) {
  return getTranslation(restaurant)?.type || "—";
}

function getRestaurantCuisine(restaurant) {
  return getTranslation(restaurant)?.cuisine || "—";
}

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRestaurants() {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await fetchAdminRestaurants();

        if (!isMounted) return;

        setRestaurants(data);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить рестораны");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedRestaurants = useMemo(() => {
    return [...restaurants].sort((a, b) => {
      const dateA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [restaurants]);

  async function handleDelete(restaurant) {
    const confirmed = window.confirm(
      `Удалить ресторан «${getRestaurantTitle(restaurant)}»? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    try {
      setDeleteError("");
      setDeletingId(restaurant.id);

      await deleteRestaurantById(restaurant.id);
      setRestaurants((prev) => prev.filter((item) => item.id !== restaurant.id));
    } catch (error) {
      setDeleteError(error.message || "Не удалось удалить ресторан");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Рестораны</h1>
          <p>
            Управление карточками ресторанов, контактами, ценами, топ-блюдами и
            тегами формата.
          </p>
        </div>

        <Link to="/restaurants/create" className="admin-primary-btn">
          Создать ресторан
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
          <p>Загрузка ресторанов...</p>
        </div>
      ) : normalizedRestaurants.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Статус</th>
                <th>Формат</th>
                <th>Кухня</th>
                <th>Цены</th>
                <th>Блюда</th>
                <th>Теги</th>
                <th>Избранное</th>
                <th>Обновлён</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {normalizedRestaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td>{restaurant.id}</td>
                  <td>
                    <div className="admin-table-title-cell">
                      <strong>{getRestaurantTitle(restaurant)}</strong>
                      <span>{restaurant.slug}</span>
                    </div>
                  </td>
                  <td>{getStatusLabel(restaurant.status)}</td>
                  <td>{getRestaurantType(restaurant)}</td>
                  <td>{getRestaurantCuisine(restaurant)}</td>
                  <td>{restaurant.prices?.length || 0}</td>
                  <td>{restaurant.dishes?.length || 0}</td>
                  <td>{restaurant.formats?.length || 0}</td>
                  <td>{restaurant.isFeatured ? "Да" : "Нет"}</td>
                  <td>{formatDate(restaurant.updatedAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/restaurants/${restaurant.id}/edit`}
                        className="admin-secondary-btn"
                      >
                        Редактировать
                      </Link>

                      <button
                        type="button"
                        className="admin-danger-btn"
                        onClick={() => handleDelete(restaurant)}
                        disabled={deletingId === restaurant.id}
                      >
                        {deletingId === restaurant.id ? "Удаление..." : "Удалить"}
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
          <p>Ресторанов пока нет.</p>
        </div>
      )}
    </section>
  );
}

export default RestaurantsPage;