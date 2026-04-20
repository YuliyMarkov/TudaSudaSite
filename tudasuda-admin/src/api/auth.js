const API_BASE_URL = "http://localhost:4000";

export async function loginRequest({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось выполнить вход");
  }

  const token = data?.token || data?.accessToken;

  if (!token) {
    throw new Error("Сервер не вернул токен");
  }

  return {
    token,
    user: data?.user || null,
  };
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function setStoredToken(token) {
  localStorage.setItem("token", token);
}

export function clearStoredToken() {
  localStorage.removeItem("token");
}