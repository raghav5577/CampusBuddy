const Order = require('../models/Order');
const Outlet = require('../models/Outlet');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { outletId, items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items ordered' });
        }

        // Check if outlet is open
        const outlet = await Outlet.findById(outletId);
        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found' });
        }
        if (!outlet.isOpen) {
            return res.status(400).json({ message: 'This outlet is currently closed and not accepting orders.' });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Count orders for this outlet today
        const orderCount = await Order.countDocuments({
            outletId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // Sequential Number: 1, 2, 3...
        const nextOrderNumber = orderCount + 1;

        const order = new Order({
            userId: req.user._id,
            outletId,
            items,
            totalAmount,
            kotNumber: nextOrderNumber.toString(),
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

        console.log('🔔 [Server] Order status updated:', updatedOrder._id, '→', status);
        console.log('🔔 [Server] User ID:', updatedOrder.userId);
        console.log('🔔 [Server] Outlet ID:', order.outletId);

        // Socket.io: Notify user
        const io = req.app.get('io');

        // Emit to user room
        console.log('📡 [Server] Emitting "order_status_updated" to user:', updatedOrder.userId.toString());
        io.to(updatedOrder.userId.toString()).emit('order_status_updated', updatedOrder);

        // Emit to outlet room (for admin dashboard)
        console.log('📡 [Server] Emitting "order_updated" to outlet:', order.outletId.toString());
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
