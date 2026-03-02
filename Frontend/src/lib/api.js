export async function apiFetch(url, options = {}) {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const method = (options.method || "GET").toUpperCase();
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };

  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = getCsrfToken();
    if (token) {
      headers["X-CSRFToken"] = token;
    }
  }

  const fullUrl = `${BASE_URL}${url}`;   // ✅ THIS IS THE FIX

  const response = await fetch(fullUrl, {
    credentials: "include",
    ...options,
    headers,
    body: hasBody
      ? isFormData
        ? options.body
        : typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body
      : options.body,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || (payload && payload.ok === false)) {
    const message =
      payload?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}