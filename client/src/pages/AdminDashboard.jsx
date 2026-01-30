import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import socket from '../socket';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Using user.outletId to fetch specific orders
                if (user.outletId) {
                    const { data } = await axios.get(`http://localhost:5000/api/orders/outlet/${user.outletId}`, config);
                    setOrders(data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (user && user.outletId) {
            fetchOrders();
            socket.emit('join_outlet', user.outletId);
        }

        socket.on('new_order', (order) => {
            toast.info(`New Order #${order.kotNumber} Received!`);
            setOrders(prev => [order, ...prev]);
        });

        return () => {
            socket.off('new_order');
        };
    }, [user]);

    const updateStatus = async (orderId, status) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status }, config);

            setOrders(prev => prev.map(o => o._id === orderId ? data : o));
            toast.success(`Order status updated to ${status}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h1 className="section-title">Restaurant Dashboard</h1>

            <div className="grid">
                {orders.map(order => (
                    <div key={order._id} className="card" style={{ padding: '20px', borderLeft: order.status === 'pending' ? '5px solid orange' : '5px solid green' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h3 style={{ margin: 0 }}>KOT #{order.kotNumber}</h3>
                            <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>

                        <div style={{ background: '#f8f8f8', padding: '10px', borderRadius: '8px', margin: '10px 0' }}>
                            {order.items.map((item, i) => (
                                <div key={i} style={{ marginBottom: '5px' }}>
                                    <b>{item.quantity}x</b> {item.name}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                            {order.status === 'pending' && (
                                <button className="btn" onClick={() => updateStatus(order._id, 'accepted')}>Accept</button>
                            )}
                            {order.status === 'accepted' && (
                                <button className="btn" onClick={() => updateStatus(order._id, 'preparing')}>Start Cooking</button>
                            )}
                            {order.status === 'preparing' && (
                                <button className="btn" style={{ background: '#2ecc71' }} onClick={() => updateStatus(order._id, 'ready')}>Mark Ready</button>
                            )}
                            {order.status === 'ready' && (
                                <button className="btn" style={{ background: '#34495e' }} onClick={() => updateStatus(order._id, 'picked-up')}>Picked Up</button>
                            )}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#888' }}>
                            Status: <span style={{ textTransform: 'uppercase' }}>{order.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
