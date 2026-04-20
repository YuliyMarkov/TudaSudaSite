function createEmptyLocalizedItem(locale) {
  return {
    id: `${locale}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    locale,
    value: "",
    sortOrder: 0,
  };
}

function LocalizedTextListEditor({
  title,
  subtitle,
  value = [],
  onChange,
}) {
  const ruItems = value.filter((item) => item.locale === "ru");
  const uzItems = value.filter((item) => item.locale === "uz");

  function handleAdd(locale) {
    onChange([...(value || []), createEmptyLocalizedItem(locale)]);
  }

  function handleRemove(targetIndex) {
    const next = [...value];
    next.splice(targetIndex, 1);
    onChange(next);
  }

  function handleChange(targetIndex, field, fieldValue) {
    const next = [...value];
    next[targetIndex] = {
      ...next[targetIndex],
      [field]: fieldValue,
    };
    onChange(next);
  }

  function renderLocaleBlock(locale, localeTitle, items) {
    return (
      <div className="localized-list-locale-block">
        <div className="event-session-card-top">
          <h3>{localeTitle}</h3>

          <button
            type="button"
            className="primary-btn"
            onClick={() => handleAdd(locale)}
          >
            Добавить
          </button>
        </div>

        {items.length ? (
          <div className="event-sessions-list">
            {items.map((item) => {
              const globalIndex = value.findIndex(
                (entry) => entry.id === item.id || (
                  entry.locale === item.locale &&
                  entry.value === item.value &&
                  entry.sortOrder === item.sortOrder
                )
              );

              return (
                <div className="event-session-card" key={item.id || globalIndex}>
                  <div className="event-session-card-top">
                    <h3>Пункт</h3>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => handleRemove(globalIndex)}
                    >
                      Удалить
                    </button>
                  </div>

                  <div className="admin-form-grid">
                    <label className="admin-field admin-field-full">
                      <span>Текст</span>
                      <textarea
                        rows="3"
                        value={item.value || ""}
                        onChange={(event) =>
                          handleChange(globalIndex, "value", event.target.value)
                        }
                      />
                    </label>

                    <label className="admin-field">
                      <span>Порядок сортировки</span>
                      <input
                        type="number"
                        value={item.sortOrder ?? 0}
                        onChange={(event) =>
                          handleChange(
                            globalIndex,
                            "sortOrder",
                            Number(event.target.value)
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty">Пока пусто.</div>
        )}
      </div>
    );
  }

  return (
    <div className="localized-list-editor">
      <div className="event-sessions-header">
        <div>
          <h2>{title}</h2>
          <p className="admin-page-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="localized-list-grid">
        {renderLocaleBlock("ru", "Русский", ruItems)}
        {renderLocaleBlock("uz", "Узбекский", uzItems)}
      </div>
    </div>
  );
}

export default LocalizedTextListEditor;