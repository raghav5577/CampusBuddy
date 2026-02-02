import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { FaUser, FaEnvelope, FaShieldAlt, FaCalendar, FaReceipt, FaSignOutAlt } from 'react-icons/fa';

const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#666] mb-4">Please login to view your profile</p>
                    <Link to="/login" className="text-[#0070f3] hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const profileItems = [
        { icon: FaEnvelope, label: 'Email', value: user.email },
        { icon: FaShieldAlt, label: 'Account Type', value: user.role === 'admin' ? 'Administrator' : 'Student' },
        { icon: FaCalendar, label: 'Member Since', value: 'January 2026' },
    ];

    const menuItems = [
        { icon: FaReceipt, label: 'My Orders', path: '/orders', description: 'View your order history' },
    ];

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-[#666]">Manage your account preferences</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1"
                    >
                        <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#0070f3] to-[#00a3ff] rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-1">{user.name}</h2>
                            <p className="text-[#666] text-sm mb-4">
                                {user.role === 'admin' ? 'Administrator' : 'Student Account'}
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-[#50e3c2] rounded-full" />
                                <span className="text-[#888]">Active</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Info & Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Account Info */}
                        <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a]">
                            <h3 className="font-semibold text-white mb-4">Account Information</h3>
                            <div className="space-y-4">
                                {profileItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-[#111] border border-[#222]">
                                        <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-[#222] flex items-center justify-center">
                                            <item.icon className="text-[#555]" />
                                        </div>
                                        <div>
                                            <p className="text-[#666] text-xs uppercase tracking-wider">{item.label}</p>
                                            <p className="text-white text-sm font-medium">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a]">
                            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                {menuItems.map((item, i) => (
                                    <Link
                                        key={i}
                                        to={item.path}
                                        className="flex items-center gap-4 p-3 rounded-lg border border-[#222] hover:border-[#333] hover:bg-[#111] transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center group-hover:border-[#333]">
                                            <item.icon className="text-[#0070f3]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-medium">{item.label}</p>
                                            <p className="text-[#666] text-xs">{item.description}</p>
                                        </div>
                                        <svg className="w-4 h-4 text-[#555] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-[#e00]/20 bg-[#e00]/5 text-[#e00] font-medium hover:bg-[#e00]/10 transition-all"
                        >
                            <FaSignOutAlt />
                            Sign Out
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
