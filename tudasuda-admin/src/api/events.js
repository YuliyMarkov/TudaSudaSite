const API_BASE_URL = "http://localhost:4000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events?admin=true`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось загрузить события");
  }

  return data;
}

export async function fetchEventById(id) {
  const response = await fetch(`${API_BASE_URL}/api/events/id/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось загрузить событие");
  }

  return data;
}

export async function createEvent(data) {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseData?.message || "Не удалось создать событие");
  }

  return responseData;
}

export async function updateEventById(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseData?.message || "Не удалось обновить событие");
  }

  return responseData;
}

export async function deleteEventById(id) {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseData?.message || "Не удалось удалить событие");
  }

  return responseData;
}