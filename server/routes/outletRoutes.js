const express = require('express');
const router = express.Router();
const { getOutlets, getOutletById, createOutlet, addMenuItem, getMenuItems, toggleMenuItemAvailability, toggleOutletStatus, updateMenuItem, deleteMenuItem, bulkUpdateMenu } = require('../controllers/outletController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getOutlets);
router.get('/:id', getOutletById);
router.post('/', protect, admin, createOutlet);
router.get('/:id/menu', protect, admin, getMenuItems);
router.post('/:id/menu', protect, admin, addMenuItem);
router.patch('/:id/toggle-status', protect, admin, toggleOutletStatus);
router.patch('/:id/menu/:itemId/toggle-availability', protect, admin, toggleMenuItemAvailability);
router.put('/:id/menu/bulk', protect, admin, bulkUpdateMenu);
router.put('/:id/menu/:itemId', protect, admin, updateMenuItem);
router.delete('/:id/menu/:itemId', protect, admin, deleteMenuItem);

module.exports = router;
