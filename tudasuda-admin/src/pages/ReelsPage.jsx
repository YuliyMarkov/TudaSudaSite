import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteReelById, fetchAdminReels } from "../api/reels";

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

function getTranslation(reel, locale = "ru") {
  return (
    reel?.translations?.find((item) => item.locale === locale) ||
    reel?.translations?.[0] ||
    null
  );
}

function getReelTitle(reel) {
  return getTranslation(reel)?.title || "Без названия";
}

function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReels() {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await fetchAdminReels();

        if (!isMounted) return;

        setReels(data);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить рилсы");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReels();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedReels = useMemo(() => {
    return [...reels].sort((a, b) => {
      const sortA = Number(a?.sortOrder ?? 0);
      const sortB = Number(b?.sortOrder ?? 0);

      if (sortA !== sortB) return sortA - sortB;

      const dateA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      return dateB - dateA;
    });
  }, [reels]);

  async function handleDelete(reel) {
    const confirmed = window.confirm(
      `Удалить рилс «${getReelTitle(reel)}»? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    try {
      setDeleteError("");
      setDeletingId(reel.id);

      await deleteReelById(reel.id);
      setReels((prev) => prev.filter((item) => item.id !== reel.id));
    } catch (error) {
      setDeleteError(error.message || "Не удалось удалить рилс");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Рилсы</h1>
          <p>
            Управление блоком reels на главной: обложка, видео, порядок и
            заголовки.
          </p>
        </div>

        <Link to="/reels/create" className="admin-primary-btn">
          Создать рилс
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
          <p>Загрузка рилсов...</p>
        </div>
      ) : normalizedReels.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Активен</th>
                <th>Порядок</th>
                <th>Source type</th>
                <th>Видео</th>
                <th>Обновлён</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {normalizedReels.map((reel) => (
                <tr key={reel.id}>
                  <td>{reel.id}</td>
                  <td>
                    <div className="admin-table-title-cell">
                      <strong>{getReelTitle(reel)}</strong>
                      <span>{reel.coverImage || "Без обложки"}</span>
                    </div>
                  </td>
                  <td>{reel.isActive ? "Да" : "Нет"}</td>
                  <td>{reel.sortOrder ?? 0}</td>
                  <td>{reel.sourceType || "video"}</td>
                  <td>{reel.videoUrl || "—"}</td>
                  <td>{formatDate(reel.updatedAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/reels/${reel.id}/edit`}
                        className="admin-secondary-btn"
                      >
                        Редактировать
                      </Link>

                      <button
                        type="button"
                        className="admin-danger-btn"
                        onClick={() => handleDelete(reel)}
                        disabled={deletingId === reel.id}
                      >
                        {deletingId === reel.id ? "Удаление..." : "Удалить"}
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
          <p>Рилсов пока нет.</p>
        </div>
      )}
    </section>
  );
}

export default ReelsPage;