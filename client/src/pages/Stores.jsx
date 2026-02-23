import { useState, useEffect } from 'react';
import FlowingMenu from '../components/FlowingMenu';
import { motion } from 'framer-motion';
import { api } from '../api';
import { toast } from 'react-toastify';

const Stores = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/outlets');
                setOutlets(data);
            } catch (error) {
                console.error('Error fetching outlets:', error);
                toast.error(error.message || 'Failed to load outlets. Please refresh.');
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
        <div className="min-h-screen bg-black pt-24 pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#333] bg-[#111] mb-8">
                        <span className="w-2 h-2 bg-[#50e3c2] rounded-full animate-pulse" />
                        <span className="text-sm text-[#888]">{outlets.length} outlets open now</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Campus Outlets
                    </h1>
                    <p className="text-[#666] text-lg max-w-xl mx-auto">
                        Browse all available food outlets on campus. Click on any outlet to view their menu.
                    </p>
                </motion.div>
            </div>

            {/* Outlets FlowingMenu */}
            <div className="w-full" id="outlets">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-2 border-[#333] border-t-white rounded-full animate-spin mb-4" />
                        <p className="text-[#666] text-sm">Loading outlets...</p>
                    </div>
                ) : outlets.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[#666] text-lg mb-2">No outlets found</p>
                        <p className="text-[#555] text-sm">Please check back later</p>
                    </div>
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

            {/* Quick Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl mx-auto px-6 mt-20"
            >
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: 'Operating Hours', value: '8 AM - 10 PM', desc: 'Most outlets' },
                        { title: 'Average Wait Time', value: '5-15 min', desc: 'Order ready' },
                        { title: 'Payment', value: 'Pay at Counter', desc: 'Cash & UPI' }
                    ].map((info, i) => (
                        <div key={i} className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] text-center">
                            <p className="text-[#666] text-sm mb-1">{info.title}</p>
                            <p className="text-2xl font-bold text-white mb-1">{info.value}</p>
                            <p className="text-[#555] text-xs">{info.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Stores;
