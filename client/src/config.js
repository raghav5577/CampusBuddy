// Determine if we're in production (deployed) or development (local)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const productionBackendBase = 'https://campusbuddy-api.onrender.com';

// Use environment variables with local development defaults
const API_URL = import.meta.env.VITE_API_URL ||
    (isDevelopment ? 'http://localhost:5000/api' : `${productionBackendBase}/api`);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
    (isDevelopment ? 'http://localhost:5000' : productionBackendBase);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Validate configuration
if (!API_URL || !SOCKET_URL) {
    console.error('Missing environment variables: VITE_API_URL or VITE_SOCKET_URL');
}

// Log configuration
console.log('Config:', {
    environment: isDevelopment ? 'development' : 'production',
    API_URL,
    SOCKET_URL,
    hasGoogleClientId: Boolean(GOOGLE_CLIENT_ID)
});

export { API_URL, SOCKET_URL, GOOGLE_CLIENT_ID };
