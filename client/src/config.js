// Determine if we're in production (deployed) or development (local)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use environment variables with local development defaults
const API_URL = import.meta.env.VITE_API_URL || 
    (isDevelopment ? 'http://localhost:5000/api' : '');

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
    (isDevelopment ? 'http://localhost:5000' : '');

// Validate configuration
if (!API_URL || !SOCKET_URL) {
    console.error('❌ Missing environment variables: VITE_API_URL or VITE_SOCKET_URL');
}

// Log configuration
console.log('🔧 Config:', { 
    environment: isDevelopment ? 'development' : 'production',
    API_URL, 
    SOCKET_URL 
});

export { API_URL, SOCKET_URL };
