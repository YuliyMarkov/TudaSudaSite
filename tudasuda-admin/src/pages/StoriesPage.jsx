import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteStoryById, fetchAdminStories } from "../api/stories";

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
      return "Опубликован";
    case "archived":
      return "Архив";
    case "draft":
    default:
      return "Черновик";
  }
}

function getTypeLabel(type) {
  switch (type) {
    case "article":
      return "Статья";
    case "news":
    default:
      return "Новость";
  }
}

function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadStories() {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await fetchAdminStories();
        setStories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LOAD ADMIN STORIES ERROR:", error);
        setLoadError(error.message || "Не удалось загрузить материалы");
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStories();
  }, []);

  const normalizedStories = useMemo(() => {
    return stories.map((item) => {
      const translation =
        item.translations?.find((entry) => entry.locale === "ru") ||
        item.translations?.[0] ||
        null;

      return {
        id: item.id,
        slug: item.slug,
        status: item.status,
        type: item.type || "news",
        isFeatured: Boolean(item.isFeatured),
        publishedAt: item.publishedAt,
        updatedAt: item.updatedAt,
        title: translation?.title || "Без названия",
      };
    });
  }, [stories]);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Удалить материал? Это действие нельзя отменить."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setDeleteError("");

      await deleteStoryById(id);

      setStories((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("DELETE STORY ERROR:", error);
      setDeleteError(error.message || "Не удалось удалить материал");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Материалы</h1>
          <p className="admin-page-subtitle">
            Управление новостями и статьями сайта.
          </p>
        </div>

        <Link to="/stories/create" className="primary-btn">
          Создать материал
        </Link>
      </div>

      {loadError ? <div className="admin-error">{loadError}</div> : null}
      {deleteError ? <div className="admin-error">{deleteError}</div> : null}

      {isLoading ? (
        <div className="admin-empty">Загрузка материалов...</div>
      ) : normalizedStories.length ? (
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
                <th>Обновлён</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {normalizedStories.map((item) => (
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
                        to={`/stories/${item.id}/edit`}
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
        <div className="admin-empty">Материалов пока нет.</div>
      )}
    </div>
  );
}

export default StoriesPage;