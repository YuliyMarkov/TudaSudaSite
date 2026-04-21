const API_BASE_URL = "http://localhost:4000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminPlaces() {
  const response = await fetch(`${API_BASE_URL}/api/places?admin=true`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось загрузить места");
  }

  return Array.isArray(data) ? data : [];
}

export async function createPlace(payload) {
  const response = await fetch(`${API_BASE_URL}/api/places`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось создать место");
  }

  return data;
}

export async function updatePlaceById(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/places/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось обновить место");
  }

  return data;
}

export async function deletePlaceById(id) {
  const response = await fetch(`${API_BASE_URL}/api/places/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось удалить место");
  }

  return data;
}