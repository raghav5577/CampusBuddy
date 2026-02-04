const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// Force IPv4 locally to fix cloud SMTP issues (ENETUNREACH)
const dns = require('node:dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: true, // Allow any origin that sends the request
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for socket.io dev
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_outlet', (outletId) => {
        socket.join(outletId);
        console.log(`Socket ${socket.id} joined outlet ${outletId}`);
    });

    socket.on('join_user_room', (userId) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined user room ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Make io accessible in routes
app.set('io', io);

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/outlets', require('./routes/outletRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    // Restart trigger - fix db case
});
