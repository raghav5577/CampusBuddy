import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FlowingMenu from '../components/FlowingMenu';
import { api } from '../api';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const { data } = await api.get('/outlets');
                setOutlets(data);
            } catch (error) {
                console.error('Error loading outlets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOutlets();
    }, []);

    // Transform outlets for FlowingMenu - redirect to login on click
    const menuItems = outlets.map(outlet => ({
        text: outlet.name,
        link: '/login',
        image: outlet.image === 'no-photo.jpg' ? 'https://via.placeholder.com/400x250?text=Outlet' : outlet.image
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await login(formData.email, formData.password);
        setIsSubmitting(false);
        if (success) navigate('/');
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black pointer-events-none" />

            {/* Hero Section with Login Form */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 pt-20">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Welcome back
                    </h1>
                    <p className="text-[#666] text-lg">
                        Sign in to your account to continue
                    </p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[#888] text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[#888] text-sm font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-6 rounded-lg font-semibold text-sm hover:bg-[#eee] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Continue
                                        <FaArrowRight className="text-xs" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#222]" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-[#0a0a0a] text-[#666]">OR</span>
                            </div>
                        </div>

                        <p className="text-center text-[#666] text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-white hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Campus Outlets Section */}
            <div className="relative z-10 w-full pb-32 mt-16" id="outlets">
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                        Browse Our Outlets
                    </h2>
                    <p className="text-[#666] text-center mt-2">Login to order from these outlets</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                    </div>
                ) : outlets.length === 0 ? (
                    <p className="text-center text-[#666] py-20">No outlets found.</p>
                ) : (
                    <FlowingMenu
                        items={menuItems}
                        textColor="#FFFFFF"
                        bgColor="transparent"
                        marqueeBgColor="linear-gradient(to right, #0070f3, #00a3ff)"
                        marqueeTextColor="#fff"
                        borderColor="rgba(255,255,255,0.1)"
                    />
                )}
            </div>
        </div>
    );
};

export default Login;
