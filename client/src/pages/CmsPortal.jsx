import { useState, useEffect, useContext } from 'react';
import { api } from '../api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaSearch, FaTimes, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const CmsPortal = () => {
    const [outlets, setOutlets] = useState([]);
    const [selectedOutletId, setSelectedOutletId] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [initialMenuItems, setInitialMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [menuSearch, setMenuSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemForm, setItemForm] = useState({ name: '', price: '', description: '', category: '', prepTime: 10, image: '' });
    
    const { user } = useContext(AuthContext);

    // Fetch Outlets
    useEffect(() => {
        const fetchOutlets = async () => {
            if (user && !user.outletId) {
                try {
                    const { data } = await api.get('/outlets?all=true');
                    setOutlets(data);
                    if (data.length > 0) setSelectedOutletId(data[0]._id);
                } catch (error) {
                    console.error("Failed to fetch outlets", error);
                }
            } else if (user && user.outletId) {
                try {
                    const { data } = await api.get(`/outlets/${user.outletId}`);
                    setOutlets([data]);
                    setSelectedOutletId(user.outletId);
                } catch (error) {
                    console.error("Failed to fetch assigned outlet", error);
                }
            }
        };
        fetchOutlets();
    }, [user]);

    // Fetch Menu Items
    useEffect(() => {
        if (!selectedOutletId) {
            setLoading(false);
            return;
        }

        const fetchMenu = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/outlets/${selectedOutletId}/menu`);
                setMenuItems(data);
                setInitialMenuItems(JSON.parse(JSON.stringify(data)));
            } catch (error) {
                console.error(error);
                toast.error('Failed to load menu items');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [selectedOutletId]);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setItemForm({ name: item.name, price: item.price, description: item.description || '', category: item.category, prepTime: item.prepTime || 10, image: item.image || '' });
        } else {
            setEditingItem(null);
            setItemForm({ name: '', price: '', description: '', category: '', prepTime: 10, image: '' });
        }
        setIsModalOpen(true);
    };

    const handleSaveItem = (e) => {
        e.preventDefault();
        if (editingItem) {
            setMenuItems(prev => prev.map(i => i._id === editingItem._id ? { ...i, ...itemForm } : i));
            toast.success('Item updated locally (remember to save changes)');
        } else {
            const newItem = {
                ...itemForm,
                _id: 'temp_' + Date.now().toString(),
                outletId: selectedOutletId,
                isAvailable: true
            };
            setMenuItems(prev => [...prev, newItem]);
            toast.success('Item added locally (remember to save changes)');
        }
        setIsModalOpen(false);
    };

    const handleDeleteItem = (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        setMenuItems(prev => prev.filter(i => i._id !== itemId));
        toast.info('Item removed locally (remember to save changes)');
    };

    const toggleItemAvailability = (item) => {
        setMenuItems(prev => prev.map(i => i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i));
    };

    const handleBulkSave = async () => {
        if (!selectedOutletId) return;
        setSaving(true);
        try {
            const { data } = await api.put(`/outlets/${selectedOutletId}/menu/bulk`, menuItems);
            setMenuItems(data);
            setInitialMenuItems(JSON.parse(JSON.stringify(data)));
            toast.success('All changes saved successfully to the database');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save changes to database');
        } finally {
            setSaving(false);
        }
    };

    const hasUnsavedChanges = JSON.stringify(menuItems) !== JSON.stringify(initialMenuItems);

    // Group menu items by category (with search applied)
    const searchedMenuItems = menuSearch.trim()
        ? menuItems.filter(item =>
            item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
            item.description?.toLowerCase().includes(menuSearch.toLowerCase())
        )
        : menuItems;

    const menuByCategory = searchedMenuItems.reduce((acc, item) => {
        const cat = item.category || 'Others';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    const unavailableCount = menuItems.filter(i => !i.isAvailable).length;

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">CMS Portal</h1>
                            </div>
                            <p className="text-[#666]">Manage main menu items</p>
                        </div>

                        {user && !user.outletId && (
                            <div className="flex items-center gap-2 bg-[#111] border border-[#333] rounded-lg px-3 py-2">
                                <span className="text-[#666] text-sm">Outlet:</span>
                                <select
                                    className="bg-transparent text-white border-none focus:outline-none text-sm"
                                    value={selectedOutletId || ''}
                                    onChange={(e) => setSelectedOutletId(e.target.value)}
                                >
                                    {outlets.map(o => (
                                        <option key={o._id} value={o._id} className="bg-black">
                                            {o.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Menu Editor</h2>
                                    <p className="text-[#666] text-sm mt-1">
                                        Add, edit, or remove menu items directly.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
                                    {unavailableCount > 0 && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-red-400 text-sm font-medium">{unavailableCount} unavailable</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleOpenModal()}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#222] text-white border border-[#444] rounded-lg hover:bg-[#333] transition-colors font-medium text-sm"
                                    >
                                        <FaPlus /> Add Item
                                    </button>
                                    <button
                                        onClick={handleBulkSave}
                                        disabled={saving || !hasUnsavedChanges}
                                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all ${hasUnsavedChanges 
                                            ? 'bg-[#0070f3] text-white hover:bg-[#0060df] shadow-[0_0_15px_rgba(0,112,243,0.4)]' 
                                            : 'bg-[#111] text-[#666] border border-[#333] cursor-not-allowed'}`}
                                    >
                                        {saving ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Search bar */}
                            <div className="relative mt-4">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-xs pointer-events-none" />
                                <input
                                    type="text"
                                    value={menuSearch}
                                    onChange={(e) => setMenuSearch(e.target.value)}
                                    placeholder="Search items by name..."
                                    className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-[#111] border border-[#333] text-white placeholder-[#555] focus:outline-none focus:border-[#555] transition-colors"
                                />
                                {menuSearch && (
                                    <button
                                        onClick={() => setMenuSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {searchedMenuItems.length === 0 ? (
                            <div className="text-center py-20 border border-[#222] rounded-xl bg-[#0a0a0a]">
                                {menuSearch ? (
                                    <>
                                        <p className="text-[#666] mb-2">No items match &ldquo;{menuSearch}&rdquo;</p>
                                        <button onClick={() => setMenuSearch('')} className="text-sm text-[#0070f3] hover:underline">Clear search</button>
                                    </>
                                ) : (
                                    <>
                                        <FaUtensils className="text-4xl text-[#333] mx-auto mb-4" />
                                        <p className="text-[#666]">No menu items found</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(menuByCategory).map(([category, items]) => (
                                    <div key={category}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-sm font-semibold text-[#888] uppercase tracking-widest">{category}</h3>
                                            <div className="flex-1 h-px bg-[#222]" />
                                            <span className="text-xs text-[#555]">{items.length} item{items.length > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {items.map((item) => (
                                                <motion.div
                                                    key={item._id}
                                                    layout
                                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${item.isAvailable
                                                        ? 'border-[#222] bg-[#0a0a0a]'
                                                        : 'border-[#1a1a1a] bg-[#080808] opacity-60'
                                                        }`}
                                                >
                                                    {/* Item info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className={`font-medium truncate ${item.isAvailable ? 'text-white' : 'text-[#555] line-through'}`}>
                                                                {item.name}
                                                            </p>
                                                            {!item.isAvailable && (
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap">
                                                                    Unavailable
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[#666] text-sm mt-0.5">₹{item.price}</p>
                                                    </div>

                                                    {/* Toggle and Actions button */}
                                                    <div className="flex items-center gap-3 ml-2">
                                                        <button
                                                            onClick={() => handleOpenModal(item)}
                                                            className="p-2 text-[#666] hover:text-[#0070f3] transition-colors"
                                                            title="Edit Item"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item._id)}
                                                            className="p-2 text-[#666] hover:text-red-500 transition-colors"
                                                            title="Delete Item"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleItemAvailability(item)}
                                                            title={item.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                                                            className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 ${item.isAvailable
                                                                ? 'bg-[#50e3c2]'
                                                                : 'bg-[#333]'
                                                                } cursor-pointer hover:opacity-90`}
                                                        >
                                                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${item.isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Modal for Add/Edit Menu Item */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-[#222] flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">
                                    {editingItem ? 'Edit Menu Item' : 'Add New Item'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-[#666] hover:text-white transition-colors">
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#888] mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={itemForm.name}
                                        onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#050505] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#555]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#888] mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={itemForm.price}
                                            onChange={e => setItemForm({ ...itemForm, price: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#050505] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#555]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#888] mb-1">Prep Time (min)</label>
                                        <input
                                            type="number"
                                            value={itemForm.prepTime}
                                            onChange={e => setItemForm({ ...itemForm, prepTime: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#050505] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#555]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888] mb-1">Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={itemForm.category}
                                        onChange={e => setItemForm({ ...itemForm, category: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#050505] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#555]"
                                        placeholder="e.g. Snacks, Beverages"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888] mb-1">Description (optional)</label>
                                    <textarea
                                        value={itemForm.description}
                                        onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#050505] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#555] resize-none h-20"
                                    ></textarea>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-[#333] text-white hover:bg-[#222] transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 rounded-lg bg-[#0070f3] text-white hover:bg-[#0060df] transition-colors font-medium"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CmsPortal;
