const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const BACKEND_BASE_URL = isLocalHost
  ? "http://localhost:8000"
  : window.location.origin;
window.BACKEND_BASE_URL = backendBaseUrl;
window.API_BASE_URL = `${backendBaseUrl}/Back-end`;