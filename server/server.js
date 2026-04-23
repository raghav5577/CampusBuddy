const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Allow localhost, configured CLIENT_URL, and Vercel deployments.
const allowedExactOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedExactOrigins.includes(origin)) return true;

    // Support Vercel production/preview deployments without hardcoding each URL.
    try {
        const { hostname, protocol } = new URL(origin);
        return protocol === 'https:' && hostname.endsWith('.vercel.app');
    } catch {
        return false;
    }
};

// Socket.io setup with enhanced configuration for production
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) return callback(null, true);
            return callback(new Error('Not allowed by Socket.IO CORS'));
        },
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000
});

// Make io accessible to routes/controllers
app.set('io', io);

// Socket.io events
io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('join_user_room', (userId) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined user room: ${userId}`);
    });

    socket.on('join_outlet', (outletId) => {
        socket.join(outletId);
        console.log(`Socket ${socket.id} joined outlet room: ${outletId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});

console.log('🔒 CORS allowed origins (exact):', allowedExactOrigins);
console.log('🔒 CORS allowed wildcard:', 'https://*.vercel.app');

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (isAllowedOrigin(origin)) {
            console.log('✅ CORS allowed for:', origin);
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            console.log('   Allowed exact origins:', allowedExactOrigins);
            console.log('   Allowed wildcard:', 'https://*.vercel.app');
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Body parsing
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/outlets', require('./routes/outletRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CampusBuddy server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
