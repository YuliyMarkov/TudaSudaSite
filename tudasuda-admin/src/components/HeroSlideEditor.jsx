import { useMemo } from "react";

const defaultTranslation = {
  title: "",
  subtitle: "",
};

function getTranslationValue(translations, locale) {
  return translations?.[locale] || defaultTranslation;
}

function toInputValue(value) {
  return value ?? "";
}

function HeroSlideEditor({
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

  return (
    <form className="admin-form" onSubmit={form.onSubmit}>
      <section className="admin-card">
        <h2>Основные настройки</h2>

        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Статус</span>
            <select name="isActive" value={String(form.isActive)} onChange={onChange}>
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

          <label className="admin-field admin-field--full">
            <span>Preview image</span>
            <input
              type="url"
              name="previewImage"
              value={toInputValue(form.previewImage)}
              onChange={onChange}
              placeholder="https://..."
              required
            />
          </label>

          <label className="admin-field">
            <span>Hover media type</span>
            <select
              name="hoverMediaType"
              value={toInputValue(form.hoverMediaType)}
              onChange={onChange}
            >
              <option value="image">image</option>
              <option value="video">video</option>
            </select>
          </label>

          <label className="admin-field admin-field--full">
            <span>Hover media URL</span>
            <input
              type="url"
              name="hoverMediaUrl"
              value={toInputValue(form.hoverMediaUrl)}
              onChange={onChange}
              placeholder="https://... (для video или отдельной hover-картинки)"
            />
          </label>

          <label className="admin-field">
            <span>Link type</span>
            <select
              name="linkType"
              value={toInputValue(form.linkType)}
              onChange={onChange}
            >
              <option value="custom">custom</option>
              <option value="stories">stories</option>
              <option value="movies/cinema">movies/cinema</option>
              <option value="event">event</option>
              <option value="concerts">concerts</option>
              <option value="theatre">theatre</option>
              <option value="exhibitions">exhibitions</option>
              <option value="kids">kids</option>
              <option value="restaurants">restaurants</option>
              <option value="places">places</option>
            </select>
          </label>

          <label className="admin-field admin-field--full">
            <span>Link URL</span>
            <input
              type="text"
              name="linkUrl"
              value={toInputValue(form.linkUrl)}
              onChange={onChange}
              placeholder="/ru/movies/... или https://... или slug/route"
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2>Перевод — Русский</h2>

        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
            <span>Заголовок</span>
            <input
              type="text"
              value={ru.title}
              onChange={(event) =>
                onTranslationChange("ru", "title", event.target.value)
              }
              required
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Подзаголовок</span>
            <textarea
              rows="4"
              value={ru.subtitle}
              onChange={(event) =>
                onTranslationChange("ru", "subtitle", event.target.value)
              }
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2>Перевод — Узбекский</h2>

        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
            <span>Заголовок</span>
            <input
              type="text"
              value={uz.title}
              onChange={(event) =>
                onTranslationChange("uz", "title", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Подзаголовок</span>
            <textarea
              rows="4"
              value={uz.subtitle}
              onChange={(event) =>
                onTranslationChange("uz", "subtitle", event.target.value)
              }
            />
          </label>
        </div>
      </section>

      <div className="admin-form-actions">
        <button type="submit" className="admin-primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default HeroSlideEditor;