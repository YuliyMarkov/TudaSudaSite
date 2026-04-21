import { useMemo } from "react";

const defaultTranslation = {
  title: "",
  type: "",
  cuisine: "",
  address: "",
  workingHours: "",
  averageCheck: "",
  description: "",
  atmosphere: "",
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

function normalizeNumberString(value) {
  return value === null || value === undefined ? "" : String(value);
}

function RestaurantEditor({
  form,
  onChange,
  onTranslationChange,
  onPriceChange,
  addPriceItem,
  removePriceItem,
  onDishChange,
  addDishItem,
  removeDishItem,
  onFormatChange,
  addFormatItem,
  removeFormatItem,
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
              placeholder="например: yoree-1937"
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
        </div>
      </section>

      <section className="admin-card">
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
              name="delivery"
              checked={Boolean(form.delivery)}
              onChange={onChange}
            />
            <span>Доставка</span>
          </label>

          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="smoking"
              checked={Boolean(form.smoking)}
              onChange={onChange}
            />
            <span>Курение</span>
          </label>

          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="terrace"
              checked={Boolean(form.terrace)}
              onChange={onChange}
            />
            <span>Терраса</span>
          </label>

          <label className="admin-field admin-field--checkbox">
            <input
              type="checkbox"
              name="music"
              checked={Boolean(form.music)}
              onChange={onChange}
            />
            <span>Музыка</span>
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

          <label className="admin-field">
            <span>Формат</span>
            <input
              type="text"
              value={ru.type}
              onChange={(event) =>
                onTranslationChange("ru", "type", event.target.value)
              }
              placeholder="Ресторан / Кафе / Гастробар"
            />
          </label>

          <label className="admin-field">
            <span>Кухня</span>
            <input
              type="text"
              value={ru.cuisine}
              onChange={(event) =>
                onTranslationChange("ru", "cuisine", event.target.value)
              }
              placeholder="Корейская, паназиатская"
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Адрес</span>
            <input
              type="text"
              value={ru.address}
              onChange={(event) =>
                onTranslationChange("ru", "address", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Режим работы</span>
            <input
              type="text"
              value={ru.workingHours}
              onChange={(event) =>
                onTranslationChange("ru", "workingHours", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Средний чек</span>
            <input
              type="text"
              value={ru.averageCheck}
              onChange={(event) =>
                onTranslationChange("ru", "averageCheck", event.target.value)
              }
              placeholder="от 80 000 сумов"
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Описание</span>
            <textarea
              rows="8"
              value={ru.description}
              onChange={(event) =>
                onTranslationChange("ru", "description", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Атмосфера</span>
            <textarea
              rows="5"
              value={ru.atmosphere}
              onChange={(event) =>
                onTranslationChange("ru", "atmosphere", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Кому сюда идти</span>
            <textarea
              rows="5"
              value={ru.mustVisit}
              onChange={(event) =>
                onTranslationChange("ru", "mustVisit", event.target.value)
              }
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

          <label className="admin-field">
            <span>Формат</span>
            <input
              type="text"
              value={uz.type}
              onChange={(event) =>
                onTranslationChange("uz", "type", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Кухня</span>
            <input
              type="text"
              value={uz.cuisine}
              onChange={(event) =>
                onTranslationChange("uz", "cuisine", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Адрес</span>
            <input
              type="text"
              value={uz.address}
              onChange={(event) =>
                onTranslationChange("uz", "address", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Режим работы</span>
            <input
              type="text"
              value={uz.workingHours}
              onChange={(event) =>
                onTranslationChange("uz", "workingHours", event.target.value)
              }
            />
          </label>

          <label className="admin-field">
            <span>Средний чек</span>
            <input
              type="text"
              value={uz.averageCheck}
              onChange={(event) =>
                onTranslationChange("uz", "averageCheck", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Описание</span>
            <textarea
              rows="8"
              value={uz.description}
              onChange={(event) =>
                onTranslationChange("uz", "description", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Атмосфера</span>
            <textarea
              rows="5"
              value={uz.atmosphere}
              onChange={(event) =>
                onTranslationChange("uz", "atmosphere", event.target.value)
              }
            />
          </label>

          <label className="admin-field admin-field--full">
            <span>Кому сюда идти</span>
            <textarea
              rows="5"
              value={uz.mustVisit}
              onChange={(event) =>
                onTranslationChange("uz", "mustVisit", event.target.value)
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
            <h2>Цены</h2>
            <p>Список под блоком “Цены” на странице ресторана.</p>
          </div>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={addPriceItem}
          >
            Добавить цену
          </button>
        </div>

        <div className="admin-stack">
          {form.prices.length ? (
            form.prices.map((item, index) => (
              <div className="admin-nested-card" key={`price-${index}`}>
                <div className="admin-section-header">
                  <h3>Позиция #{index + 1}</h3>

                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => removePriceItem(index)}
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
                        onPriceChange(index, "locale", event.target.value)
                      }
                    >
                      <option value="ru">Русский</option>
                      <option value="uz">Узбекский</option>
                    </select>
                  </label>

                  <label className="admin-field admin-field--full">
                    <span>Текст</span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(event) =>
                        onPriceChange(index, "value", event.target.value)
                      }
                      placeholder="Кукси — 50 000 сумов"
                      required
                    />
                  </label>

                  <label className="admin-field">
                    <span>Порядок</span>
                    <input
                      type="number"
                      value={normalizeNumberString(item.sortOrder)}
                      onChange={(event) =>
                        onPriceChange(index, "sortOrder", event.target.value)
                      }
                      min="0"
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>Цены пока не добавлены.</p>
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-header">
          <div>
            <h2>Топ-блюда</h2>
            <p>Карточки блюд с изображением и названием.</p>
          </div>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={addDishItem}
          >
            Добавить блюдо
          </button>
        </div>

        <div className="admin-stack">
          {form.dishes.length ? (
            form.dishes.map((item, index) => (
              <div className="admin-nested-card" key={`dish-${index}`}>
                <div className="admin-section-header">
                  <h3>Блюдо #{index + 1}</h3>

                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => removeDishItem(index)}
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
                        onDishChange(index, "locale", event.target.value)
                      }
                    >
                      <option value="ru">Русский</option>
                      <option value="uz">Узбекский</option>
                    </select>
                  </label>

                  <label className="admin-field">
                    <span>Порядок</span>
                    <input
                      type="number"
                      value={normalizeNumberString(item.sortOrder)}
                      onChange={(event) =>
                        onDishChange(index, "sortOrder", event.target.value)
                      }
                      min="0"
                    />
                  </label>

                  <label className="admin-field admin-field--full">
                    <span>Название</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(event) =>
                        onDishChange(index, "title", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="admin-field admin-field--full">
                    <span>Изображение</span>
                    <input
                      type="url"
                      value={toInputValue(item.image)}
                      onChange={(event) =>
                        onDishChange(index, "image", event.target.value)
                      }
                      placeholder="https://..."
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>Блюда пока не добавлены.</p>
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-header">
          <div>
            <h2>Для кого / формат</h2>
            <p>Теги формата, которые выводятся как chips на странице.</p>
          </div>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={addFormatItem}
          >
            Добавить тег
          </button>
        </div>

        <div className="admin-stack">
          {form.formats.length ? (
            form.formats.map((item, index) => (
              <div className="admin-nested-card" key={`format-${index}`}>
                <div className="admin-section-header">
                  <h3>Тег #{index + 1}</h3>

                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => removeFormatItem(index)}
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
                        onFormatChange(index, "locale", event.target.value)
                      }
                    >
                      <option value="ru">Русский</option>
                      <option value="uz">Узбекский</option>
                    </select>
                  </label>

                  <label className="admin-field admin-field--full">
                    <span>Текст</span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(event) =>
                        onFormatChange(index, "value", event.target.value)
                      }
                      placeholder="Для свидания / С друзьями / Для бранча"
                      required
                    />
                  </label>

                  <label className="admin-field">
                    <span>Порядок</span>
                    <input
                      type="number"
                      value={normalizeNumberString(item.sortOrder)}
                      onChange={(event) =>
                        onFormatChange(index, "sortOrder", event.target.value)
                      }
                      min="0"
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>Теги пока не добавлены.</p>
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

export default RestaurantEditor;