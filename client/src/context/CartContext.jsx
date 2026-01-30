import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Load cart from localStorage on initial render
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            return [];
        }
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, outletId) => {
        // Check if cart has items from different outlet
        if (cart.length > 0 && cart[0].outletId !== outletId) {
            if (window.confirm('Adding items from a different outlet will clear your current cart. Proceed?')) {
                const newItem = { ...item, quantity: 1, outletId };
                setCart([newItem]);
                toast.success('Cart cleared and new item added');
            }
            return;
        }

        const existingItem = cart.find(x => x._id === item._id);
        if (existingItem) {
            setCart(cart.map(x => x._id === item._id ? { ...x, quantity: x.quantity + 1 } : x));
            toast.info('Increased quantity');
        } else {
            setCart([...cart, { ...item, quantity: 1, outletId }]);
            toast.success('Added to cart');
        }
    };

    const decreaseQuantity = (itemId) => {
        const existingItem = cart.find(x => x._id === itemId);
        if (existingItem.quantity === 1) {
            removeFromCart(itemId);
        } else {
            setCart(cart.map(x => x._id === itemId ? { ...x, quantity: x.quantity - 1 } : x));
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(x => x._id !== id));
        toast.info('Item removed from cart');
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
