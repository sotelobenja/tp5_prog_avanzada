const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data.error ||
      (data.errors && data.errors.join(", ")) ||
      "Error al comunicarse con el servidor";
    throw new Error(message);
  }
  return data;
}

export function getTasks() {
  return request("/api/tasks");
}

export function createTask(payload) {
  return request("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTask(id, payload) {
  return request(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: "DELETE" });
}

export function finalizeTask(id) {
  return request(`/api/tasks/${id}/finalizar`, { method: "PATCH" });
}
