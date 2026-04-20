const API_BASE_URL = "http://localhost:4000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminStories() {
  const response = await fetch(`${API_BASE_URL}/api/stories?admin=true`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить материалы");
  }

  return response.json();
}

export async function fetchStoryById(id) {
  const response = await fetch(`${API_BASE_URL}/api/stories/id/${id}`, {
    headers: getAuthHeaders(),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseData?.message || "Не удалось загрузить материал");
  }

  return responseData;
}

export async function createStory(data) {
  const response = await fetch(`${API_BASE_URL}/api/stories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseData?.message || "Не удалось создать материал");
  }

  return responseData;
}

export async function updateStoryById(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseData?.message || "Не удалось обновить материал");
  }

  return responseData;
}

export async function deleteStoryById(id) {
  const response = await fetch(`${API_BASE_URL}/api/stories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseData?.message || "Не удалось удалить материал");
  }

  return responseData;
}