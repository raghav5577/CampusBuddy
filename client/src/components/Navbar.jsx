import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { FaShoppingCart, FaSignOutAlt, FaBars, FaTimes, FaUser, FaArrowRight, FaStore } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Stores', path: '/stores' },
        { name: 'Contact Us', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed top-4 left-0 w-full z-50 flex justify-center px-8 pointer-events-none">
            <div className="w-full max-w-7xl flex justify-between items-center pointer-events-auto transition-all duration-300">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="text-2xl"
                    >
                        🍔
                    </motion.div>
                    <span className="text-white font-['Figtree'] font-medium text-xl tracking-tight group-hover:text-[#FF6B6B] transition-colors">
                        CampusBuddy
                    </span>
                </Link>

                {/* Center Nav Pill - Spacious */}
                <nav className="hidden md:flex items-center gap-2 bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2 shadow-[0_8px_32px_rgba(31,38,135,0.15)]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-5 py-2.5 text-[15px] font-['Figtree'] transition-all duration-300 whitespace-nowrap ${isActive(link.path) ? 'text-white font-medium' : 'text-white/50 hover:text-white/80'
                                }`}
                        >
                            {link.name}
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="activeDot"
                                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right Action Button - Profile Section */}
                <div className="flex items-center gap-8">
                    {/* Cart Icon */}
                    <Link to="/cart" className="relative hidden md:block text-white/80 hover:text-white transition-colors">
                        <FaShoppingCart className="text-2xl" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-[#1a1a1a]">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {!user ? (
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full p-1.5 pl-5 pr-1.5 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] border border-white/10"
                            >
                                <span className="text-white font-['Figtree'] font-bold text-sm">Login</span>
                                <span className="flex items-center justify-center bg-[#0b0b0b] w-10 h-8 rounded-full">
                                    <FaArrowRight className="text-white text-xs" />
                                </span>
                            </motion.button>
                        </Link>
                    ) : (
                        <div className="relative group">
                            <Link to="/profile">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full p-1.5 pl-6 pr-1.5 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] border border-white/10"
                                >
                                    <span className="text-white font-['Figtree'] font-semibold text-sm truncate max-w-[120px]">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <span className="flex items-center justify-center bg-[#0b0b0b] px-4 h-9 rounded-full text-[10px] font-bold tracking-wider text-white/90 uppercase">
                                        Profile
                                    </span>
                                </motion.button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-4 right-4 bg-[#060010]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-2 md:hidden pointer-events-auto shadow-2xl z-50"
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`p-3 rounded-xl text-center font-['Figtree'] ${isActive(link.path) ? 'bg-white/10 text-white' : 'text-white/60'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-3 rounded-xl text-center font-['Figtree'] text-white/60"
                        >
                            Profile
                        </Link>
                        <Link
                            to="/cart"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-3 rounded-xl text-center font-['Figtree'] flex justify-center items-center gap-2 text-white/60"
                        >
                            Cart ({cart.length})
                        </Link>
                        {user ? (
                            <button onClick={handleLogout} className="p-3 bg-[#FF4757]/20 text-[#FF4757] rounded-xl text-center font-medium mt-2">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-[#5227FF] rounded-xl text-center text-white mt-2">
                                Login / Sign Up
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
