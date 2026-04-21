import { useMemo } from "react";

const defaultTranslation = {
  title: "",
};

function getTranslationValue(translations, locale) {
  return translations?.[locale] || defaultTranslation;
}

function toInputValue(value) {
  return value ?? "";
}

function ReelEditor({
  form,
  onChange,
  onTranslationChange,
  isSubmitting = false,
  submitLabel = "Сохранить",
}) {
  const ru = useMemo(
    () => getTranslationValue(form.translations, "ru"),
    [form.translations]
  );
  const uz = useMemo(
    () => getTranslationValue(form.translations, "uz"),
    [form.translations]
  );

  const isInstagram = form.sourceType === "instagram";

  return (
    <form className="admin-form" onSubmit={form.onSubmit}>
      <section className="admin-card">
        <h2>Основные настройки</h2>

        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Статус</span>
            <select
              name="isActive"
              value={String(form.isActive)}
              onChange={onChange}
            >
              <option value="true">Активен</option>
              <option value="false">Выключен</option>
            </select>
          </label>

          <label className="admin-field">
            <span>Порядок</span>
            <input
              type="number"
              name="sortOrder"
              value={toInputValue(form.sortOrder)}
              onChange={onChange}
              min="0"
              placeholder="0"
            />
          </label>

          <label className="admin-field">
            <span>Source type</span>
            <select
              name="sourceType"
              value={toInputValue(form.sourceType)}
              onChange={onChange}
            >
              <option value="instagram">instagram</option>
              <option value="video">video</option>
            </select>
          </label>

          <label className="admin-field admin-field--full">
            <span>Обложка</span>
            <input
              type="url"
              name="coverImage"
              value={toInputValue(form.coverImage)}
              onChange={onChange}
              placeholder="https://..."
              required
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>
              {isInstagram
                ? "Ссылка на Instagram Reel"
                : "Ссылка на видео"}
            </span>
            <input
              type="url"
              name="videoUrl"
              value={toInputValue(form.videoUrl)}
              onChange={onChange}
              placeholder={
                isInstagram
                  ? "https://www.instagram.com/reel/..."
                  : "https://...mp4 или .m3u8"
              }
              required
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2>Перевод — Русский</h2>

        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
            <span>Название</span>
            <input
              type="text"
              value={ru.title}
              onChange={(event) =>
                onTranslationChange("ru", "title", event.target.value)
              }
              required
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2>Перевод — Узбекский</h2>

        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
            <span>Название</span>
            <input
              type="text"
              value={uz.title}
              onChange={(event) =>
                onTranslationChange("uz", "title", event.target.value)
              }
            />
          </label>
        </div>
      </section>

      <div className="admin-form-actions">
        <button
          type="submit"
          className="admin-primary-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Сохранение..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ReelEditor;