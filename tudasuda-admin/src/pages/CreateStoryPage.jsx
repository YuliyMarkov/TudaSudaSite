import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStory } from "../api/stories";
import StoryEditor from "../components/StoryEditor";

const emptyEditorValue = {
  json: {
    type: "doc",
    content: [{ type: "paragraph" }],
  },
  html: "<p></p>",
};

const initialForm = {
  slug: "",
  status: "draft",
  type: "news",
  isFeatured: false,
  coverImage: "",
  publishedAt: "",
  ruTitle: "",
  ruExcerpt: "",
  ruSeoTitle: "",
  ruSeoDescription: "",
  uzTitle: "",
  uzExcerpt: "",
  uzSeoTitle: "",
  uzSeoDescription: "",
};

function CreateStoryPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [ruEditor, setRuEditor] = useState(emptyEditorValue);
  const [uzEditor, setUzEditor] = useState(emptyEditorValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = {
        slug: form.slug.trim(),
        status: form.status,
        type: form.type,
        isFeatured: form.isFeatured,
        coverImage: form.coverImage.trim() || null,
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : null,
        translations: [
          {
            locale: "ru",
            title: form.ruTitle.trim(),
            excerpt: form.ruExcerpt.trim() || null,
            content: ruEditor.html || null,
            contentJson: ruEditor.json || null,
            seoTitle: form.ruSeoTitle.trim() || null,
            seoDescription: form.ruSeoDescription.trim() || null,
          },
          {
            locale: "uz",
            title: form.uzTitle.trim() || "",
            excerpt: form.uzExcerpt.trim() || null,
            content: uzEditor.html || null,
            contentJson: uzEditor.json || null,
            seoTitle: form.uzSeoTitle.trim() || null,
            seoDescription: form.uzSeoDescription.trim() || null,
          },
        ],
      };

      await createStory(payload);
      navigate("/stories");
    } catch (error) {
      console.error("CREATE STORY PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось создать материал");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Создать материал</h1>
          <p className="admin-page-subtitle">
            Новый материал для раздела новостей и статей.
          </p>
        </div>
      </div>

      {submitError ? <div className="admin-error">{submitError}</div> : null}

      <form className="admin-form" onSubmit={handleSubmit}>
        <section className="admin-form-section">
          <h2>Основные настройки</h2>

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Slug</span>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="naprimer-broadway-v-tashkente"
                required
              />
            </label>

            <label className="admin-field">
              <span>Статус</span>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Черновик</option>
                <option value="published">Опубликован</option>
                <option value="archived">Архив</option>
              </select>
            </label>

            <label className="admin-field">
              <span>Тип</span>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="news">Новость</option>
                <option value="article">Статья</option>
              </select>
            </label>

            <label className="admin-field">
              <span>Дата публикации</span>
              <input
                type="datetime-local"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Обложка (URL)</span>
              <input
                type="text"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              <span>Показывать как избранный материал</span>
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>Русский язык</h2>

          <div className="admin-form-grid">
            <label className="admin-field admin-field-full">
              <span>Заголовок</span>
              <input
                type="text"
                name="ruTitle"
                value={form.ruTitle}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Краткое описание</span>
              <textarea
                name="ruExcerpt"
                value={form.ruExcerpt}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <div className="admin-field admin-field-full">
              <StoryEditor
                label="Полный текст"
                value={ruEditor}
                onChange={setRuEditor}
              />
            </div>

            <label className="admin-field admin-field-full">
              <span>SEO title</span>
              <input
                type="text"
                name="ruSeoTitle"
                value={form.ruSeoTitle}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>SEO description</span>
              <textarea
                name="ruSeoDescription"
                value={form.ruSeoDescription}
                onChange={handleChange}
                rows="3"
              />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>Узбекский язык</h2>

          <div className="admin-form-grid">
            <label className="admin-field admin-field-full">
              <span>Заголовок</span>
              <input
                type="text"
                name="uzTitle"
                value={form.uzTitle}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Краткое описание</span>
              <textarea
                name="uzExcerpt"
                value={form.uzExcerpt}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <div className="admin-field admin-field-full">
              <StoryEditor
                label="Полный текст"
                value={uzEditor}
                onChange={setUzEditor}
              />
            </div>

            <label className="admin-field admin-field-full">
              <span>SEO title</span>
              <input
                type="text"
                name="uzSeoTitle"
                value={form.uzSeoTitle}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>SEO description</span>
              <textarea
                name="uzSeoDescription"
                value={form.uzSeoDescription}
                onChange={handleChange}
                rows="3"
              />
            </label>
          </div>
        </section>

        <div className="admin-form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/stories")}
            disabled={isSubmitting}
          >
            Отмена
          </button>

          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение..." : "Создать материал"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateStoryPage;