import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { API_URL } from '../config';

const Cart = () => {
    const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart, totalAmount } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please login to place order');
            navigate('/login');
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const orderData = {
                outletId: cart[0].outletId,
                items: cart.map(item => ({
                    menuItem: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount
            };

            await axios.post(`${API_URL}/orders`, orderData, config);

            clearCart();
            toast.success('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            console.error(error);
            toast.error('Failed to place order');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Your cart is empty 🛒</h2>
                <p>Go back to find some delicious food!</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '800px', marginTop: '50px' }}>
            <h1 className="section-title">Your Cart</h1>

            <div className="card" style={{ padding: '0' }}>
                {cart.map((item, index) => (
                    <div key={index} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '20px', borderBottom: '1px solid #eee'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                            <img
                                src={item.image === 'no-food-photo.jpg' ? 'https://via.placeholder.com/80?text=Food' : item.image}
                                alt={item.name}
                                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                                <h4>{item.name}</h4>
                                <span style={{ color: '#777' }}>₹{item.price} each</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0f0f0', borderRadius: '8px', padding: '5px' }}>
                                <button
                                    onClick={() => decreaseQuantity(item._id)}
                                    className="btn-outline"
                                    style={{ padding: '5px 10px', border: 'none', background: 'transparent' }}
                                >
                                    <FaMinus size={12} />
                                </button>
                                <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                <button
                                    onClick={() => addToCart(item, item.outletId)}
                                    className="btn-outline"
                                    style={{ padding: '5px 10px', border: 'none', background: 'transparent' }}
                                >
                                    <FaPlus size={12} />
                                </button>
                            </div>

                            <span style={{ fontWeight: 'bold', minWidth: '60px', textAlign: 'right' }}>₹{item.price * item.quantity}</span>

                            <button
                                onClick={() => removeFromCart(item._id)}
                                style={{ background: 'none', color: '#ff4444', fontSize: '1.2rem', padding: '5px' }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}

                <div style={{ padding: '25px', background: '#fafafa', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginBottom: '20px' }}>
                        <span>Total Amount</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{totalAmount}</span>
                    </div>
                    <button
                        className="btn"
                        style={{ width: '100%', padding: '15px' }}
                        onClick={handleCheckout}
                    >
                        Checkout & Pay Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
