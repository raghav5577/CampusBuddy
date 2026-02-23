import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import socket from '../socket';
import { toast } from 'react-toastify';
import { API_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaFire, FaBell, FaCheckCircle, FaStore, FaPrint, FaToggleOn, FaToggleOff, FaUtensils, FaClipboardList } from 'react-icons/fa';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);
    const [selectedOutletId, setSelectedOutletId] = useState(null);
    const [currentOutlet, setCurrentOutlet] = useState(null);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
    const [menuItems, setMenuItems] = useState([]);
    const [menuLoading, setMenuLoading] = useState(false);
    const [togglingItemId, setTogglingItemId] = useState(null);
    const { user } = useContext(AuthContext);

    // Fetch Outlets
    useEffect(() => {
        const fetchOutlets = async () => {
            if (user && !user.outletId) {
                try {
                    const { data } = await axios.get(`${API_URL}/outlets?all=true`);
                    setOutlets(data);
                    if (data.length > 0) setSelectedOutletId(data[0]._id);
                } catch (error) {
                    console.error("Failed to fetch outlets", error);
                }
            } else if (user && user.outletId) {
                try {
                    const { data } = await axios.get(`${API_URL}/outlets/${user.outletId}`);
                    setOutlets([data]);
                    setSelectedOutletId(user.outletId);
                } catch (error) {
                    console.error("Failed to fetch assigned outlet", error);
                }
            }
        };
        fetchOutlets();
    }, [user]);

    // Fetch Orders & Outlet Details
    useEffect(() => {
        if (!selectedOutletId) {
            setLoading(false);
            return;
        }

        const fetchOrdersAndOutlet = async () => {
            setLoading(true);
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const ordersRes = await axios.get(`${API_URL}/orders/outlet/${selectedOutletId}`, config);
                setOrders(ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

                const outletRes = await axios.get(`${API_URL}/outlets/${selectedOutletId}`);
                setCurrentOutlet(outletRes.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersAndOutlet();
        socket.emit('join_outlet', selectedOutletId);

        const handleNewOrder = (order) => {
            if (order.outletId === selectedOutletId) {
                toast.info(`New Order #${order.kotNumber} Received!`);
                setOrders(prev => [order, ...prev]);
            }
        };

        socket.on('new_order', handleNewOrder);
        return () => { socket.off('new_order', handleNewOrder); };
    }, [selectedOutletId]);

    // Fetch Menu Items when Menu tab is opened
    useEffect(() => {
        if (activeTab !== 'menu' || !selectedOutletId) return;

        const fetchMenu = async () => {
            setMenuLoading(true);
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/outlets/${selectedOutletId}/menu`, config);
                setMenuItems(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load menu items');
            } finally {
                setMenuLoading(false);
            }
        };

        fetchMenu();
    }, [activeTab, selectedOutletId]);

    const updateStatus = async (orderId, status) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.patch(`${API_URL}/orders/${orderId}/status`, { status }, config);
            setOrders(prev => prev.map(o => o._id === orderId ? data : o));
            toast.success(`Order updated to ${status}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const toggleOutletStatus = async () => {
        if (!currentOutlet) return;
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.patch(`${API_URL}/outlets/${selectedOutletId}/toggle-status`, {}, config);
            setCurrentOutlet(data);
            setOutlets(prev => prev.map(o => o._id === data._id ? { ...o, isOpen: data.isOpen } : o));
            if (data.isOpen) toast.success("Store is now OPEN");
            else toast.warn("Store is now CLOSED");
        } catch (error) {
            console.error(error);
            toast.error("Failed to toggle status");
        }
    };

    const toggleItemAvailability = async (item) => {
        setTogglingItemId(item._id);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.patch(
                `${API_URL}/outlets/${selectedOutletId}/menu/${item._id}/toggle-availability`,
                {},
                config
            );
            setMenuItems(prev => prev.map(i => i._id === data._id ? data : i));
            toast.success(`"${data.name}" marked as ${data.isAvailable ? 'Available' : 'Unavailable'}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update item availability');
        } finally {
            setTogglingItemId(null);
        }
    };

    const handlePrint = (order) => {
        const printWindow = window.open('', '_blank');
        const outletName = currentOutlet ? currentOutlet.name : 'Outlet';
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Order #${order.kotNumber}</title>
                    <style>
                        body { font-family: 'Courier New', monospace; padding: 20px; width: 300px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                        .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                        .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; text-align: right; }
                        .footer { margin-top: 20px; text-align: center; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>${outletName}</h2>
                        <p>KOT #${order.kotNumber}</p>
                        <p>${new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div class="items">
                        ${order.items.map(item => `
                            <div class="item">
                                <span>${item.quantity} x ${item.name}</span>
                                <span>${item.price * item.quantity}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="total">Total: ₹${order.totalAmount}</div>
                    <div class="footer"><p>Paid via App</p><p>Thank you!</p></div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const getStatusStyles = (status) => {
        const styles = {
            pending: { bg: 'border-l-[#f5a623]', badge: 'bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20' },
            accepted: { bg: 'border-l-[#0070f3]', badge: 'bg-[#0070f3]/10 text-[#0070f3] border-[#0070f3]/20' },
            preparing: { bg: 'border-l-[#7928ca]', badge: 'bg-[#7928ca]/10 text-[#7928ca] border-[#7928ca]/20' },
            ready: { bg: 'border-l-[#50e3c2]', badge: 'bg-[#50e3c2]/10 text-[#50e3c2] border-[#50e3c2]/20' },
            'picked-up': { bg: 'border-l-[#666]', badge: 'bg-[#333] text-[#888] border-[#444]' },
            cancelled: { bg: 'border-l-red-500', badge: 'bg-red-500/10 text-red-500 border-red-500/20' },
        };
        return styles[status] || styles.pending;
    };

    const getActionButton = (order) => {
        const buttons = {
            pending: { label: 'Accept Order', icon: FaCheck, action: 'accepted', style: 'bg-[#0070f3] hover:bg-[#0060df]' },
            accepted: { label: 'Start Cooking', icon: FaFire, action: 'preparing', style: 'bg-[#7928ca] hover:bg-[#6820b0]' },
            preparing: { label: 'Mark Ready', icon: FaBell, action: 'ready', style: 'bg-[#50e3c2] hover:bg-[#40d3b2] text-black' },
            ready: { label: 'Complete', icon: FaCheckCircle, action: 'picked-up', style: 'bg-[#333] hover:bg-[#444]' },
        };
        return buttons[order.status];
    };

    // Group menu items by category
    const menuByCategory = menuItems.reduce((acc, item) => {
        const cat = item.category || 'Others';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    const unavailableCount = menuItems.filter(i => !i.isAvailable).length;
    const showOutletSelector = user && !user.outletId;
    const currentOutletName = currentOutlet ? currentOutlet.name : 'Loading...';
    const isOutletOpen = currentOutlet ? currentOutlet.isOpen : false;

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">Kitchen Dashboard</h1>
                                {currentOutlet && (
                                    <button
                                        onClick={toggleOutletStatus}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${isOutletOpen
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                            }`}
                                    >
                                        {isOutletOpen ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
                                        {isOutletOpen ? 'OPEN' : 'CLOSED'}
                                    </button>
                                )}
                            </div>
                            <p className="text-[#666]">Managing: <span className="text-white font-semibold">{currentOutletName}</span></p>
                        </div>

                        {showOutletSelector && (
                            <div className="flex items-center gap-2 bg-[#111] border border-[#333] rounded-lg px-3 py-2">
                                <FaStore className="text-[#666]" />
                                <select
                                    className="bg-transparent text-white border-none focus:outline-none text-sm"
                                    value={selectedOutletId || ''}
                                    onChange={(e) => setSelectedOutletId(e.target.value)}
                                >
                                    {outlets.map(o => (
                                        <option key={o._id} value={o._id} className="bg-black">
                                            {o.name} {o.isOpen ? '' : '(Closed)'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-[#111] border border-[#222] rounded-xl p-1 w-fit">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'orders'
                            ? 'bg-white text-black'
                            : 'text-[#666] hover:text-white'
                            }`}
                    >
                        <FaClipboardList />
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'menu'
                            ? 'bg-white text-black'
                            : 'text-[#666] hover:text-white'
                            }`}
                    >
                        <FaUtensils />
                        Menu
                        {unavailableCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                                {unavailableCount} off
                            </span>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === 'orders' ? (
                            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Closed Warning */}
                                {!isOutletOpen && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-red-400 font-medium">This outlet is currently marked as CLOSED. New orders may not be accepted.</span>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                                    {[
                                        { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f5a623' },
                                        { label: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, color: '#7928ca' },
                                        { label: 'Ready', value: orders.filter(o => o.status === 'ready').length, color: '#50e3c2' },
                                        { label: 'Completed', value: orders.filter(o => o.status === 'picked-up').length, color: '#666' },
                                        { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-[#222] bg-[#0a0a0a] text-center">
                                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                            <p className="text-sm" style={{ color: stat.color }}>{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Cards */}
                                {orders.filter(o => o.status !== 'picked-up').length === 0 ? (
                                    <div className="text-center py-20 border border-[#222] rounded-xl bg-[#0a0a0a]">
                                        <p className="text-[#666] text-lg mb-2">No active orders</p>
                                        <p className="text-[#555] text-sm">New orders will appear here automatically</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {orders.filter(o => o.status !== 'picked-up' && o.status !== 'cancelled').map((order, index) => {
                                            const statusStyle = getStatusStyles(order.status);
                                            const actionBtn = getActionButton(order);
                                            return (
                                                <motion.div
                                                    key={order._id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`p-5 rounded-xl border border-[#222] bg-[#0a0a0a] border-l-4 ${statusStyle.bg}`}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <span className="text-2xl font-bold text-white">#{order.kotNumber}</span>
                                                            <p className="text-[#666] text-sm mt-1">
                                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${statusStyle.badge}`}>
                                                                {order.status}
                                                            </span>
                                                            <button
                                                                onClick={() => handlePrint(order)}
                                                                className="text-[#666] hover:text-white transition-colors"
                                                                title="Print KOT"
                                                            >
                                                                <FaPrint />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 rounded-lg bg-[#111] border border-[#222] mb-4">
                                                        {order.items.map((item, i) => (
                                                            <div key={i} className="flex justify-between py-1 text-sm">
                                                                <span className="text-[#888]">
                                                                    <span className="text-white font-bold">{item.quantity}×</span> {item.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {actionBtn && (
                                                            <button
                                                                onClick={() => updateStatus(order._id, actionBtn.action)}
                                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm text-white transition-all ${actionBtn.style}`}
                                                            >
                                                                <actionBtn.icon />
                                                                {actionBtn.label}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Are you sure you want to cancel this order?')) {
                                                                    updateStatus(order._id, 'cancelled');
                                                                }
                                                            }}
                                                            className="px-4 py-3 rounded-lg font-semibold text-sm text-red-500 border border-red-500/30 hover:bg-red-500/10 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            /* ── MENU TAB ── */
                            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Menu Availability</h2>
                                        <p className="text-[#666] text-sm mt-1">
                                            Toggle items on/off. Unavailable items will be greyed out for customers.
                                        </p>
                                    </div>
                                    {unavailableCount > 0 && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-red-400 text-sm font-medium">{unavailableCount} item{unavailableCount > 1 ? 's' : ''} unavailable</span>
                                        </div>
                                    )}
                                </div>

                                {menuLoading ? (
                                    <div className="flex justify-center py-20">
                                        <div className="w-10 h-10 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                                    </div>
                                ) : menuItems.length === 0 ? (
                                    <div className="text-center py-20 border border-[#222] rounded-xl bg-[#0a0a0a]">
                                        <FaUtensils className="text-4xl text-[#333] mx-auto mb-4" />
                                        <p className="text-[#666]">No menu items found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {Object.entries(menuByCategory).map(([category, items]) => (
                                            <div key={category}>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <h3 className="text-sm font-semibold text-[#888] uppercase tracking-widest">{category}</h3>
                                                    <div className="flex-1 h-px bg-[#222]" />
                                                    <span className="text-xs text-[#555]">{items.length} items</span>
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

                                                            {/* Toggle button */}
                                                            <button
                                                                onClick={() => toggleItemAvailability(item)}
                                                                disabled={togglingItemId === item._id}
                                                                title={item.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                                                                className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 ${item.isAvailable
                                                                    ? 'bg-[#50e3c2]'
                                                                    : 'bg-[#333]'
                                                                    } ${togglingItemId === item._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
                                                            >
                                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${item.isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
