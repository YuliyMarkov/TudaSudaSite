import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/events";
import EventSessionsEditor from "../components/EventSessionsEditor";
import EventGalleryEditor from "../components/EventGalleryEditor";
import LocalizedTextListEditor from "../components/LocalizedTextListEditor";

const initialForm = {
  slug: "",
  status: "draft",
  type: "other",
  isFeatured: false,
  isForKids: false,
  coverImage: "",
  posterImage: "",
  ticketUrl: "",
  mapEmbed: "",
  publishedAt: "",

  ruTitle: "",
  ruSubtitle: "",
  ruShortDescription: "",
  ruDescription: "",
  ruAddress: "",
  ruVenue: "",
  ruDuration: "",
  ruAgeLimit: "",
  ruTicketPrice: "",
  ruSeoTitle: "",
  ruSeoDescription: "",

  uzTitle: "",
  uzSubtitle: "",
  uzShortDescription: "",
  uzDescription: "",
  uzAddress: "",
  uzVenue: "",
  uzDuration: "",
  uzAgeLimit: "",
  uzTicketPrice: "",
  uzSeoTitle: "",
  uzSeoDescription: "",
};

function normalizeSessionsForPayload(sessions = []) {
  return sessions
    .filter((session) => session.startAt)
    .map((session) => ({
      startAt: new Date(session.startAt).toISOString(),
      endAt: session.endAt ? new Date(session.endAt).toISOString() : null,
      price: session.price?.trim() || null,
      ticketUrl: session.ticketUrl?.trim() || null,
    }));
}

function normalizeGalleryForPayload(items = []) {
  return items
    .filter((item) => item.image?.trim())
    .map((item) => ({
      image: item.image.trim(),
      sortOrder: Number(item.sortOrder ?? 0),
    }));
}

function normalizeLocalizedItemsForPayload(items = []) {
  return items
    .filter((item) => item.value?.trim())
    .map((item) => ({
      locale: item.locale,
      value: item.value.trim(),
      sortOrder: Number(item.sortOrder ?? 0),
    }));
}

