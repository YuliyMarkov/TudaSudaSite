function MovieEditor({
  form,
  onChange,
  onTranslationChange,
  onCalendarDateChange,
  addCalendarDate,
  removeCalendarDate,
  onGalleryChange,
  addGalleryItem,
  removeGalleryItem,
  onCastChange,
  addCastItem,
  removeCastItem,
  isSubmitting,
  submitLabel,
  onRegenerateSlug,
  onCopyRuToUz,
  emptyUzCount = 0,
  isSeoOpen = false,
  setIsSeoOpen,
  isExtraOpen = false,
  setIsExtraOpen,
  onCancel,
}) {
  const previewImage = form.posterImage || form.coverImage;

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
                    required
                    placeholder="movie-name"
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
                  <option value="published">Опубликовано</option>
                  <option value="archived">Архив</option>
                </select>
              </label>

              <label className="admin-field">
                <span>Дата релиза</span>
                <input
                  type="date"
                  name="releaseDate"
                  value={form.releaseDate}
                  onChange={onChange}
                />
              </label>

              <label className="admin-field">
                <span>Длительность, мин</span>
                <input
                  type="number"
                  name="durationMinutes"
                  value={form.durationMinutes}
                  onChange={onChange}
                  min="0"
                  placeholder="120"
                />
              </label>

              <label className="admin-field">
                <span>Возрастной рейтинг</span>
                <input
                  type="text"
                  name="ageRating"
                  value={form.ageRating}
                  onChange={onChange}
                  placeholder="12+"
                />
              </label>

              <label className="admin-field">
                <span>IMDb</span>
                <input
                  type="text"
                  name="imdbRating"
                  value={form.imdbRating}
                  onChange={onChange}
                  placeholder="7.8"
                />
              </label>

              <label className="admin-field">
                <span>Кинопоиск</span>
                <input
                  type="text"
                  name="kpRating"
                  value={form.kpRating}
                  onChange={onChange}
                  placeholder="8.1"
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Ссылка на покупку билетов</span>
                <input
                  type="text"
                  name="buyTicketsUrl"
                  value={form.buyTicketsUrl}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Трейлер / видео</span>
                <input
                  type="text"
                  name="trailerUrl"
                  value={form.trailerUrl}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </label>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={onChange}
                />
                <span>Избранный фильм</span>
              </label>
            </div>
          </div>

          <aside className="admin-event-preview">
            <div className="admin-event-preview-card">
              <div className="admin-event-preview-image">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={form.translations.ru.title || "Preview"}
                  />
                ) : (
                  <span>Превью</span>
                )}

                <b>Кино</b>
              </div>

              <div className="admin-event-preview-body">
                <h3>{form.translations.ru.title || "Название фильма"}</h3>
                <p>
                  {form.translations.ru.excerpt ||
                    form.translations.ru.genre ||
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
            <p>Название, описание и краткая подводка на двух языках.</p>
          </div>

          <button type="button" className="secondary-btn" onClick={onCopyRuToUz}>
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
                value={form.translations.ru.title}
                onChange={(event) =>
                  onTranslationChange("ru", "title", event.target.value)
                }
                required
                placeholder="Название фильма"
              />
            </label>

            <label className="admin-field">
              <span>Краткое описание</span>
              <textarea
                value={form.translations.ru.excerpt}
                onChange={(event) =>
                  onTranslationChange("ru", "excerpt", event.target.value)
                }
                rows="3"
                placeholder="1–2 предложения для карточки"
              />
            </label>

            <label className="admin-field">
              <span>Полное описание</span>
              <textarea
                value={form.translations.ru.description}
                onChange={(event) =>
                  onTranslationChange("ru", "description", event.target.value)
                }
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
                form.translations.ru.title && !form.translations.uz.title
                  ? "admin-field-missing"
                  : ""
              }`}
            >
              <span>Название</span>
              <input
                type="text"
                value={form.translations.uz.title}
                onChange={(event) =>
                  onTranslationChange("uz", "title", event.target.value)
                }
                placeholder="Film nomi"
              />
            </label>

            <label
              className={`admin-field ${
                form.translations.ru.excerpt && !form.translations.uz.excerpt
                  ? "admin-field-missing"
                  : ""
              }`}
            >
              <span>Краткое описание</span>
              <textarea
                value={form.translations.uz.excerpt}
                onChange={(event) =>
                  onTranslationChange("uz", "excerpt", event.target.value)
                }
                rows="3"
              />
            </label>

            <label
              className={`admin-field ${
                form.translations.ru.description &&
                !form.translations.uz.description
                  ? "admin-field-missing"
                  : ""
              }`}
            >
              <span>Полное описание</span>
              <textarea
                value={form.translations.uz.description}
                onChange={(event) =>
                  onTranslationChange("uz", "description", event.target.value)
                }
                rows="8"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Детали фильма</h2>

        <div className="localized-list-grid">
          <div className="localized-list-locale-block">
            <div className="admin-section-header">
              <h3>Русский</h3>
            </div>

            <div className="admin-mini-grid">
              <label className="admin-field">
                <span>Жанр</span>
                <input
                  type="text"
                  value={form.translations.ru.genre}
                  onChange={(event) =>
                    onTranslationChange("ru", "genre", event.target.value)
                  }
                  placeholder="Драма, комедия"
                />
              </label>

              <label className="admin-field">
                <span>Страна</span>
                <input
                  type="text"
                  value={form.translations.ru.country}
                  onChange={(event) =>
                    onTranslationChange("ru", "country", event.target.value)
                  }
                  placeholder="США"
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Режиссёр</span>
                <input
                  type="text"
                  value={form.translations.ru.director}
                  onChange={(event) =>
                    onTranslationChange("ru", "director", event.target.value)
                  }
                />
              </label>
            </div>
          </div>

          <div className="localized-list-locale-block">
            <div className="admin-section-header">
              <h3>Узбекский</h3>
            </div>

            <div className="admin-mini-grid">
              <label
                className={`admin-field ${
                  form.translations.ru.genre && !form.translations.uz.genre
                    ? "admin-field-missing"
                    : ""
                }`}
              >
                <span>Жанр</span>
                <input
                  type="text"
                  value={form.translations.uz.genre}
                  onChange={(event) =>
                    onTranslationChange("uz", "genre", event.target.value)
                  }
                />
              </label>

              <label
                className={`admin-field ${
                  form.translations.ru.country && !form.translations.uz.country
                    ? "admin-field-missing"
                    : ""
                }`}
              >
                <span>Страна</span>
                <input
                  type="text"
                  value={form.translations.uz.country}
                  onChange={(event) =>
                    onTranslationChange("uz", "country", event.target.value)
                  }
                />
              </label>

              <label
                className={`admin-field admin-field-full ${
                  form.translations.ru.director && !form.translations.uz.director
                    ? "admin-field-missing"
                    : ""
                }`}
              >
                <span>Режиссёр</span>
                <input
                  type="text"
                  value={form.translations.uz.director}
                  onChange={(event) =>
                    onTranslationChange("uz", "director", event.target.value)
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Медиа</h2>

        <div className="admin-form-grid">
          <label className="admin-field admin-field-full">
            <span>Постер (URL)</span>
            <input
              type="text"
              name="posterImage"
              value={form.posterImage}
              onChange={onChange}
              placeholder="https://..."
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Обложка (URL)</span>
            <input
              type="text"
              name="coverImage"
              value={form.coverImage}
              onChange={onChange}
              placeholder="https://..."
            />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-section-header">
          <div>
            <h2>Календарь показов</h2>
            <p>Даты, в которые фильм должен появляться в календаре сайта.</p>
          </div>

          <button type="button" className="secondary-btn" onClick={addCalendarDate}>
            Добавить дату
          </button>
        </div>

        <div className="admin-stack">
          {form.calendarDates.length ? (
            form.calendarDates.map((item, index) => (
              <div className="admin-nested-card" key={index}>
                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span>Дата</span>
                    <input
                      type="date"
                      value={item.date}
                      onChange={(event) =>
                        onCalendarDateChange(index, "date", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span>Порядок</span>
                    <input
                      type="number"
                      value={item.sortOrder}
                      onChange={(event) =>
                        onCalendarDateChange(
                          index,
                          "sortOrder",
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => removeCalendarDate(index)}
                >
                  Удалить дату
                </button>
              </div>
            ))
          ) : (
            <p>Даты пока не добавлены.</p>
          )}
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
                  value={form.translations.ru.seoTitle}
                  onChange={(event) =>
                    onTranslationChange("ru", "seoTitle", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>SEO description</span>
                <textarea
                  value={form.translations.ru.seoDescription}
                  onChange={(event) =>
                    onTranslationChange(
                      "ru",
                      "seoDescription",
                      event.target.value
                    )
                  }
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
                  value={form.translations.uz.seoTitle}
                  onChange={(event) =>
                    onTranslationChange("uz", "seoTitle", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>SEO description</span>
                <textarea
                  value={form.translations.uz.seoDescription}
                  onChange={(event) =>
                    onTranslationChange(
                      "uz",
                      "seoDescription",
                      event.target.value
                    )
                  }
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
          : "Показать галерею и актёрский состав"}
      </button>

      {isExtraOpen && (
        <>
          <section className="admin-form-section">
            <div className="admin-section-header">
              <div>
                <h2>Галерея</h2>
                <p>Дополнительные изображения фильма.</p>
              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={addGalleryItem}
              >
                Добавить изображение
              </button>
            </div>

            <div className="admin-stack">
              {form.galleryItems.length ? (
                form.galleryItems.map((item, index) => (
                  <div className="admin-nested-card" key={index}>
                    <div className="admin-form-grid">
                      <label className="admin-field admin-field-full">
                        <span>Изображение</span>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(event) =>
                            onGalleryChange(index, "image", event.target.value)
                          }
                          placeholder="https://..."
                        />
                      </label>

                      <label className="admin-field">
                        <span>Порядок</span>
                        <input
                          type="number"
                          value={item.sortOrder}
                          onChange={(event) =>
                            onGalleryChange(
                              index,
                              "sortOrder",
                              event.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => removeGalleryItem(index)}
                    >
                      Удалить изображение
                    </button>
                  </div>
                ))
              ) : (
                <p>Изображения пока не добавлены.</p>
              )}
            </div>
          </section>

          <section className="admin-form-section">
            <div className="admin-section-header">
              <div>
                <h2>Актёрский состав</h2>
                <p>Имена актёров на русском или узбекском языке.</p>
              </div>

              <button type="button" className="secondary-btn" onClick={addCastItem}>
                Добавить актёра
              </button>
            </div>

            <div className="admin-stack">
              {form.castItems.length ? (
                form.castItems.map((item, index) => (
                  <div className="admin-nested-card" key={index}>
                    <div className="admin-form-grid">
                      <label className="admin-field">
                        <span>Язык</span>
                        <select
                          value={item.locale}
                          onChange={(event) =>
                            onCastChange(index, "locale", event.target.value)
                          }
                        >
                          <option value="ru">Русский</option>
                          <option value="uz">Узбекский</option>
                        </select>
                      </label>

                      <label className="admin-field">
                        <span>Имя</span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(event) =>
                            onCastChange(index, "name", event.target.value)
                          }
                        />
                      </label>

                      <label className="admin-field">
                        <span>Порядок</span>
                        <input
                          type="number"
                          value={item.sortOrder}
                          onChange={(event) =>
                            onCastChange(index, "sortOrder", event.target.value)
                          }
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => removeCastItem(index)}
                    >
                      Удалить актёра
                    </button>
                  </div>
                ))
              ) : (
                <p>Актёры пока не добавлены.</p>
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

export default MovieEditor;