import { useMemo } from "react";

const defaultTranslation = {
  title: "",
  excerpt: "",
  description: "",
  genre: "",
  country: "",
  director: "",
  seoTitle: "",
  seoDescription: "",
};

function getTranslationValue(translations, locale) {
  return translations?.[locale] || defaultTranslation;
}

function toInputValue(value) {
  return value ?? "";
}

function normalizeNumberString(value) {
  return value === null || value === undefined ? "" : String(value);
}

function MovieEditor({
  form,
  onChange,
  onTranslationChange,
  onSessionChange,
  addSession,
  removeSession,
  onGalleryChange,
  addGalleryItem,
  removeGalleryItem,
  onCastChange,
  addCastItem,
  removeCastItem,
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
            <span>Slug</span>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={onChange}
              placeholder="например: minecraft-movie"
              required
            />
          </label>

          <label className="admin-field">
            <span>Статус</span>
            <select name="status" value={form.status} onChange={onChange}>
              <option value="draft">Черновик</option>
              <option value="published">Опубликован</option>
              <option value="archived">Архив</option>
            </select>
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

          <label className="admin-field">
            <span>Дата премьеры</span>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={onChange}
            />
          </label>

          <label className="admin-field">
            <span>Длительность, минут</span>
            <input
              type="number"
              name="durationMinutes"
              value={normalizeNumberString(form.durationMinutes)}
              onChange={onChange}
              placeholder="120"
              min="1"
            />
          </label>

          <label className="admin-field">
            <span>Возрастной рейтинг</span>
            <input
              type="text"
              name="ageRating"
              value={toInputValue(form.ageRating)}
              onChange={onChange}
              placeholder="12+"
            />
          </label>

          <label className="admin-field">
            <span>IMDb</span>
            <input
              type="text"
              name="imdbRating"
              value={toInputValue(form.imdbRating)}
              onChange={onChange}
              placeholder="7.4"
            />
          </label>

          <label className="admin-field">
            <span>Кинопоиск</span>
            <input
              type="text"
              name="kpRating"
              value={toInputValue(form.kpRating)}
              onChange={onChange}
              placeholder="7.9"
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Постер</span>
            <input
              type="url"
              name="posterImage"
              value={toInputValue(form.posterImage)}
              onChange={onChange}
              placeholder="https://..."
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Обложка / cover</span>
            <input
              type="url"
              name="coverImage"
              value={toInputValue(form.coverImage)}
              onChange={onChange}
              placeholder="https://..."
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Трейлер</span>
            <input
              type="url"
              name="trailerUrl"
              value={toInputValue(form.trailerUrl)}
              onChange={onChange}
              placeholder="https://youtube.com/... или embed-ссылка"
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

          <label className="admin-field admin-field--full">
            <span>Короткое описание / excerpt</span>
            <textarea
              rows="3"
              value={ru.excerpt}
              onChange={(event) =>
                onTranslationChange("ru", "excerpt", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Полное описание</span>
            <textarea
              rows="8"
              value={ru.description}
              onChange={(event) =>
                onTranslationChange("ru", "description", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Жанр</span>
            <input
              type="text"
              value={ru.genre}
              onChange={(event) =>
                onTranslationChange("ru", "genre", event.target.value)
              }
              placeholder="Фантастика, комедия"
            />
          </label>

          <label className="admin-field">
            <span>Страна</span>
            <input
              type="text"
              value={ru.country}
              onChange={(event) =>
                onTranslationChange("ru", "country", event.target.value)
              }
              placeholder="США"
            />
          </label>

          <label className="admin-field">
            <span>Режиссёр</span>
            <input
              type="text"
              value={ru.director}
              onChange={(event) =>
                onTranslationChange("ru", "director", event.target.value)
              }
              placeholder="Имя режиссёра"
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>SEO title</span>
            <input
              type="text"
              value={ru.seoTitle}
              onChange={(event) =>
                onTranslationChange("ru", "seoTitle", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>SEO description</span>
            <textarea
              rows="3"
              value={ru.seoDescription}
              onChange={(event) =>
                onTranslationChange("ru", "seoDescription", event.target.value)
              }
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

          <label className="admin-field admin-field--full">
            <span>Короткое описание / excerpt</span>
            <textarea
              rows="3"
              value={uz.excerpt}
              onChange={(event) =>
                onTranslationChange("uz", "excerpt", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Полное описание</span>
            <textarea
              rows="8"
              value={uz.description}
              onChange={(event) =>
                onTranslationChange("uz", "description", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Жанр</span>
            <input
              type="text"
              value={uz.genre}
              onChange={(event) =>
                onTranslationChange("uz", "genre", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Страна</span>
            <input
              type="text"
              value={uz.country}
              onChange={(event) =>
                onTranslationChange("uz", "country", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Режиссёр</span>
            <input
              type="text"
              value={uz.director}
              onChange={(event) =>
                onTranslationChange("uz", "director", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>SEO title</span>
            <input
              type="text"
              value={uz.seoTitle}
              onChange={(event) =>
                onTranslationChange("uz", "seoTitle", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>SEO description</span>
            <textarea
              rows="3"
              value={uz.seoDescription}
              onChange={(event) =>
                onTranslationChange("uz", "seoDescription", event.target.value)
              }
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-header">
          <div>
            <h2>Сеансы</h2>
            <p>Именно отсюда у тебя строится расписание на странице фильма.</p>
          </div>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={addSession}
          >
            Добавить сеанс
          </button>
        </div>

        <div className="admin-stack">
          {form.sessions.length ? (
            form.sessions.map((session, index) => (
              <div className="admin-nested-card" key={`session-${index}`}>
                <div className="admin-section-header">
                  <h3>Сеанс #{index + 1}</h3>

                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => removeSession(index)}
                  >
                    Удалить
                  </button>
                </div>

                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span>Дата</span>
                    <input
                      type="date"
                      value={session.sessionDate}
                      onChange={(event) =>
                        onSessionChange(index, "sessionDate", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="admin-field">
                    <span>Время</span>
                    <input
                      type="time"
                      value={session.sessionTime}
                      onChange={(event) =>
                        onSessionChange(index, "sessionTime", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="admin-field">
                    <span>Кинотеатр</span>
                    <input
                      type="text"
                      value={session.cinemaName}
                      onChange={(event) =>
                        onSessionChange(index, "cinemaName", event.target.value)
                      }
                      placeholder="Compass Cinema"
                      required
                    />
                  </label>

                  <label className="admin-field">
                    <span>Зал</span>
                    <input
                      type="text"
                      value={toInputValue(session.hallName)}
                      onChange={(event) =>
                        onSessionChange(index, "hallName", event.target.value)
                      }
                      placeholder="Зал 3"
                    />
                  </label>

                  <label className="admin-field">
                    <span>Цена</span>
                    <input
                      type="text"
                      value={toInputValue(session.price)}
                      onChange={(event) =>
                        onSessionChange(index, "price", event.target.value)
                      }
                      placeholder="от 50 000 сумов"
                    />
                  </label>

                  <label className="admin-field admin-field--full">
                    <span>Ссылка на билеты</span>
                    <input
                      type="url"
                      value={toInputValue(session.ticketUrl)}
                      onChange={(event) =>
                        onSessionChange(index, "ticketUrl", event.target.value)
                      }
                      placeholder="https://..."
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>Сеансы пока не добавлены.</p>
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-header">
          <div>
            <h2>Кадры / галерея</h2>
            <p>На фронте они идут в медиаслайдер рядом с трейлером.</p>
          </div>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={addGalleryItem}
          >
            Добавить кадр
          </button>
        </div>

        <div className="admin-stack">
          {form.galleryItems.length ? (
            form.galleryItems.map((item, index) => (
              <div className="admin-nested-card" key={`gallery-${index}`}>
                <div className="admin-section-header">
                  <h3>Кадр #{index + 1}</h3>

                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => removeGalleryItem(index)}
                  >
                    Удалить
                  </button>
                </div>

                <div className="admin-form-grid">
                  <label className="admin-field admin-field--full">
                    <span>Изображение</span>
                    <input
                      type="url"
                      value={item.image}
                      onChange={(event) =>
                        onGalleryChange(index, "image", event.target.value)
                      }
                      placeholder="https://..."
                      required
                    />
                  </label>

                  <label className="admin-field">
                    <span>Порядок</span>
                    <input
                      type="number"
                      value={normalizeNumberString(item.sortOrder)}
                      onChange={(event) =>
                        onGalleryChange(index, "sortOrder", event.target.value)
                      }
                      min="0"
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>Кадры пока не добавлены.</p>
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-header">
          <div>
            <h2>Актёрский состав</h2>
            <p>На фронте актёры собираются в строку по текущей локали.</p>
          </div>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={addCastItem}
          >
            Добавить актёра
          </button>
        </div>

        <div className="admin-stack">
          {form.castItems.length ? (
            form.castItems.map((item, index) => (
              <div className="admin-nested-card" key={`cast-${index}`}>
                <div className="admin-section-header">
                  <h3>Актёр #{index + 1}</h3>

                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => removeCastItem(index)}
                  >
                    Удалить
                  </button>
                </div>

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
                      placeholder="Имя актёра"
                      required
                    />
                  </label>

                  <label className="admin-field">
                    <span>Порядок</span>
                    <input
                      type="number"
                      value={normalizeNumberString(item.sortOrder)}
                      onChange={(event) =>
                        onCastChange(index, "sortOrder", event.target.value)
                      }
                      min="0"
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>Актёрский состав пока не добавлен.</p>
          )}
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

export default MovieEditor;