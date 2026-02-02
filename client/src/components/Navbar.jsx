import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { FaShoppingCart, FaSignOutAlt, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Stores', path: '/stores' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-[#222]' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-xl"
                    >
                        🍔
                    </motion.div>
                    <span className="text-white font-semibold text-lg tracking-tight">
                        CampusBuddy
                    </span>
                </Link>

                {/* Center Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive(link.path)
                                ? 'text-white'
                                : 'text-[#888] hover:text-white'
                                }`}
                        >
                            {link.name}
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Cart */}
                    <Link to="/cart" className="relative hidden md:flex p-2 text-[#888] hover:text-white transition-colors">
                        <FaShoppingCart className="text-lg" />
                        {cart.length > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0070f3] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {!user ? (
                        <Link to="/login">
                            <button className="hidden md:flex items-center gap-2 px-5 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-[#eee] transition-all">
                                Login
                                <FaArrowRight className="text-xs" />
                            </button>
                        </Link>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-medium text-[#e00] hover:text-[#ff4d4d] transition-colors bg-[#e00]/10 px-3 py-1.5 rounded-lg border border-[#e00]/20">
                                    Kitchen Dashboard
                                </Link>
                            )}
                            <Link to="/orders" className="text-sm text-[#888] hover:text-white transition-colors">
                                Orders
                            </Link>
                            <Link to="/profile">
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white font-medium text-sm rounded-lg border border-[#333] hover:border-[#555] transition-all">
                                    <div className="w-6 h-6 bg-gradient-to-br from-[#0070f3] to-[#00a3ff] rounded-full flex items-center justify-center text-[10px] font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    {user.name.split(' ')[0]}
                                </button>
                            </Link>
                            {isActive('/profile') && (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-[#e00] hover:bg-[#e00]/10 font-medium text-sm rounded-lg transition-all"
                                >
                                    <FaSignOutAlt className="text-xs" />
                                    Logout
                                </button>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute top-16 left-0 right-0 bg-black border-b border-[#222] p-4"
                    >
                        <div className="flex flex-col gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'bg-[#111] text-white'
                                        : 'text-[#888] hover:text-white hover:bg-[#111]'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="h-px bg-[#222] my-2" />

                            <Link
                                to="/cart"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-3 rounded-lg text-sm font-medium text-[#888] hover:text-white hover:bg-[#111] flex items-center justify-between"
                            >
                                Cart
                                {cart.length > 0 && (
                                    <span className="px-2 py-0.5 bg-[#0070f3] text-white text-xs rounded-full">{cart.length}</span>
                                )}
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-3 rounded-lg text-sm font-medium text-[#888] hover:text-white hover:bg-[#111]"
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-3 rounded-lg text-sm font-medium text-[#888] hover:text-white hover:bg-[#111]"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-3 rounded-lg text-sm font-medium text-[#e00] hover:bg-[#e00]/10 text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-3 rounded-lg text-sm font-medium bg-white text-black text-center mt-2"
                                >
                                    Login / Sign Up
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
