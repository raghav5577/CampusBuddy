import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { api } from '../api';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

            await api.post('/orders', orderData);

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
            <div className="min-h-screen bg-black flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                    <p className="text-[#666] mb-8">Add some delicious items from our outlets!</p>
                    <Link to="/stores">
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-[#eee] transition-all">
                            <FaArrowLeft className="text-xs" />
                            Browse Outlets
                        </button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link to="/stores" className="inline-flex items-center gap-2 text-[#666] hover:text-white text-sm mb-6 transition-colors">
                        <FaArrowLeft className="text-xs" />
                        Continue shopping
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Your Cart</h1>
                    <p className="text-[#666] mt-1">{cart.length} item{cart.length > 1 ? 's' : ''} in cart</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-xl border border-[#222] bg-[#0a0a0a]"
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={item.image === 'no-food-photo.jpg' ? 'https://via.placeholder.com/80?text=Food' : item.image}
                                        alt={item.name}
                                        className="w-20 h-20 rounded-lg object-cover border border-[#222]"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="font-medium text-white">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-2 text-[#666] hover:text-[#e00] transition-colors"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                        <p className="text-[#666] text-sm mb-3">₹{item.price} each</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-[#333] rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => decreaseQuantity(item._id)}
                                                    className="w-8 h-8 flex items-center justify-center text-[#888] hover:bg-[#111] transition-colors"
                                                >
                                                    <FaMinus className="text-xs" />
                                                </button>
                                                <span className="w-10 h-8 flex items-center justify-center text-white font-medium text-sm border-x border-[#333]">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => addToCart(item, item.outletId)}
                                                    className="w-8 h-8 flex items-center justify-center text-[#888] hover:bg-[#111] transition-colors"
                                                >
                                                    <FaPlus className="text-xs" />
                                                </button>
                                            </div>
                                            <span className="font-semibold text-white">₹{item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="sticky top-24 p-6 rounded-xl border border-[#222] bg-[#0a0a0a]"
                        >
                            <h3 className="font-semibold text-white mb-4">Order Summary</h3>

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-[#888]">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-[#888]">
                                    <span>Delivery</span>
                                    <span className="text-[#50e3c2]">Free</span>
                                </div>
                                <div className="h-px bg-[#222] my-4" />
                                <div className="flex justify-between text-white font-semibold text-base">
                                    <span>Total</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-6 rounded-lg font-semibold text-sm hover:bg-[#eee] transition-all"
                            >
                                Checkout
                                <FaArrowRight className="text-xs" />
                            </button>

                            <p className="text-center text-[#555] text-xs mt-4">
                                Pay at counter when collecting
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
