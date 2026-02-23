// Determine if we're in production (deployed) or development (local)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use environment variables if set, otherwise use smart defaults
const API_URL = import.meta.env.VITE_API_URL || 
    (isDevelopment ? 'http://localhost:5000/api' : 'https://campusbuddy-api.onrender.com/api');

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
    (isDevelopment ? 'http://localhost:5000' : 'https://campusbuddy-api.onrender.com');

// Log configuration in development
if (isDevelopment) {
    console.log('🔧 Config:', { API_URL, SOCKET_URL });
}

export { API_URL, SOCKET_URL };
