import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import { FaPlus, FaClock } from 'react-icons/fa';
import { API_URL } from '../config';

const Menu = () => {
    const { id } = useParams();
    const [outlet, setOutlet] = useState(null);
    // ...
    useEffect(() => {
        const fetchOutlet = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/outlets/${id}`);
                setOutlet(data);
            } catch (error) {
                console.error(error);
                // navigate('/'); // Redirect if invalid
            } finally {
                setLoading(false);
            }
        };
        fetchOutlet();
    }, [id, navigate]);

    if (loading) return <div className="container" style={{ marginTop: '20px' }}>Loading menu...</div>;
    if (!outlet) return <div className="container" style={{ marginTop: '20px' }}>Outlet not found</div>;

    // Group items by category
    const menuByCategory = outlet.menuItems ? outlet.menuItems.reduce((acc, item) => {
        const cat = item.category || 'Others';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {}) : {};

    return (
        <div className="container" style={{ marginTop: '30px' }}>
            <div className="card" style={{ padding: '30px', marginBottom: '30px', display: 'flex', gap: '30px', alignItems: 'center' }}>
                <img
                    src={outlet.image === 'no-photo.jpg' ? 'https://via.placeholder.com/150' : outlet.image}
                    alt={outlet.name}
                    style={{ width: '150px', height: '150px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                    <h1>{outlet.name}</h1>
                    <p>{outlet.description}</p>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '20px', color: '#666' }}>
                        <span>📍 {outlet.location}</span>
                        <span>⏱️ Avg Prep: {outlet.averagePrepTime} min</span>
                    </div>
                </div>
            </div>

            {Object.entries(menuByCategory).map(([category, items]) => (
                <div key={category} style={{ marginBottom: '40px' }}>
                    <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>{category}</h2>
                    <div className="grid">
                        {items.map(item => (
                            <div key={item._id} className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                                <img
                                    src={item.image === 'no-food-photo.jpg' ? 'https://via.placeholder.com/300x200?text=Food' : item.image}
                                    alt={item.name}
                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <h3 style={{ fontSize: '1.2rem' }}>{item.name}</h3>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{item.price}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#777', marginBottom: '15px' }}>{item.description}</p>
                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaClock /> {item.prepTime || 10}m
                                        </span>
                                        <button
                                            className="btn"
                                            style={{ padding: '5px 15px', fontSize: '0.9rem' }}
                                            onClick={() => addToCart(item, outlet._id)}
                                            disabled={!item.isAvailable || !outlet.isOpen}
                                        >
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Menu;
