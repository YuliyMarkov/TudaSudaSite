import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventById, updateEventById } from "../api/events";
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

function makeSlug(value = "") {
  const map = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    қ: "q",
    ғ: "g",
    ҳ: "h",
    ў: "o",
  };

  return value
    .toLowerCase()
    .trim()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function toDatetimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (num) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function normalizeSessionsForForm(sessions = []) {
  return sessions.map((session) => ({
    id: session.id,
    startAt: toDatetimeLocal(session.startAt),
    endAt: toDatetimeLocal(session.endAt),
    price: session.price || "",
    ticketUrl: session.ticketUrl || "",
  }));
}

function normalizeSessionsForPayload(sessions = []) {
  return sessions
    .filter((session) => session.startAt)
    .map((session) => ({
      ...(typeof session.id === "number" ? { id: session.id } : {}),
      startAt: new Date(session.startAt).toISOString(),
      endAt: session.endAt ? new Date(session.endAt).toISOString() : null,
      price: session.price?.trim() || null,
      ticketUrl: session.ticketUrl?.trim() || null,
    }));
}

function normalizeGalleryForForm(items = []) {
  return items.map((item) => ({
    id: item.id,
    image: item.image || "",
    sortOrder: Number(item.sortOrder ?? 0),
  }));
}

function normalizeGalleryForPayload(items = []) {
  return items
    .filter((item) => item.image?.trim())
    .map((item) => ({
      ...(typeof item.id === "number" ? { id: item.id } : {}),
      image: item.image.trim(),
      sortOrder: Number(item.sortOrder ?? 0),
    }));
}

function normalizeLocalizedItemsForForm(items = []) {
  return items.map((item) => ({
    id: item.id,
    locale: item.locale,
    value: item.value || "",
    sortOrder: Number(item.sortOrder ?? 0),
  }));
}

function normalizeLocalizedItemsForPayload(items = []) {
  return items
    .filter((item) => item.value?.trim())
    .map((item) => ({
      ...(typeof item.id === "number" ? { id: item.id } : {}),
      locale: item.locale,
      value: item.value.trim(),
      sortOrder: Number(item.sortOrder ?? 0),
    }));
}

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [sessions, setSessions] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [programItems, setProgramItems] = useState([]);
  const [importantInfoItems, setImportantInfoItems] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(true);

  const previewImage = form.coverImage || form.posterImage;

  const previewCategory = form.isForKids
    ? "Для детей"
    : form.type === "concert"
      ? "Концерт"
      : form.type === "theatre"
        ? "Театр"
        : form.type === "exhibition"
          ? "Выставка"
          : form.type === "festival"
            ? "Фестиваль"
            : "Событие";

  const emptyUzCount = useMemo(() => {
    const pairs = [
      ["ruTitle", "uzTitle"],
      ["ruSubtitle", "uzSubtitle"],
      ["ruShortDescription", "uzShortDescription"],
      ["ruDescription", "uzDescription"],
      ["ruAddress", "uzAddress"],
      ["ruVenue", "uzVenue"],
      ["ruDuration", "uzDuration"],
      ["ruAgeLimit", "uzAgeLimit"],
      ["ruTicketPrice", "uzTicketPrice"],
    ];

    return pairs.reduce((count, [ruKey, uzKey]) => {
      if (form[ruKey]?.trim() && !form[uzKey]?.trim()) return count + 1;
      return count;
    }, 0);
  }, [form]);

  useEffect(() => {
    async function loadEvent() {
      try {
        setIsLoading(true);
        setLoadError("");

        const event = await fetchEventById(id);

        const ru =
          event.translations?.find((item) => item.locale === "ru") || null;
        const uz =
          event.translations?.find((item) => item.locale === "uz") || null;

        setForm({
          slug: event.slug || "",
          status: event.status || "draft",
          type: event.type || "other",
          isFeatured: Boolean(event.isFeatured),
          isForKids: Boolean(event.isForKids),
          coverImage: event.coverImage || "",
          posterImage: event.posterImage || "",
          ticketUrl: event.ticketUrl || "",
          mapEmbed: event.mapEmbed || "",
          publishedAt: toDatetimeLocal(event.publishedAt),

          ruTitle: ru?.title || "",
          ruSubtitle: ru?.subtitle || "",
          ruShortDescription: ru?.shortDescription || "",
          ruDescription: ru?.description || "",
          ruAddress: ru?.address || "",
          ruVenue: ru?.venue || "",
          ruDuration: ru?.duration || "",
          ruAgeLimit: ru?.ageLimit || "",
          ruTicketPrice: ru?.ticketPrice || "",
          ruSeoTitle: ru?.seoTitle || "",
          ruSeoDescription: ru?.seoDescription || "",

          uzTitle: uz?.title || "",
          uzSubtitle: uz?.subtitle || "",
          uzShortDescription: uz?.shortDescription || "",
          uzDescription: uz?.description || "",
          uzAddress: uz?.address || "",
          uzVenue: uz?.venue || "",
          uzDuration: uz?.duration || "",
          uzAgeLimit: uz?.ageLimit || "",
          uzTicketPrice: uz?.ticketPrice || "",
          uzSeoTitle: uz?.seoTitle || "",
          uzSeoDescription: uz?.seoDescription || "",
        });

        setIsSlugTouched(Boolean(event.slug));

        setSessions(normalizeSessionsForForm(event.sessions || []));
        setGalleryItems(normalizeGalleryForForm(event.galleryItems || []));
        setProgramItems(normalizeLocalizedItemsForForm(event.programItems || []));
        setImportantInfoItems(
          normalizeLocalizedItemsForForm(event.importantInfoItems || [])
        );

        setIsSeoOpen(
          Boolean(
            ru?.seoTitle ||
              ru?.seoDescription ||
              uz?.seoTitle ||
              uz?.seoDescription
          )
        );

        setIsExtraOpen(
          Boolean(
            event.galleryItems?.length ||
              event.programItems?.length ||
              event.importantInfoItems?.length
          )
        );
      } catch (error) {
        console.error("LOAD EDIT EVENT ERROR:", error);
        setLoadError(error.message || "Не удалось загрузить событие");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "slug") {
        setIsSlugTouched(true);
        next.slug = makeSlug(value);
      }

      if (name === "ruTitle" && !isSlugTouched) {
        next.slug = makeSlug(value);
      }

      return next;
    });
  }

  function copyRuToUz() {
    setForm((prev) => ({
      ...prev,
      uzTitle: prev.uzTitle || prev.ruTitle,
      uzSubtitle: prev.uzSubtitle || prev.ruSubtitle,
      uzShortDescription: prev.uzShortDescription || prev.ruShortDescription,
      uzDescription: prev.uzDescription || prev.ruDescription,
      uzAddress: prev.uzAddress || prev.ruAddress,
      uzVenue: prev.uzVenue || prev.ruVenue,
      uzDuration: prev.uzDuration || prev.ruDuration,
      uzAgeLimit: prev.uzAgeLimit || prev.ruAgeLimit,
      uzTicketPrice: prev.uzTicketPrice || prev.ruTicketPrice,
      uzSeoTitle: prev.uzSeoTitle || prev.ruSeoTitle,
      uzSeoDescription: prev.uzSeoDescription || prev.ruSeoDescription,
    }));
  }

  function regenerateSlug() {
    setForm((prev) => ({
      ...prev,
      slug: makeSlug(prev.ruTitle || prev.uzTitle),
    }));

    setIsSlugTouched(false);
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

      await updateEventById(id, payload);
      navigate("/events");
    } catch (error) {
      console.error("UPDATE EVENT PAGE ERROR:", error);
      setSubmitError(error.message || "Не удалось обновить событие");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-empty">Загрузка события...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="admin-page">
        <div className="admin-error">{loadError}</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Редактировать событие</h1>
          <p className="admin-page-subtitle">Изменение карточки события.</p>
        </div>
      </div>

      {submitError ? <div className="admin-error">{submitError}</div> : null}

      <form className="admin-form" onSubmit={handleSubmit}>
        <section className="admin-form-section">
          <h2>Основные настройки</h2>

          <div className="admin-event-layout">
            <div className="admin-event-main">
              <div className="admin-form-grid admin-form-grid-compact">
                <label className="admin-field admin-field-full">
                  <span>Slug</span>

                  <div className="admin-inline-field">
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      required
                      placeholder="concert-name"
                    />

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={regenerateSlug}
                    >
                      Сгенерировать
                    </button>
                  </div>
                </label>

                <label className="admin-field">
                  <span>Статус</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
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

                <label className="admin-field">
                  <span>Ссылка на билеты</span>
                  <input
                    type="text"
                    name="ticketUrl"
                    value={form.ticketUrl}
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
                  <span>Избранное событие</span>
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
            </div>

            <aside className="admin-event-preview">
              <div className="admin-event-preview-card">
                <div className="admin-event-preview-image">
                  {previewImage ? (
                    <img src={previewImage} alt={form.ruTitle || "Preview"} />
                  ) : (
                    <span>Превью</span>
                  )}

                  <b>{previewCategory}</b>
                </div>

                <div className="admin-event-preview-body">
                  <h3>{form.ruTitle || "Название события"}</h3>
                  <p>
                    {form.ruShortDescription ||
                      form.ruSubtitle ||
                      "Краткое описание появится здесь"}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-section-header">
            <div>
              <h2>Основной контент</h2>
              <p>Заголовок, подзаголовок и описание на двух языках.</p>
            </div>

            <button type="button" className="secondary-btn" onClick={copyRuToUz}>
              Скопировать RU → UZ
            </button>
          </div>

          {emptyUzCount > 0 ? (
            <div className="admin-warning">
              В узбекской версии не заполнено полей: {emptyUzCount}
            </div>
          ) : null}

          <div className="localized-list-grid">
            <div className="localized-list-locale-block">
              <div className="admin-section-header">
                <h3>Русский</h3>
              </div>

              <label className="admin-field">
                <span>Заголовок</span>
                <input
                  type="text"
                  name="ruTitle"
                  value={form.ruTitle}
                  onChange={handleChange}
                  required
                  placeholder="Название события"
                />
              </label>

              <label className="admin-field">
                <span>Подзаголовок</span>
                <input
                  type="text"
                  name="ruSubtitle"
                  value={form.ruSubtitle}
                  onChange={handleChange}
                  placeholder="Короткая подводка"
                />
              </label>

              <label className="admin-field">
                <span>Краткое описание</span>
                <textarea
                  name="ruShortDescription"
                  value={form.ruShortDescription}
                  onChange={handleChange}
                  rows="3"
                  placeholder="1–2 предложения для карточки"
                />
              </label>

              <label className="admin-field">
                <span>Полное описание</span>
                <textarea
                  name="ruDescription"
                  value={form.ruDescription}
                  onChange={handleChange}
                  rows="8"
                />
              </label>
            </div>

            <div className="localized-list-locale-block">
              <div className="admin-section-header">
                <h3>Узбекский</h3>
              </div>

              <label
                className={`admin-field ${
                  form.ruTitle && !form.uzTitle ? "admin-field-missing" : ""
                }`}
              >
                <span>Заголовок</span>
                <input
                  type="text"
                  name="uzTitle"
                  value={form.uzTitle}
                  onChange={handleChange}
                  placeholder="Tadbir nomi"
                />
              </label>

              <label
                className={`admin-field ${
                  form.ruSubtitle && !form.uzSubtitle ? "admin-field-missing" : ""
                }`}
              >
                <span>Подзаголовок</span>
                <input
                  type="text"
                  name="uzSubtitle"
                  value={form.uzSubtitle}
                  onChange={handleChange}
                />
              </label>

              <label
                className={`admin-field ${
                  form.ruShortDescription && !form.uzShortDescription
                    ? "admin-field-missing"
                    : ""
                }`}
              >
                <span>Краткое описание</span>
                <textarea
                  name="uzShortDescription"
                  value={form.uzShortDescription}
                  onChange={handleChange}
                  rows="3"
                />
              </label>

              <label
                className={`admin-field ${
                  form.ruDescription && !form.uzDescription
                    ? "admin-field-missing"
                    : ""
                }`}
              >
                <span>Полное описание</span>
                <textarea
                  name="uzDescription"
                  value={form.uzDescription}
                  onChange={handleChange}
                  rows="8"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>Детали события</h2>

          <div className="localized-list-grid">
            <div className="localized-list-locale-block">
              <div className="admin-section-header">
                <h3>Русский</h3>
              </div>

              <div className="admin-mini-grid">
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
                    placeholder="2 часа"
                  />
                </label>

                <label className="admin-field">
                  <span>Возраст</span>
                  <input
                    type="text"
                    name="ruAgeLimit"
                    value={form.ruAgeLimit}
                    onChange={handleChange}
                    placeholder="12+"
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Цена билета</span>
                <input
                  type="text"
                  name="ruTicketPrice"
                  value={form.ruTicketPrice}
                  onChange={handleChange}
                  placeholder="от 50 000 сумов"
                />
              </label>
            </div>

            <div className="localized-list-locale-block">
              <div className="admin-section-header">
                <h3>Узбекский</h3>
              </div>

              <div className="admin-mini-grid">
                <label
                  className={`admin-field ${
                    form.ruAddress && !form.uzAddress ? "admin-field-missing" : ""
                  }`}
                >
                  <span>Адрес</span>
                  <input
                    type="text"
                    name="uzAddress"
                    value={form.uzAddress}
                    onChange={handleChange}
                  />
                </label>

                <label
                  className={`admin-field ${
                    form.ruVenue && !form.uzVenue ? "admin-field-missing" : ""
                  }`}
                >
                  <span>Площадка</span>
                  <input
                    type="text"
                    name="uzVenue"
                    value={form.uzVenue}
                    onChange={handleChange}
                  />
                </label>

                <label
                  className={`admin-field ${
                    form.ruDuration && !form.uzDuration
                      ? "admin-field-missing"
                      : ""
                  }`}
                >
                  <span>Длительность</span>
                  <input
                    type="text"
                    name="uzDuration"
                    value={form.uzDuration}
                    onChange={handleChange}
                  />
                </label>

                <label
                  className={`admin-field ${
                    form.ruAgeLimit && !form.uzAgeLimit
                      ? "admin-field-missing"
                      : ""
                  }`}
                >
                  <span>Возраст</span>
                  <input
                    type="text"
                    name="uzAgeLimit"
                    value={form.uzAgeLimit}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label
                className={`admin-field ${
                  form.ruTicketPrice && !form.uzTicketPrice
                    ? "admin-field-missing"
                    : ""
                }`}
              >
                <span>Цена билета</span>
                <input
                  type="text"
                  name="uzTicketPrice"
                  value={form.uzTicketPrice}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>Медиа и карта</h2>

          <div className="admin-form-grid">
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
              <span>Код карты / iframe</span>
              <textarea
                name="mapEmbed"
                value={form.mapEmbed}
                onChange={handleChange}
                rows="4"
              />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <EventSessionsEditor value={sessions} onChange={setSessions} />
        </section>

        <button
          type="button"
          className="admin-collapse-btn"
          onClick={() => setIsSeoOpen((prev) => !prev)}
        >
          {isSeoOpen ? "Скрыть SEO" : "Показать SEO"}
        </button>

        {isSeoOpen && (
          <section className="admin-form-section">
            <h2>SEO</h2>

            <div className="admin-locale-grid">
              <div className="admin-locale-column">
                <div className="admin-locale-title">🇷🇺 Русский SEO</div>

                <label className="admin-field">
                  <span>SEO title</span>
                  <input
                    type="text"
                    name="ruSeoTitle"
                    value={form.ruSeoTitle}
                    onChange={handleChange}
                  />
                </label>

                <label className="admin-field">
                  <span>SEO description</span>
                  <textarea
                    name="ruSeoDescription"
                    value={form.ruSeoDescription}
                    onChange={handleChange}
                    rows="3"
                  />
                </label>
              </div>

              <div className="admin-locale-column">
                <div className="admin-locale-title">🇺🇿 O‘zbekcha SEO</div>

                <label className="admin-field">
                  <span>SEO title</span>
                  <input
                    type="text"
                    name="uzSeoTitle"
                    value={form.uzSeoTitle}
                    onChange={handleChange}
                  />
                </label>

                <label className="admin-field">
                  <span>SEO description</span>
                  <textarea
                    name="uzSeoDescription"
                    value={form.uzSeoDescription}
                    onChange={handleChange}
                    rows="3"
                  />
                </label>
              </div>
            </div>
          </section>
        )}

        <button
          type="button"
          className="admin-collapse-btn"
          onClick={() => setIsExtraOpen((prev) => !prev)}
        >
          {isExtraOpen
            ? "Скрыть дополнительные блоки"
            : "Показать галерею, программу и важную информацию"}
        </button>

        {isExtraOpen && (
          <>
            <section className="admin-form-section">
              <EventGalleryEditor
                value={galleryItems}
                onChange={setGalleryItems}
              />
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
          </>
        )}

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
            {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEventPage;