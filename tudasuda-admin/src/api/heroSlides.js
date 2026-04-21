const API_BASE_URL = "http://localhost:4000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminHeroSlides() {
  const response = await fetch(`${API_BASE_URL}/api/hero-slides`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось загрузить слайды");
  }

  return Array.isArray(data) ? data : [];
}

export async function createHeroSlide(payload) {
  const response = await fetch(`${API_BASE_URL}/api/hero-slides`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось создать слайд");
  }

  return data;
}

export async function updateHeroSlideById(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/hero-slides/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось обновить слайд");
  }

  return data;
}

export async function deleteHeroSlideById(id) {
  const response = await fetch(`${API_BASE_URL}/api/hero-slides/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось удалить слайд");
  }

  return data;
}