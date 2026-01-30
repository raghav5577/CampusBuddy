import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import socket from '../socket';
import { API_URL } from '../config';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/orders/my`, config);
                setOrders(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (user) fetchOrders();

        // Listen for live updates
        socket.on('order_updated', (updatedOrder) => {
            // To keep it simple, we just update if the ID matches one in our list
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
            // Or better: refetch or just replace
        });

        return () => {
            socket.off('order_updated');
        };
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'accepted': return 'blue';
            case 'preparing': return 'purple';
            case 'ready': return 'green';
            case 'picked-up': return 'gray';
            default: return 'black';
        }
    };

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h1 className="section-title">My Orders</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map(order => (
                    <div key={order._id} className="card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <div>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>#{order.kotNumber}</span>
                                <span style={{ marginLeft: '15px', color: '#888', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <span style={{
                                fontWeight: 'bold',
                                color: getStatusColor(order.status),
                                textTransform: 'uppercase'
                            }}>
                                {order.status}
                            </span>
                        </div>

                        <div>
                            {order.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #ddd', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total</span>
                            <span style={{ fontWeight: 'bold' }}>₹{order.totalAmount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
