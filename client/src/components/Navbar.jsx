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
                <nav className="hidden md:flex items-center gap-4 bg-[#060010]/60 backdrop-blur-xl border border-white/5 rounded-full p-2 shadow-[0_8px_32px_rgba(31,38,135,0.15)]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-8 py-3 rounded-full text-base font-['Figtree'] transition-all duration-300 whitespace-nowrap ${isActive(link.path) ? 'text-white font-medium' : 'text-white/60 hover:text-white'
                                }`}
                        >
                            {link.name}
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="activeDot"
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
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
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-between gap-4 bg-[#FF6B6B] hover:bg-[#ff5252] text-white pl-6 pr-1.5 py-1.5 rounded-full font-['Figtree'] font-medium text-sm transition-all border border-white/10 min-w-[200px] shadow-lg shadow-[#FF6B6B]/20"
                            >
                                <span>Login</span>
                                <span className="flex items-center justify-center bg-[#060010] w-[80px] h-[36px] rounded-full text-xs font-semibold">
                                    <FaArrowRight className="text-white" />
                                </span>
                            </motion.button>
                        </Link>
                    ) : (
                        <div className="relative group">
                            <Link to="/profile">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-between gap-3 bg-[#FF6B6B] hover:bg-[#ff5252] text-white pl-6 pr-2 py-2 rounded-full font-['Figtree'] font-medium text-base transition-all border border-white/10 min-w-[220px] shadow-lg shadow-[#FF6B6B]/20"
                                >
                                    <span className="truncate max-w-[150px] text-left font-semibold">{user.name.split(' ')[0]}</span>
                                    <span className="flex items-center justify-center bg-[#000000]/20 px-5 h-[40px] rounded-full text-xs font-bold gap-2 shrink-0 tracking-wide uppercase">
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
