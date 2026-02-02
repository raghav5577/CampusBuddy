import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import { FaPlus, FaClock, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { API_URL } from '../config';
import { motion } from 'framer-motion';

const Menu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchOutlet = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/outlets/${id}`);
                setOutlet(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOutlet();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[#333] border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#666]">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (!outlet) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#666] text-lg mb-4">Outlet not found</p>
                    <Link to="/stores" className="text-[#0070f3] hover:underline">
                        ← Back to stores
                    </Link>
                </div>
            </div>
        );
    }

    // Group items by category
    const menuByCategory = outlet.menuItems ? outlet.menuItems.reduce((acc, item) => {
        const cat = item.category || 'Others';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {}) : {};

    const categories = ['All', ...Object.keys(menuByCategory)];
    const filteredItems = activeCategory === 'All'
        ? outlet.menuItems
        : menuByCategory[activeCategory] || [];

    return (
        <div className="min-h-screen bg-black pt-20 pb-20">
            {/* Outlet Header */}
            <div className="border-b border-[#222]">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    {!outlet.isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="bg-[#e00]/10 border border-[#e00]/20 rounded-xl p-4 mb-6 flex items-center gap-3"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#e00] animate-pulse" />
                            <span className="text-[#e00] font-medium">
                                Outlet Temporarily Closed. Accepting orders soon.
                            </span>
                        </motion.div>
                    )}

                    <Link to="/stores" className="inline-flex items-center gap-2 text-[#666] hover:text-white text-sm mb-6 transition-colors">
                        <FaArrowLeft className="text-xs" />
                        Back to stores
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row gap-6 items-start"
                    >
                        {/* ... existing image and details logic ... */}
                        <img
                            src={outlet.image === 'no-photo.jpg' ? 'https://via.placeholder.com/150' : outlet.image}
                            alt={outlet.name}
                            className={`w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border border-[#333] ${!outlet.isOpen && 'grayscale opacity-70'}`}
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-white">{outlet.name}</h1>
                                {outlet.isOpen ? (
                                    <span className="px-3 py-1 text-xs font-medium bg-[#50e3c2]/10 text-[#50e3c2] rounded-full border border-[#50e3c2]/20">
                                        Open
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 text-xs font-medium bg-[#e00]/10 text-[#e00] rounded-full border border-[#e00]/20">
                                        Closed
                                    </span>
                                )}
                            </div>
                            <p className="text-[#666] mb-4">{outlet.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-[#888]">
                                <span className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-[#555]" />
                                    {outlet.location}
                                </span>
                                <span className="flex items-center gap-2">
                                    <FaClock className="text-[#555]" />
                                    {outlet.openingTime} - {outlet.closingTime}
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="text-[#555]">⏱️</span>
                                    ~{outlet.averagePrepTime} min prep
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="sticky top-16 bg-black/80 backdrop-blur-xl border-b border-[#222] z-30">
                {/* ... no changes needed to tabs ... */}
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-2 py-4 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-white text-black'
                                    : 'bg-[#111] text-[#888] border border-[#333] hover:text-white hover:border-[#555]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`group p-4 rounded-xl border border-[#222] bg-[#0a0a0a] transition-all ${!outlet.isOpen ? 'opacity-50' : 'hover:border-[#333]'}`}
                        >
                            <div className="flex gap-4">
                                <img
                                    src={item.image === 'no-food-photo.jpg' ? 'https://via.placeholder.com/80?text=Food' : item.image}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-lg object-cover border border-[#222]"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-medium text-white truncate">{item.name}</h3>
                                        <span className="text-[#0070f3] font-semibold whitespace-nowrap">₹{item.price}</span>
                                    </div>
                                    <p className="text-[#666] text-sm line-clamp-2 mb-3">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#555] text-xs flex items-center gap-1">
                                            <FaClock className="text-[10px]" />
                                            {item.prepTime || 10} min
                                        </span>
                                        <button
                                            onClick={() => addToCart(item, outlet._id)}
                                            disabled={!item.isAvailable || !outlet.isOpen}
                                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${!outlet.isOpen
                                                    ? 'bg-[#222] text-[#666] cursor-not-allowed'
                                                    : 'bg-white text-black hover:bg-[#eee]'
                                                }`}
                                        >
                                            {!outlet.isOpen ? 'Closed' : <><FaPlus className="text-[10px]" /> Add</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[#666]">No items in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
