import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';

const FloatingCart = () => {
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    if (cart.length === 0) return null;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-6 left-0 right-0 z-40 px-4 md:px-6"
            >
                <div className="max-w-md mx-auto">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/cart')}
                        className="w-full bg-white text-black rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4">
                            {/* Left: Cart Icon + Count */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                        <FaShoppingCart className="text-white text-lg" />
                                    </div>
                                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#0070f3] text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                                        {totalItems}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">
                                        {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                                    </p>
                                    <p className="text-xs text-[#666]">Tap to view cart</p>
                                </div>
                            </div>

                            {/* Right: Price + Arrow */}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="font-bold text-lg">₹{totalPrice}</p>
                                    <p className="text-xs text-[#666]">Total</p>
                                </div>
                                <FaArrowRight className="text-black text-sm" />
                            </div>
                        </div>

                        {/* Progress bar animation */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            className="h-1 bg-gradient-to-r from-[#0070f3] to-[#00a3ff]"
                        />
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FloatingCart;
