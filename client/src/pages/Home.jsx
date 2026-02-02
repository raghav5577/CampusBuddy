import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import FlowingMenu from '../components/FlowingMenu';
import { API_URL } from '../config';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    // If user is admin, they shouldn't see the landing page, 
    // they should see the kitchen dashboard (Admin Page).
    if (user && user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

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

    // Transform outlets to FlowingMenu items format
    const menuItems = outlets.map(outlet => ({
        text: outlet.name,
        link: `/outlet/${outlet._id}`,
        image: outlet.image === 'no-photo.jpg' ? 'https://via.placeholder.com/400x250?text=Outlet' : outlet.image
    }));

    return (
        <div className="relative w-full min-h-screen bg-black">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black pointer-events-none" />

            {/* Dotted pattern overlay */}
            <div className="absolute inset-0 dotted-bg opacity-30 pointer-events-none" />

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center px-6 pt-24">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#333] bg-[#111] mb-8"
                >
                    <span className="w-2 h-2 bg-[#50e3c2] rounded-full animate-pulse" />
                    <span className="text-sm text-[#888]">Now serving fresh meals daily</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-white mb-6 leading-[1.1]"
                >
                    Order food.
                    <br />
                    <span className="text-gradient-blue">Skip the line.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-[#666] max-w-xl leading-relaxed mb-10"
                >
                    The fastest way to order from campus outlets.
                    Browse menus, place orders, and get notified when ready.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <Link to="/stores">
                        <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-[#eee] transition-all hover:scale-[1.02] active:scale-[0.98]">
                            Browse Outlets
                        </button>
                    </Link>
                    <Link to="/login">
                        <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border border-[#333] hover:border-[#555] hover:bg-[#111] transition-all">
                            Get Started
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative z-10 max-w-5xl mx-auto px-6 py-16"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[#222]">
                    {[
                        { value: '5+', label: 'Campus Outlets' },
                        { value: '100+', label: 'Menu Items' },
                        { value: '2 min', label: 'Avg Order Time' },
                        { value: '24/7', label: 'Support' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-sm text-[#666]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Outlets Section */}
            <div className="relative z-10 w-full pb-32" id="outlets">
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em]">
                                Campus Outlets
                            </h2>
                            <p className="text-[#666] mt-2">Choose from your favorite food spots</p>
                        </div>
                        <Link to="/stores" className="hidden md:flex items-center gap-2 text-[#666] hover:text-white transition-colors">
                            View all
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                    </div>
                ) : outlets.length === 0 ? (
                    <p className="text-center text-[#666] py-20">No outlets found. Please check back later.</p>
                ) : (
                    <FlowingMenu
                        items={menuItems}
                        textColor="#FFFFFF"
                        bgColor="transparent"
                        marqueeBgColor="#0070f3"
                        marqueeTextColor="#fff"
                        borderColor="rgba(255,255,255,0.1)"
                    />
                )}
            </div>

            {/* Features Section */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 pb-48">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] mb-4">
                        Why CampusBuddy?
                    </h2>
                    <p className="text-[#666] max-w-xl mx-auto">
                        Built for students, by students. Simple, fast, and reliable.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '⚡',
                            title: 'Lightning Fast',
                            description: 'Place orders in seconds. No more waiting in queues.'
                        },
                        {
                            icon: '🔔',
                            title: 'Real-time Updates',
                            description: 'Get notified instantly when your order is ready.'
                        },
                        {
                            icon: '🎯',
                            title: 'Live Tracking',
                            description: 'Track your order status live, just like the big pizza apps.'
                        }
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-xl border border-[#222] bg-[#0a0a0a] hover:border-[#333] transition-all"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-[#666] text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
