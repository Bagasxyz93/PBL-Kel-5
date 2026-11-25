const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const BACKEND_BASE_URL = isLocalHost
  ? "http://localhost:8000"
  : window.location.origin;

export const API_BASE_URL = `${BACKEND_BASE_URL}/Back-end`;