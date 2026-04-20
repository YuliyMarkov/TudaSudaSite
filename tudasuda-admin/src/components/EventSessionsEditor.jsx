function createEmptySession() {
  return {
    id: `new-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    startAt: "",
    endAt: "",
    price: "",
    ticketUrl: "",
  };
}

function EventSessionsEditor({ value = [], onChange }) {
  function handleAddSession() {
    onChange([...(value || []), createEmptySession()]);
  }

  function handleRemoveSession(index) {
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
    <div className="event-sessions-editor">
      <div className="event-sessions-header">
        <div>
          <h2>Сеансы / даты</h2>
          <p className="admin-page-subtitle">
            Добавь одну или несколько дат с ценой и отдельной ссылкой на билет.
          </p>
        </div>

        <button type="button" className="primary-btn" onClick={handleAddSession}>
          Добавить сеанс
        </button>
      </div>

      {value.length ? (
        <div className="event-sessions-list">
          {value.map((session, index) => (
            <div className="event-session-card" key={session.id || index}>
              <div className="event-session-card-top">
                <h3>Сеанс {index + 1}</h3>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => handleRemoveSession(index)}
                >
                  Удалить
                </button>
              </div>

              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Начало</span>
                  <input
                    type="datetime-local"
                    value={session.startAt || ""}
                    onChange={(event) =>
                      handleChange(index, "startAt", event.target.value)
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Конец</span>
                  <input
                    type="datetime-local"
                    value={session.endAt || ""}
                    onChange={(event) =>
                      handleChange(index, "endAt", event.target.value)
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Цена</span>
                  <input
                    type="text"
                    value={session.price || ""}
                    onChange={(event) =>
                      handleChange(index, "price", event.target.value)
                    }
                    placeholder="например, от 50 000 сум"
                  />
                </label>

                <label className="admin-field">
                  <span>Ссылка на билет</span>
                  <input
                    type="text"
                    value={session.ticketUrl || ""}
                    onChange={(event) =>
                      handleChange(index, "ticketUrl", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">Сеансов пока нет.</div>
      )}
    </div>
  );
}

export default EventSessionsEditor;