// Use environment variables for production, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:5000`;

export { API_URL, SOCKET_URL };
