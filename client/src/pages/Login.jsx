import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FlowingMenu from '../components/FlowingMenu';
import axios from 'axios';
import { API_URL } from '../config';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/outlets`);
                setOutlets(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOutlets();
    }, []);

    // Transform outlets for FlowingMenu - redirect to login on click
    const menuItems = outlets.map(outlet => ({
        text: outlet.name,
        link: '/login', // Redirect to login page
        image: outlet.image === 'no-photo.jpg' ? 'https://via.placeholder.com/400x250?text=Outlet' : outlet.image
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData.email, formData.password);
        if (success) navigate('/');
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Login Form */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pt-10">

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 font-['Figtree'] leading-tight">
                    Welcome Back!
                </h1>
                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-['Figtree'] mb-10">
                    Sign in to order from your favorite campus outlets.
                </p>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2 text-left font-['Figtree']">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all font-['Figtree']"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2 text-left font-['Figtree']">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all font-['Figtree']"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3.5 px-6 rounded-xl font-['Figtree'] font-semibold text-base transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
                        >
                            Sign In
                            <FaArrowRight className="text-sm" />
                        </motion.button>
                    </form>
                    <p className="mt-6 text-center text-white/50 font-['Figtree']">
                        New here? <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Create account</Link>
                    </p>
                </motion.div>
            </div>

            {/* Campus Outlets Section */}
            <div className="w-full pb-64 mt-20" id="outlets">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 font-['Figtree']">
                    Campus Outlets
                </h2>
                {loading ? (
                    <div className="text-center text-white/60">Loading outlets...</div>
                ) : outlets.length === 0 ? (
                    <p className="text-center text-white/50 font-['Figtree']">No outlets found. Please check back later.</p>
                ) : (
                    <FlowingMenu
                        items={menuItems}
                        textColor="#FFFFFF"
                        bgColor="transparent"
                        marqueeBgColor="linear-gradient(to right, #2563EB, #7C3AED)"
                        marqueeTextColor="#fff"
                        borderColor="rgba(255,255,255,0.2)"
                    />
                )}
            </div>
        </div>
    );
};

export default Login;
