const API_BASE_URL = "";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminReels() {
  const response = await fetch(`${API_BASE_URL}/api/reels`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось загрузить рилсы");
  }

  return Array.isArray(data) ? data : [];
}

export async function createReel(payload) {
  const response = await fetch(`${API_BASE_URL}/api/reels`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось создать рилс");
  }

  return data;
}

export async function updateReelById(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/reels/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось обновить рилс");
  }

  return data;
}

export async function deleteReelById(id) {
  const response = await fetch(`${API_BASE_URL}/api/reels/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось удалить рилс");
  }

  return data;
}