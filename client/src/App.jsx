import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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
import AuroraBackground from './components/AuroraBackground';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AuroraBackground>
          <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100vh', overflowY: 'auto', paddingTop: '80px' }}>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/outlet/:id" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

                <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              </Routes>
              <Footer />
              <ToastContainer position="bottom-right" />
            </Router>
          </div>
        </AuroraBackground>
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
