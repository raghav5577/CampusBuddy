import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import socket from '../socket';
import { API_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReceipt, FaCheck, FaFire, FaBell, FaMotorcycle, FaCheckCircle, FaClock } from 'react-icons/fa';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/orders/my`, config);
                // Sort by newest first
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();

            // Join user-specific room for personalized updates
            console.log('🔌 [MyOrders] Joining user room:', user._id);
            console.log('🔌 [MyOrders] Socket connected:', socket.connected);
            socket.emit('join_user_room', user._id);

            // Listen for live updates (both event types)
            const handleOrderUpdate = (updatedOrder) => {
                console.log('🔔 [MyOrders] Order update received:', updatedOrder);
                console.log('🔔 [MyOrders] Updated order ID:', updatedOrder._id);
                console.log('🔔 [MyOrders] New status:', updatedOrder.status);

                // Only update if this order belongs to current user
                const orderUserId = updatedOrder.userId?._id || updatedOrder.userId;
                console.log('🔔 [MyOrders] Order user ID:', orderUserId);
                console.log('🔔 [MyOrders] Current user ID:', user._id);

                if (orderUserId === user._id) {
                    console.log('✅ [MyOrders] Updating order in state');
                    setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
                } else {
                    console.log('❌ [MyOrders] Ignoring - different user');
                }
            };

            socket.on('order_status_updated', (order) => {
                console.log('📡 [MyOrders] "order_status_updated" event');
                handleOrderUpdate(order);
            });

            socket.on('order_updated', (order) => {
                console.log('📡 [MyOrders] "order_updated" event');
                handleOrderUpdate(order);
            });
        }

        return () => {
            console.log('🔌 [MyOrders] Cleaning up socket listeners');
            socket.off('order_status_updated');
            socket.off('order_updated');
        };
    }, [user]);

    // Pizza Tracker Steps
    const steps = [
        { status: 'pending', label: 'Order Placed', icon: FaReceipt },
        { status: 'accepted', label: 'Accepted', icon: FaCheck },
        { status: 'preparing', label: 'Cooking', icon: FaFire },
        { status: 'ready', label: 'Ready', icon: FaBell },
        { status: 'picked-up', label: 'Picked Up', icon: FaCheckCircle },
    ];

    const getCurrentStepIndex = (status) => {
        return steps.findIndex(s => s.status === status);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[#333] border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#666]">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-end justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
                        <p className="text-[#666]">Live Order Tracking</p>
                    </div>
                    {orders.length > 0 && (
                        <div className="text-right hidden md:block">
                            <p className="text-[#0070f3] font-semibold">{orders.length} Orders</p>
                        </div>
                    )}
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 border border-[#222] rounded-xl bg-[#0a0a0a]"
                    >
                        <div className="w-16 h-16 bg-[#111] border border-[#222] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaReceipt className="text-2xl text-[#555]" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No orders right now</h3>
                        <p className="text-[#666]">Hungry? Place your first order!</p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => {
                            const currentStep = getCurrentStepIndex(order.status);
                            const isCompleted = order.status === 'picked-up';
                            const isCancelled = order.status === 'cancelled';

                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-6 rounded-xl border transition-all ${isCompleted || isCancelled ? 'border-[#222] bg-[#0a0a0a] opacity-75' : 'border-[#333] bg-[#0a0a0a] shadow-[0_0_30px_rgba(0,112,243,0.05)]'}`}
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#111] border border-[#333] flex items-center justify-center">
                                                <span className="font-bold text-white">#{order.kotNumber}</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Order #{order.kotNumber}</p>
                                                <p className="text-[#555] text-xs flex items-center gap-1">
                                                    <FaClock className="text-[10px]" />
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    <span className="mx-1">•</span>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">₹{order.totalAmount}</p>
                                            <p className="text-[#555] text-xs">Total Paid</p>
                                        </div>
                                    </div>

                                    {/* Progress Tracker (Pizza Tracker Style) */}
                                    {isCancelled ? (
                                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                                            <p className="text-red-500 font-bold mb-1">Order Cancelled</p>
                                            <p className="text-red-400/80 text-sm">This order was cancelled by the outlet.</p>
                                        </div>
                                    ) : (
                                        <div className="relative mb-8 px-2">
                                            {/* Progress Bar Background */}
                                            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#222] -translate-y-1/2 rounded-full z-0" />

                                            {/* Active Progress Bar */}
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                                className="absolute top-1/2 left-0 h-1 bg-[#0070f3] -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out"
                                            />

                                            {/* Steps */}
                                            <div className="relative z-10 flex justify-between">
                                                {steps.map((step, i) => {
                                                    const isActive = i <= currentStep;
                                                    const isCurrent = i === currentStep;

                                                    return (
                                                        <div key={step.status} className="flex flex-col items-center">
                                                            <motion.div
                                                                initial={false}
                                                                animate={{
                                                                    scale: isCurrent ? 1.2 : 1,
                                                                    backgroundColor: isActive ? (isCompleted ? '#333' : '#0070f3') : '#111',
                                                                    borderColor: isActive ? (isCompleted ? '#333' : '#0070f3') : '#333'
                                                                }}
                                                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-colors duration-500`}
                                                            >
                                                                <step.icon className={`text-[10px] ${isActive ? 'text-white' : 'text-[#666]'}`} />
                                                            </motion.div>
                                                            <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#444]'}`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Items List (Collapsible-ish) */}
                                    <div className="bg-[#111] rounded-lg p-4 border border-[#222]">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm py-1 border-b border-[#222] last:border-0 last:pb-0 first:pt-0">
                                                <span className="text-[#888]">
                                                    <span className="text-white font-medium mr-2">{item.quantity}×</span>
                                                    {item.name}
                                                </span>
                                                <span className="text-[#555]">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {!isCompleted && !isCancelled && (
                                        <div className="mt-4 text-center">
                                            <p className="text-[#0070f3] text-xs animate-pulse">
                                                Live updates enabled • Auto-refreshing status
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
