import axios from 'axios';
import { API_URL } from './config';

// Create axios instance with longer timeout for Render free tier wake-up
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 90000, // 90 seconds - enough for Render to wake up
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add retry logic with exponential backoff
const axiosRetry = async (fn, retries = 3, delay = 2000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        
        // If it's a timeout or network error, retry
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
            console.log(`⏳ Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return axiosRetry(fn, retries - 1, delay * 1.5);
        }
        
        throw error;
    }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for better error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout - backend may be waking up');
            error.message = 'Server is waking up, please wait...';
        } else if (error.code === 'ERR_NETWORK') {
            console.error('🌐 Network error - check your connection');
            error.message = 'Network error. Please check your internet connection.';
        } else if (!error.response) {
            console.error('❌ No response from server');
            error.message = 'Cannot reach server. Please try again.';
        }
        return Promise.reject(error);
    }
);

// Wake up the backend (call this on app load)
export const wakeUpBackend = async () => {
    try {
        console.log('⚡ Waking up backend...');
        const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`, {
            timeout: 90000
        });
        console.log('✅ Backend is awake!', response.data);
        return true;
    } catch (error) {
        console.error('⚠️ Backend wake-up failed:', error.message);
        return false;
    }
};

// API methods with retry logic
export const api = {
    get: (url, config) => axiosRetry(() => apiClient.get(url, config)),
    post: (url, data, config) => axiosRetry(() => apiClient.post(url, data, config)),
    put: (url, data, config) => axiosRetry(() => apiClient.put(url, data, config)),
    patch: (url, data, config) => axiosRetry(() => apiClient.patch(url, data, config)),
    delete: (url, config) => axiosRetry(() => apiClient.delete(url, config))
};

export default apiClient;
