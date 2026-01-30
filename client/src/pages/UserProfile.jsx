import { useContext } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const UserProfile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="pt-24 min-h-screen text-white px-6">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-['Figtree'] font-bold mb-8"
                >
                    Profile Settings
                </motion.h1>

                {user && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {/* Profile Info Card */}
                        <div className="md:col-span-1 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-fit">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-[#5227FF] rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                                    {user.name.charAt(0)}
                                </div>
                                <h2 className="text-xl font-bold font-['Figtree']">{user.name}</h2>
                                <p className="text-white/60 mb-6">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
                                <button className="w-full py-2 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/10">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Settings & Activity */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold font-['Figtree'] mb-4">Account Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-['Figtree']">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-white/40 mb-1">Email Address</p>
                                        <p>{user.email}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-white/40 mb-1">Account Type</p>
                                        <p className="capitalize">{user.role}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-white/40 mb-1">Member Since</p>
                                        <p>January 2026</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold font-['Figtree'] mb-4">Recent Activity</h3>
                                <p className="text-white/60 italic">No recent activity to show.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
