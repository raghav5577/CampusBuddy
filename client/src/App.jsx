import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Stores from './pages/Stores';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        <Route path="/outlet/:id" element={<PageTransition><Menu /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/stores" element={<PageTransition><Stores /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProtectedRoute><UserProfile /></ProtectedRoute></PageTransition>} />

        <Route path="/orders" element={<PageTransition><ProtectedRoute><MyOrders /></ProtectedRoute></PageTransition>} />
        <Route path="/admin" element={<PageTransition><ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-black">
          <Router>
            <Navbar />
            <AnimatedRoutes />
            <Footer />
            <ToastContainer
              position="bottom-right"
              theme="dark"
              toastStyle={{
                backgroundColor: '#111',
                color: '#fff',
                border: '1px solid #222',
                borderRadius: '8px',
              }}
            />
          </Router>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
