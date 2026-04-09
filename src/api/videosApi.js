import { httpClient, API_BASE_URL } from "./httpClient";

/**
 * Llistat de vídeos pujats pels usuaris (taula `videos`, no `pelicules`).
 * El backend exposa GET /api/videos
 */
export async function getVideos(userId = null, limit = 20, offset = 0, categoria = null) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (userId) params.append("user_id", String(userId));
  if (categoria) params.append("categoria", String(categoria));

  return httpClient(`/videos?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });
}

export async function getVideoById(id) {
  if (!id) {
    throw new Error("ID de vídeo no vàlid");
  }

  // Els vídeos pujats pels usuaris estan a /api/videos/:id (taula `videos`),
  // no a /api/pelis/:id (taula `pelicules` de catàleg).
  return httpClient(`/videos/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
}

/**
 * Aquesta ruta de pujada la deixe tal com la tenies,
 * però arreglada perquè importe API_BASE_URL correctament.
 *
 * Revisa que al backend realment existisca:
 * POST /api/videos/upload
 * o adapta aquesta ruta si el teu backend usa un altre endpoint.
 */
export async function uploadVideo({ file, title, description, isPublic, userId }) {
  if (!file) {
    throw new Error("Cal seleccionar un fitxer de vídeo");
  }

  if (!userId) {
    throw new Error("No s'ha pogut identificar l'usuari");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title || "");
  formData.append("description", description || "");
  formData.append("is_public", isPublic ? "true" : "false");

  const token = localStorage.getItem("authToken");
  const headers = {
    "X-User-ID": String(userId),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/videos/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}