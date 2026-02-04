import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
            // Optional: Validate token with backend
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, {
                name, email, password, phone, role: 'student'
            });
            // Don't log in yet. Just return success.
            toast.success('OTP sent to your email!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/verify`, { email, otp });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyOTP, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
