import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteEventById, fetchAdminEvents } from "../api/events";

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusLabel(status) {
  switch (status) {
    case "published":
      return "Опубликовано";
    case "archived":
      return "Архив";
    case "draft":
    default:
      return "Черновик";
  }
}

function getTypeLabel(type) {
  switch (type) {
    case "concert":
      return "Концерт";
    case "theatre":
      return "Театр";
    case "exhibition":
      return "Выставка";
    case "kids":
      return "Детям";
    case "festival":
      return "Фестиваль";
    case "standup":
      return "Стендап";
    case "masterclass":
      return "Мастер-класс";
    default:
      return "Другое";
  }
}

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await fetchAdminEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD ADMIN EVENTS ERROR:", error);
        setLoadError(error.message || "Не удалось загрузить события");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  const normalizedEvents = useMemo(() => {
    return events.map((item) => {
      const translation =
        item.translations?.find((entry) => entry.locale === "ru") ||
        item.translations?.[0] ||
        null;

      return {
        id: item.id,
        slug: item.slug,
        status: item.status,
        type: item.type,
        isFeatured: Boolean(item.isFeatured),
        publishedAt: item.publishedAt,
        updatedAt: item.updatedAt,
        title: translation?.title || "Без названия",
      };
    });
  }, [events]);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Удалить событие? Это действие нельзя отменить."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setDeleteError("");

      await deleteEventById(id);

      setEvents((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);
      setDeleteError(error.message || "Не удалось удалить событие");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>События</h1>
          <p className="admin-page-subtitle">
            Управление концертами, выставками, спектаклями и другими событиями.
          </p>
        </div>

        <Link to="/events/create" className="primary-btn">
          Создать событие
        </Link>
      </div>

      {loadError ? <div className="admin-error">{loadError}</div> : null}
      {deleteError ? <div className="admin-error">{deleteError}</div> : null}

      {isLoading ? (
        <div className="admin-empty">Загрузка событий...</div>
      ) : normalizedEvents.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Заголовок</th>
                <th>Slug</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Избранное</th>
                <th>Дата публикации</th>
                <th>Обновлено</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {normalizedEvents.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.slug}</td>
                  <td>{getTypeLabel(item.type)}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td>{item.isFeatured ? "Да" : "Нет"}</td>
                  <td>{formatDate(item.publishedAt)}</td>
                  <td>{formatDate(item.updatedAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/events/${item.id}/edit`}
                        className="secondary-btn"
                      >
                        Редактировать
                      </Link>

                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? "Удаление..." : "Удалить"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">Событий пока нет.</div>
      )}
    </div>
  );
}

export default EventsPage;