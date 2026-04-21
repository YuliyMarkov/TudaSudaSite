const API_BASE_URL = "http://localhost:4000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminMovies() {
  const response = await fetch(`${API_BASE_URL}/api/movies?admin=true`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось загрузить фильмы");
  }

  return Array.isArray(data) ? data : [];
}

export async function fetchMovieBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}/api/movies/${slug}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось загрузить фильм");
  }

  return data;
}

export async function createMovie(payload) {
  const response = await fetch(`${API_BASE_URL}/api/movies`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось создать фильм");
  }

  return data;
}

export async function updateMovieById(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось обновить фильм");
  }

  return data;
}

export async function deleteMovieById(id) {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось удалить фильм");
  }

  return data;
}