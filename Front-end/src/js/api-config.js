const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const backendBaseUrl = isLocalHost
  ? "http://localhost:8000"
  : window.location.origin;

window.BACKEND_BASE_URL = backendBaseUrl;
window.API_BASE_URL = `${backendBaseUrl}/Back-end`;