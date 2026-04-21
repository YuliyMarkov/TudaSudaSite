import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteHeroSlideById,
  fetchAdminHeroSlides,
} from "../api/heroSlides";

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

function getTranslation(slide, locale = "ru") {
  return (
    slide?.translations?.find((item) => item.locale === locale) ||
    slide?.translations?.[0] ||
    null
  );
}

function getSlideTitle(slide) {
  return getTranslation(slide)?.title || "Без названия";
}

function HeroSlidesPage() {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSlides() {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await fetchAdminHeroSlides();

        if (!isMounted) return;

        setSlides(data);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error.message || "Не удалось загрузить слайды");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedSlides = useMemo(() => {
    return [...slides].sort((a, b) => {
      const sortA = Number(a?.sortOrder ?? 0);
      const sortB = Number(b?.sortOrder ?? 0);

      if (sortA !== sortB) return sortA - sortB;

      const dateA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      return dateB - dateA;
    });
  }, [slides]);

  async function handleDelete(slide) {
    const confirmed = window.confirm(
      `Удалить слайд «${getSlideTitle(slide)}»? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    try {
      setDeleteError("");
      setDeletingId(slide.id);

      await deleteHeroSlideById(slide.id);
      setSlides((prev) => prev.filter((item) => item.id !== slide.id));
    } catch (error) {
      setDeleteError(error.message || "Не удалось удалить слайд");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Слайдер главной</h1>
          <p>
            Управление верхним слайдером на главной странице: изображения,
            hover-media, ссылки и тексты.
          </p>
        </div>

        <Link to="/hero-slides/create" className="admin-primary-btn">
          Создать слайд
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
          <p>Загрузка слайдов...</p>
        </div>
      ) : normalizedSlides.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Заголовок</th>
                <th>Активен</th>
                <th>Порядок</th>
                <th>Hover type</th>
                <th>Link type</th>
                <th>Link URL</th>
                <th>Обновлён</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {normalizedSlides.map((slide) => (
                <tr key={slide.id}>
                  <td>{slide.id}</td>
                  <td>
                    <div className="admin-table-title-cell">
                      <strong>{getSlideTitle(slide)}</strong>
                      <span>{slide.previewImage || "Без изображения"}</span>
                    </div>
                  </td>
                  <td>{slide.isActive ? "Да" : "Нет"}</td>
                  <td>{slide.sortOrder ?? 0}</td>
                  <td>{slide.hoverMediaType || "image"}</td>
                  <td>{slide.linkType || "custom"}</td>
                  <td>{slide.linkUrl || "—"}</td>
                  <td>{formatDate(slide.updatedAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/hero-slides/${slide.id}/edit`}
                        className="admin-secondary-btn"
                      >
                        Редактировать
                      </Link>

                      <button
                        type="button"
                        className="admin-danger-btn"
                        onClick={() => handleDelete(slide)}
                        disabled={deletingId === slide.id}
                      >
                        {deletingId === slide.id ? "Удаление..." : "Удалить"}
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
          <p>Слайдов пока нет.</p>
        </div>
      )}
    </section>
  );
}

export default HeroSlidesPage;