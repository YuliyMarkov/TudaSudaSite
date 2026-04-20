function createEmptyGalleryItem() {
  return {
    id: `gallery-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    image: "",
    sortOrder: 0,
  };
}

function EventGalleryEditor({ value = [], onChange }) {
  function handleAdd() {
    onChange([...(value || []), createEmptyGalleryItem()]);
  }

  function handleRemove(index) {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  }

  function handleChange(index, field, fieldValue) {
    const next = [...value];
    next[index] = {
      ...next[index],
      [field]: fieldValue,
    };
    onChange(next);
  }

  return (
    <div className="event-gallery-editor">
      <div className="event-sessions-header">
        <div>
          <h2>Галерея</h2>
          <p className="admin-page-subtitle">
            Добавь изображения для карточки события.
          </p>
        </div>

        <button type="button" className="primary-btn" onClick={handleAdd}>
          Добавить изображение
        </button>
      </div>

      {value.length ? (
        <div className="event-sessions-list">
          {value.map((item, index) => (
            <div className="event-session-card" key={item.id || index}>
              <div className="event-session-card-top">
                <h3>Изображение {index + 1}</h3>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => handleRemove(index)}
                >
                  Удалить
                </button>
              </div>

              <div className="admin-form-grid">
                <label className="admin-field admin-field-full">
                  <span>URL изображения</span>
                  <input
                    type="text"
                    value={item.image || ""}
                    onChange={(event) =>
                      handleChange(index, "image", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>

                <label className="admin-field">
                  <span>Порядок сортировки</span>
                  <input
                    type="number"
                    value={item.sortOrder ?? 0}
                    onChange={(event) =>
                      handleChange(index, "sortOrder", Number(event.target.value))
                    }
                  />
                </label>
              </div>

              {item.image ? (
                <div className="event-gallery-preview">
                  <img src={item.image} alt="" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">Изображений пока нет.</div>
      )}
    </div>
  );
}

export default EventGalleryEditor;