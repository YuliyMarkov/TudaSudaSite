const API_BASE_URL = "";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminRestaurants() {
  const response = await fetch(`${API_BASE_URL}/api/restaurants?admin=true`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось загрузить рестораны");
  }

  return Array.isArray(data) ? data : [];
}

export async function createRestaurant(payload) {
  const response = await fetch(`${API_BASE_URL}/api/restaurants`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось создать ресторан");
  }

  return data;
}

export async function updateRestaurantById(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/restaurants/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось обновить ресторан");
  }

  return data;
}

export async function deleteRestaurantById(id) {
  const response = await fetch(`${API_BASE_URL}/api/restaurants/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось удалить ресторан");
  }

  return data;
}