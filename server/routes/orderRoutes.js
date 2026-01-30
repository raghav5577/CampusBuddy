const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOutletOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/outlet/:outletId', protect, getOutletOrders); // Should be admin/staff protected
router.patch('/:id/status', protect, updateOrderStatus); // Should be admin/staff protected

module.exports = router;
