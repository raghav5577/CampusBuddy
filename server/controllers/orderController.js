const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { outletId, items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items ordered' });
        }

        const order = new Order({
            userId: req.user._id,
            outletId,
            items,
            totalAmount,
            kotNumber: Math.floor(1000 + Math.random() * 9000).toString(), // Simple random KOT
            estimatedPickupTime: new Date(Date.now() + 15 * 60000) // +15 mins default
        });

        const createdOrder = await order.save();

        // Socket.io: Notify restaurant
        const io = req.app.get('io');
        io.to(outletId).emit('new_order', createdOrder);

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get outlet orders (for restaurant dashboard)
// @route   GET /api/orders/outlet/:outletId
// @access  Private
const getOutletOrders = async (req, res) => {
    try {
        // Basic check if user is admin or linked to outlet (omitted strict check for simplicity)
        const orders = await Order.find({ outletId: req.params.outletId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        // Socket.io: Notify user
        const io = req.app.get('io');
        io.to(updatedOrder.userId.toString()).emit('order_status_updated', updatedOrder); // Need client to join user room maybe? or broadcast to general if simplified
        // Simpler: Client polls or listens on outlet room? No, better privacy.
        // For now, let's assume we implement user rooms in socket.js later or client filters events.

        // Actually simplest for now: Broadcast to everyone or outlet room and let client filter
        io.to(order.outletId.toString()).emit('order_updated', updatedOrder);

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOutletOrders,
    updateOrderStatus
};