function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [sessions, setSessions] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [programItems, setProgramItems] = useState([]);
  const [importantInfoItems, setImportantInfoItems] = useState([]);
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
        isForKids: form.isForKids,
        coverImage: form.coverImage.trim() || null,
        posterImage: form.posterImage.trim() || null,
        ticketUrl: form.ticketUrl.trim() || null,
        mapEmbed: form.mapEmbed.trim() || null,
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : null,
        sessions: normalizeSessionsForPayload(sessions),
        galleryItems: normalizeGalleryForPayload(galleryItems),
        programItems: normalizeLocalizedItemsForPayload(programItems),
        importantInfoItems: normalizeLocalizedItemsForPayload(importantInfoItems),
        translations: [
          {
            locale: "ru",
            title: form.ruTitle.trim(),
            subtitle: form.ruSubtitle.trim() || null,
            shortDescription: form.ruShortDescription.trim() || null,
            description: form.ruDescription.trim() || null,
            address: form.ruAddress.trim() || null,
            venue: form.ruVenue.trim() || null,
            duration: form.ruDuration.trim() || null,
            ageLimit: form.ruAgeLimit.trim() || null,
            ticketPrice: form.ruTicketPrice.trim() || null,
            seoTitle: form.ruSeoTitle.trim() || null,
            seoDescription: form.ruSeoDescription.trim() || null,
          },
          {
            locale: "uz",
            title: form.uzTitle.trim() || "",
            subtitle: form.uzSubtitle.trim() || null,
            shortDescription: form.uzShortDescription.trim() || null,
            description: form.uzDescription.trim() || null,
            address: form.uzAddress.trim() || null,
            venue: form.uzVenue.trim() || null,
            duration: form.uzDuration.trim() || null,
            ageLimit: form.uzAgeLimit.trim() || null,
            ticketPrice: form.uzTicketPrice.trim() || null,
            seoTitle: form.uzSeoTitle.trim() || null,
            seoDescription: form.uzSeoDescription.trim() || null,
          },
        ],
      };

      await createEvent(payload);
      navigate("/events");
    } catch (error) {
      console.error("CREATE EVENT PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось создать событие");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Создать событие</h1>
          <p className="admin-page-subtitle">
            Новый концерт, спектакль, выставка или другое событие.
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
                required
              />
            </label>

            <label className="admin-field">
              <span>Статус</span>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Черновик</option>
                <option value="published">Опубликовано</option>
                <option value="archived">Архив</option>
              </select>
            </label>

            <label className="admin-field">
              <span>Тип события</span>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="concert">Концерт</option>
                <option value="theatre">Театр</option>
                <option value="exhibition">Выставка</option>
                <option value="kids">Детям</option>
                <option value="festival">Фестиваль</option>
                <option value="standup">Стендап</option>
                <option value="masterclass">Мастер-класс</option>
                <option value="other">Другое</option>
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

            <label className="admin-field admin-field-full">
              <span>Постер (URL)</span>
              <input
                type="text"
                name="posterImage"
                value={form.posterImage}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Ссылка на билеты</span>
              <input
                type="text"
                name="ticketUrl"
                value={form.ticketUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Код карты / iframe</span>
              <textarea
                name="mapEmbed"
                value={form.mapEmbed}
                onChange={handleChange}
                rows="4"
              />
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              <span>Показывать как избранное событие</span>
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="isForKids"
                checked={form.isForKids}
                onChange={handleChange}
              />
              <span>Событие для детей</span>
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
              <span>Подзаголовок</span>
              <input
                type="text"
                name="ruSubtitle"
                value={form.ruSubtitle}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Краткое описание</span>
              <textarea
                name="ruShortDescription"
                value={form.ruShortDescription}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Полное описание</span>
              <textarea
                name="ruDescription"
                value={form.ruDescription}
                onChange={handleChange}
                rows="10"
              />
            </label>

            <label className="admin-field">
              <span>Адрес</span>
              <input
                type="text"
                name="ruAddress"
                value={form.ruAddress}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field">
              <span>Площадка</span>
              <input
                type="text"
                name="ruVenue"
                value={form.ruVenue}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field">
              <span>Длительность</span>
              <input
                type="text"
                name="ruDuration"
                value={form.ruDuration}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field">
              <span>Возрастное ограничение</span>
              <input
                type="text"
                name="ruAgeLimit"
                value={form.ruAgeLimit}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Цена билета</span>
              <input
                type="text"
                name="ruTicketPrice"
                value={form.ruTicketPrice}
                onChange={handleChange}
              />
            </label>

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
              <span>Подзаголовок</span>
              <input
                type="text"
                name="uzSubtitle"
                value={form.uzSubtitle}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Краткое описание</span>
              <textarea
                name="uzShortDescription"
                value={form.uzShortDescription}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Полное описание</span>
              <textarea
                name="uzDescription"
                value={form.uzDescription}
                onChange={handleChange}
                rows="10"
              />
            </label>

            <label className="admin-field">
              <span>Адрес</span>
              <input
                type="text"
                name="uzAddress"
                value={form.uzAddress}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field">
              <span>Площадка</span>
              <input
                type="text"
                name="uzVenue"
                value={form.uzVenue}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field">
              <span>Длительность</span>
              <input
                type="text"
                name="uzDuration"
                value={form.uzDuration}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field">
              <span>Возрастное ограничение</span>
              <input
                type="text"
                name="uzAgeLimit"
                value={form.uzAgeLimit}
                onChange={handleChange}
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Цена билета</span>
              <input
                type="text"
                name="uzTicketPrice"
                value={form.uzTicketPrice}
                onChange={handleChange}
              />
            </label>

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

        <section className="admin-form-section">
          <EventSessionsEditor value={sessions} onChange={setSessions} />
        </section>

        <section className="admin-form-section">
          <EventGalleryEditor value={galleryItems} onChange={setGalleryItems} />
        </section>

        <section className="admin-form-section">
          <LocalizedTextListEditor
            title="Программа события"
            subtitle="Пункты программы для русского и узбекского языков."
            value={programItems}
            onChange={setProgramItems}
          />
        </section>

        <section className="admin-form-section">
          <LocalizedTextListEditor
            title="Важная информация"
            subtitle="Полезные уточнения и организационные детали."
            value={importantInfoItems}
            onChange={setImportantInfoItems}
          />
        </section>

        <div className="admin-form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/events")}
            disabled={isSubmitting}
          >
            Отмена
          </button>

          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение..." : "Создать событие"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEventPage;