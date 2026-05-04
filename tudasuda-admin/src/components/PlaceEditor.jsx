import { useMemo } from "react";

const defaultTranslation = {
  title: "",
  subtitle: "",
  type: "",
  category: "",
  address: "",
  workingHours: "",
  priceLabel: "",
  description: "",
  features: "",
  mustVisit: "",
  seoTitle: "",
  seoDescription: "",
};

function getTranslationValue(translations, locale) {
  return translations?.[locale] || defaultTranslation;
}

function toInputValue(value) {
  return value ?? "";
}

function PlaceEditor({
  form,
  onChange,
  onTranslationChange,
  onPriceChange,
  addPriceItem,
  removePriceItem,
  onHighlightChange,
  addHighlightItem,
  removeHighlightItem,
  onSuitableForChange,
  addSuitableForItem,
  removeSuitableForItem,
  isSubmitting = false,
  submitLabel = "Сохранить",
  onRegenerateSlug,
  onCopyRuToUz,
  emptyUzCount = 0,
  isSeoOpen = false,
  setIsSeoOpen,
  isExtraOpen = false,
  setIsExtraOpen,
  onCancel,
}) {
  const ru = useMemo(
    () => getTranslationValue(form.translations, "ru"),
    [form.translations],
  );

  const uz = useMemo(
    () => getTranslationValue(form.translations, "uz"),
    [form.translations],
  );

  const previewImage = form.coverImage;

  const highlightGroups = useMemo(() => {
    return Array.from(
      new Set(form.highlights.map((item) => Number(item.sortOrder ?? 0))),
    );
  }, [form.highlights]);

  const priceGroups = useMemo(() => {
    return Array.from(
      new Set(form.prices.map((item) => Number(item.sortOrder ?? 0))),
    );
  }, [form.prices]);

  const suitableForGroups = useMemo(() => {
    return Array.from(
      new Set(form.suitableFor.map((item) => Number(item.sortOrder ?? 0))),
    );
  }, [form.suitableFor]);

  return (
    <form className="admin-form" onSubmit={form.onSubmit}>
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
                    onChange={onChange}
                    placeholder="например: broadway-tashkent"
                    required
                  />

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={onRegenerateSlug}
                  >
                    Сгенерировать
                  </button>
                </div>
              </label>

              <label className="admin-field">
                <span>Статус</span>
                <select name="status" value={form.status} onChange={onChange}>
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликован</option>
                  <option value="archived">Архив</option>
                </select>
              </label>

              <label className="admin-field">
                <span>Телефон</span>
                <input
                  type="text"
                  name="phone"
                  value={toInputValue(form.phone)}
                  onChange={onChange}
                  placeholder="+998 ..."
                />
              </label>

              <label className="admin-field">
                <span>Instagram</span>
                <input
                  type="url"
                  name="instagram"
                  value={toInputValue(form.instagram)}
                  onChange={onChange}
                  placeholder="https://instagram.com/..."
                />
              </label>

              <label className="admin-field">
                <span>Telegram</span>
                <input
                  type="url"
                  name="telegram"
                  value={toInputValue(form.telegram)}
                  onChange={onChange}
                  placeholder="https://t.me/..."
                />
              </label>

              <label className="admin-field">
                <span>Сайт</span>
                <input
                  type="url"
                  name="website"
                  value={toInputValue(form.website)}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </label>

              <label className="admin-field admin-field--checkbox">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={Boolean(form.isFeatured)}
                  onChange={onChange}
                />
                <span>Показывать в избранном</span>
              </label>
            </div>
          </div>

          <aside className="admin-event-preview">
            <div className="admin-event-preview-card">
              <div className="admin-event-preview-image">
                {previewImage ? (
                  <img src={previewImage} alt={ru.title || "Preview"} />
                ) : (
                  <span>Превью</span>
                )}

                <b>{ru.category || "Место"}</b>
              </div>

              <div className="admin-event-preview-body">
                <h3>{ru.title || "Название места"}</h3>
                <p>
                  {ru.subtitle ||
                    ru.address ||
                    "Краткое описание появится здесь"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Удобства</h2>

        <div className="admin-form-grid">
          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="parking"
              checked={Boolean(form.parking)}
              onChange={onChange}
            />
            <span>Парковка</span>
          </label>

          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="wifi"
              checked={Boolean(form.wifi)}
              onChange={onChange}
            />
            <span>Wi-Fi</span>
          </label>

          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="booking"
              checked={Boolean(form.booking)}
              onChange={onChange}
            />
            <span>Бронь</span>
          </label>

          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="family"
              checked={Boolean(form.family)}
              onChange={onChange}
            />
            <span>С детьми</span>
          </label>

          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="terrace"
              checked={Boolean(form.terrace)}
              onChange={onChange}
            />
            <span>Открытая зона</span>
          </label>

          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="photoZone"
              checked={Boolean(form.photoZone)}
              onChange={onChange}
            />
            <span>Фото-зоны</span>
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-section-header">
          <div>
            <h2>Основной контент</h2>
            <p>Название, подзаголовок и описание на двух языках.</p>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={onCopyRuToUz}
          >
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

            <label className="admin-field">
              <span>Подзаголовок</span>
              <input
                type="text"
                value={ru.subtitle}
                onChange={(event) =>
                  onTranslationChange("ru", "subtitle", event.target.value)
                }
              />
            </label>

            <label className="admin-field">
              <span>Описание</span>
              <textarea
                rows="8"
                value={ru.description}
                onChange={(event) =>
                  onTranslationChange("ru", "description", event.target.value)
                }
              />
            </label>

            <label className="admin-field">
              <span>Что здесь особенно</span>
              <textarea
                rows="4"
                value={ru.features}
                onChange={(event) =>
                  onTranslationChange("ru", "features", event.target.value)
                }
              />
            </label>

            <label className="admin-field">
              <span>Зачем сюда идти</span>
              <textarea
                rows="4"
                value={ru.mustVisit}
                onChange={(event) =>
                  onTranslationChange("ru", "mustVisit", event.target.value)
                }
              />
            </label>
          </div>

          <div className="localized-list-locale-block">
            <div className="admin-section-header">
              <h3>Узбекский</h3>
            </div>

            <label
              className={`admin-field ${
                ru.title && !uz.title ? "admin-field-missing" : ""
              }`}
            >
              <span>Название</span>
              <input
                type="text"
                value={uz.title}
                onChange={(event) =>
                  onTranslationChange("uz", "title", event.target.value)
                }
              />
            </label>

            <label
              className={`admin-field ${
                ru.subtitle && !uz.subtitle ? "admin-field-missing" : ""
              }`}
            >
              <span>Подзаголовок</span>
              <input
                type="text"
                value={uz.subtitle}
                onChange={(event) =>
                  onTranslationChange("uz", "subtitle", event.target.value)
                }
              />
            </label>

            <label
              className={`admin-field ${
                ru.description && !uz.description ? "admin-field-missing" : ""
              }`}
            >
              <span>Описание</span>
              <textarea
                rows="8"
                value={uz.description}
                onChange={(event) =>
                  onTranslationChange("uz", "description", event.target.value)
                }
              />
            </label>

            <label
              className={`admin-field ${
                ru.features && !uz.features ? "admin-field-missing" : ""
              }`}
            >
              <span>Что здесь особенно</span>
              <textarea
                rows="4"
                value={uz.features}
                onChange={(event) =>
                  onTranslationChange("uz", "features", event.target.value)
                }
              />
            </label>

            <label
              className={`admin-field ${
                ru.mustVisit && !uz.mustVisit ? "admin-field-missing" : ""
              }`}
            >
              <span>Зачем сюда идти</span>
              <textarea
                rows="4"
                value={uz.mustVisit}
                onChange={(event) =>
                  onTranslationChange("uz", "mustVisit", event.target.value)
                }
              />
            </label>
          </div>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Детали места</h2>

        <div className="localized-list-grid">
          <div className="localized-list-locale-block">
            <div className="admin-section-header">
              <h3>Русский</h3>
            </div>

            <div className="admin-mini-grid">
              <label className="admin-field">
                <span>Формат</span>
                <input
                  type="text"
                  value={ru.type}
                  onChange={(event) =>
                    onTranslationChange("ru", "type", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>Категория</span>
                <input
                  type="text"
                  value={ru.category}
                  onChange={(event) =>
                    onTranslationChange("ru", "category", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>Режим работы</span>
                <input
                  type="text"
                  value={ru.workingHours}
                  onChange={(event) =>
                    onTranslationChange(
                      "ru",
                      "workingHours",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="admin-field">
                <span>Короткая цена</span>
                <input
                  type="text"
                  value={ru.priceLabel}
                  onChange={(event) =>
                    onTranslationChange("ru", "priceLabel", event.target.value)
                  }
                  placeholder="Бесплатно / от 50 000 сумов"
                />
              </label>
            </div>

            <label className="admin-field">
              <span>Адрес</span>
              <input
                type="text"
                value={ru.address}
                onChange={(event) =>
                  onTranslationChange("ru", "address", event.target.value)
                }
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
                  ru.type && !uz.type ? "admin-field-missing" : ""
                }`}
              >
                <span>Формат</span>
                <input
                  type="text"
                  value={uz.type}
                  onChange={(event) =>
                    onTranslationChange("uz", "type", event.target.value)
                  }
                />
              </label>

              <label
                className={`admin-field ${
                  ru.category && !uz.category ? "admin-field-missing" : ""
                }`}
              >
                <span>Категория</span>
                <input
                  type="text"
                  value={uz.category}
                  onChange={(event) =>
                    onTranslationChange("uz", "category", event.target.value)
                  }
                />
              </label>

              <label
                className={`admin-field ${
                  ru.workingHours && !uz.workingHours
                    ? "admin-field-missing"
                    : ""
                }`}
              >
                <span>Режим работы</span>
                <input
                  type="text"
                  value={uz.workingHours}
                  onChange={(event) =>
                    onTranslationChange(
                      "uz",
                      "workingHours",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label
                className={`admin-field ${
                  ru.priceLabel && !uz.priceLabel ? "admin-field-missing" : ""
                }`}
              >
                <span>Короткая цена</span>
                <input
                  type="text"
                  value={uz.priceLabel}
                  onChange={(event) =>
                    onTranslationChange("uz", "priceLabel", event.target.value)
                  }
                />
              </label>
            </div>

            <label
              className={`admin-field ${
                ru.address && !uz.address ? "admin-field-missing" : ""
              }`}
            >
              <span>Адрес</span>
              <input
                type="text"
                value={uz.address}
                onChange={(event) =>
                  onTranslationChange("uz", "address", event.target.value)
                }
              />
            </label>
          </div>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Медиа и карта</h2>

        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
            <span>Обложка</span>
            <input
              type="url"
              name="coverImage"
              value={toInputValue(form.coverImage)}
              onChange={onChange}
              placeholder="https://..."
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Карта / iframe embed</span>
            <textarea
              rows="4"
              name="mapEmbed"
              value={toInputValue(form.mapEmbed)}
              onChange={onChange}
              placeholder="<iframe ...></iframe>"
            />
          </label>
        </div>
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
                  value={ru.seoTitle}
                  onChange={(event) =>
                    onTranslationChange("ru", "seoTitle", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>SEO description</span>
                <textarea
                  rows="3"
                  value={ru.seoDescription}
                  onChange={(event) =>
                    onTranslationChange(
                      "ru",
                      "seoDescription",
                      event.target.value,
                    )
                  }
                />
              </label>
            </div>

            <div className="admin-locale-column">
              <div className="admin-locale-title">🇺🇿 O‘zbekcha SEO</div>

              <label className="admin-field">
                <span>SEO title</span>
                <input
                  type="text"
                  value={uz.seoTitle}
                  onChange={(event) =>
                    onTranslationChange("uz", "seoTitle", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>SEO description</span>
                <textarea
                  rows="3"
                  value={uz.seoDescription}
                  onChange={(event) =>
                    onTranslationChange(
                      "uz",
                      "seoDescription",
                      event.target.value,
                    )
                  }
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
          : "Показать цены, highlights и теги"}
      </button>

      {isExtraOpen && (
        <>
          <section className="admin-form-section">
            <div className="admin-section-header">
              <div>
                <h2>Цены</h2>
                <p>Одна цена — тексты RU/UZ в одной карточке.</p>
              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={addPriceItem}
              >
                Добавить цену
              </button>
            </div>

            <div className="admin-stack">
              {priceGroups.length ? (
                priceGroups.map((sortOrder) => {
                  const ruIndex = form.prices.findIndex(
                    (item) =>
                      Number(item.sortOrder ?? 0) === sortOrder &&
                      item.locale === "ru",
                  );

                  const uzIndex = form.prices.findIndex(
                    (item) =>
                      Number(item.sortOrder ?? 0) === sortOrder &&
                      item.locale === "uz",
                  );

                  const ruItem = form.prices[ruIndex];
                  const uzItem = form.prices[uzIndex];

                  return (
                    <div
                      className="admin-nested-card"
                      key={`price-${sortOrder}`}
                    >
                      <div className="admin-section-header">
                        <h3>Цена #{sortOrder + 1}</h3>

                        <button
                          type="button"
                          className="danger-btn"
                          onClick={() => {
                            [ruIndex, uzIndex]
                              .filter((index) => index >= 0)
                              .sort((a, b) => b - a)
                              .forEach((index) => removePriceItem(index));
                          }}
                        >
                          Удалить
                        </button>
                      </div>

                      <div className="admin-form-grid">
                        <label className="admin-field">
                          <span>Порядок</span>
                          <input
                            type="number"
                            value={sortOrder}
                            onChange={(event) => {
                              if (ruIndex >= 0) {
                                onPriceChange(
                                  ruIndex,
                                  "sortOrder",
                                  event.target.value,
                                );
                              }

                              if (uzIndex >= 0) {
                                onPriceChange(
                                  uzIndex,
                                  "sortOrder",
                                  event.target.value,
                                );
                              }
                            }}
                            min="0"
                          />
                        </label>
                      </div>

                      <div className="localized-list-grid">
                        <div className="localized-list-locale-block">
                          <div className="admin-section-header">
                            <h3>Русский</h3>
                          </div>

                          <label className="admin-field">
                            <span>Текст</span>
                            <input
                              type="text"
                              value={ruItem?.value || ""}
                              onChange={(event) => {
                                if (ruIndex >= 0) {
                                  onPriceChange(
                                    ruIndex,
                                    "value",
                                    event.target.value,
                                  );
                                }
                              }}
                              placeholder="Вход бесплатный / Билет от 20 000 сумов"
                            />
                          </label>
                        </div>

                        <div className="localized-list-locale-block">
                          <div className="admin-section-header">
                            <h3>Узбекский</h3>
                          </div>

                          <label
                            className={`admin-field ${
                              ruItem?.value && !uzItem?.value
                                ? "admin-field-missing"
                                : ""
                            }`}
                          >
                            <span>Текст</span>
                            <input
                              type="text"
                              value={uzItem?.value || ""}
                              onChange={(event) => {
                                if (uzIndex >= 0) {
                                  onPriceChange(
                                    uzIndex,
                                    "value",
                                    event.target.value,
                                  );
                                }
                              }}
                              placeholder="Kirish bepul / Chipta 20 000 so‘mdan"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Цены пока не добавлены.</p>
              )}
            </div>
          </section>

          <section className="admin-form-section">
            <div className="admin-section-header">
              <div>
                <h2>Самое интересное здесь</h2>
                <p>Один highlight — одна картинка и тексты RU/UZ.</p>
              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={addHighlightItem}
              >
                Добавить highlight
              </button>
            </div>

            <div className="admin-stack">
              {highlightGroups.length ? (
                highlightGroups.map((sortOrder) => {
                  const ruIndex = form.highlights.findIndex(
                    (item) =>
                      Number(item.sortOrder ?? 0) === sortOrder &&
                      item.locale === "ru",
                  );

                  const uzIndex = form.highlights.findIndex(
                    (item) =>
                      Number(item.sortOrder ?? 0) === sortOrder &&
                      item.locale === "uz",
                  );

                  const ruItem = form.highlights[ruIndex];
                  const uzItem = form.highlights[uzIndex];
                  const image = ruItem?.image || uzItem?.image || "";

                  return (
                    <div
                      className="admin-nested-card"
                      key={`highlight-${sortOrder}`}
                    >
                      <div className="admin-section-header">
                        <h3>Highlight #{sortOrder + 1}</h3>

                        <button
                          type="button"
                          className="danger-btn"
                          onClick={() => {
                            [ruIndex, uzIndex]
                              .filter((index) => index >= 0)
                              .sort((a, b) => b - a)
                              .forEach((index) => removeHighlightItem(index));
                          }}
                        >
                          Удалить
                        </button>
                      </div>

                      <div className="admin-form-grid">
                        <label className="admin-field admin-field--full">
                          <span>Изображение</span>
                          <input
                            type="url"
                            value={image}
                            onChange={(event) => {
                              if (ruIndex >= 0) {
                                onHighlightChange(
                                  ruIndex,
                                  "image",
                                  event.target.value,
                                );
                              }

                              if (uzIndex >= 0) {
                                onHighlightChange(
                                  uzIndex,
                                  "image",
                                  event.target.value,
                                );
                              }
                            }}
                            placeholder="https://..."
                          />
                        </label>

                        <label className="admin-field">
                          <span>Порядок</span>
                          <input
                            type="number"
                            value={sortOrder}
                            onChange={(event) => {
                              if (ruIndex >= 0) {
                                onHighlightChange(
                                  ruIndex,
                                  "sortOrder",
                                  event.target.value,
                                );
                              }

                              if (uzIndex >= 0) {
                                onHighlightChange(
                                  uzIndex,
                                  "sortOrder",
                                  event.target.value,
                                );
                              }
                            }}
                            min="0"
                          />
                        </label>
                      </div>

                      <div className="localized-list-grid">
                        <div className="localized-list-locale-block">
                          <div className="admin-section-header">
                            <h3>Русский</h3>
                          </div>

                          <label className="admin-field">
                            <span>Заголовок</span>
                            <input
                              type="text"
                              value={ruItem?.title || ""}
                              onChange={(event) => {
                                if (ruIndex >= 0) {
                                  onHighlightChange(
                                    ruIndex,
                                    "title",
                                    event.target.value,
                                  );
                                }
                              }}
                            />
                          </label>

                          <label className="admin-field">
                            <span>Описание</span>
                            <textarea
                              rows="3"
                              value={toInputValue(ruItem?.description)}
                              onChange={(event) => {
                                if (ruIndex >= 0) {
                                  onHighlightChange(
                                    ruIndex,
                                    "description",
                                    event.target.value,
                                  );
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="localized-list-locale-block">
                          <div className="admin-section-header">
                            <h3>Узбекский</h3>
                          </div>

                          <label
                            className={`admin-field ${
                              ruItem?.title && !uzItem?.title
                                ? "admin-field-missing"
                                : ""
                            }`}
                          >
                            <span>Заголовок</span>
                            <input
                              type="text"
                              value={uzItem?.title || ""}
                              onChange={(event) => {
                                if (uzIndex >= 0) {
                                  onHighlightChange(
                                    uzIndex,
                                    "title",
                                    event.target.value,
                                  );
                                }
                              }}
                            />
                          </label>

                          <label
                            className={`admin-field ${
                              ruItem?.description && !uzItem?.description
                                ? "admin-field-missing"
                                : ""
                            }`}
                          >
                            <span>Описание</span>
                            <textarea
                              rows="3"
                              value={toInputValue(uzItem?.description)}
                              onChange={(event) => {
                                if (uzIndex >= 0) {
                                  onHighlightChange(
                                    uzIndex,
                                    "description",
                                    event.target.value,
                                  );
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Highlights пока не добавлены.</p>
              )}
            </div>
          </section>

          <section className="admin-form-section">
            <div className="admin-section-header">
              <div>
                <h2>Подойдёт для</h2>
                <p>Один тег — тексты RU/UZ в одной карточке.</p>
              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={addSuitableForItem}
              >
                Добавить тег
              </button>
            </div>

            <div className="admin-stack">
              {suitableForGroups.length ? (
                suitableForGroups.map((sortOrder) => {
                  const ruIndex = form.suitableFor.findIndex(
                    (item) =>
                      Number(item.sortOrder ?? 0) === sortOrder &&
                      item.locale === "ru",
                  );

                  const uzIndex = form.suitableFor.findIndex(
                    (item) =>
                      Number(item.sortOrder ?? 0) === sortOrder &&
                      item.locale === "uz",
                  );

                  const ruItem = form.suitableFor[ruIndex];
                  const uzItem = form.suitableFor[uzIndex];

                  return (
                    <div
                      className="admin-nested-card"
                      key={`suitable-${sortOrder}`}
                    >
                      <div className="admin-section-header">
                        <h3>Тег #{sortOrder + 1}</h3>

                        <button
                          type="button"
                          className="danger-btn"
                          onClick={() => {
                            [ruIndex, uzIndex]
                              .filter((index) => index >= 0)
                              .sort((a, b) => b - a)
                              .forEach((index) => removeSuitableForItem(index));
                          }}
                        >
                          Удалить
                        </button>
                      </div>

                      <div className="admin-form-grid">
                        <label className="admin-field">
                          <span>Порядок</span>
                          <input
                            type="number"
                            value={sortOrder}
                            onChange={(event) => {
                              if (ruIndex >= 0) {
                                onSuitableForChange(
                                  ruIndex,
                                  "sortOrder",
                                  event.target.value,
                                );
                              }

                              if (uzIndex >= 0) {
                                onSuitableForChange(
                                  uzIndex,
                                  "sortOrder",
                                  event.target.value,
                                );
                              }
                            }}
                            min="0"
                          />
                        </label>
                      </div>

                      <div className="localized-list-grid">
                        <div className="localized-list-locale-block">
                          <div className="admin-section-header">
                            <h3>Русский</h3>
                          </div>

                          <label className="admin-field">
                            <span>Текст</span>
                            <input
                              type="text"
                              value={ruItem?.value || ""}
                              onChange={(event) => {
                                if (ruIndex >= 0) {
                                  onSuitableForChange(
                                    ruIndex,
                                    "value",
                                    event.target.value,
                                  );
                                }
                              }}
                              placeholder="С друзьями / Для прогулки / Для свидания"
                            />
                          </label>
                        </div>

                        <div className="localized-list-locale-block">
                          <div className="admin-section-header">
                            <h3>Узбекский</h3>
                          </div>

                          <label
                            className={`admin-field ${
                              ruItem?.value && !uzItem?.value
                                ? "admin-field-missing"
                                : ""
                            }`}
                          >
                            <span>Текст</span>
                            <input
                              type="text"
                              value={uzItem?.value || ""}
                              onChange={(event) => {
                                if (uzIndex >= 0) {
                                  onSuitableForChange(
                                    uzIndex,
                                    "value",
                                    event.target.value,
                                  );
                                }
                              }}
                              placeholder="Do‘stlar bilan / Sayr uchun / Uchrashuv uchun"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Теги пока не добавлены.</p>
              )}
            </div>
          </section>
        </>
      )}

      <div className="admin-form-actions">
        {onCancel ? (
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </button>
        ) : null}

        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PlaceEditor;
