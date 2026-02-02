const express = require('express');
const router = express.Router();
const { getOutlets, getOutletById, createOutlet, addMenuItem, toggleOutletStatus } = require('../controllers/outletController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getOutlets);
router.get('/:id', getOutletById);
router.post('/', protect, admin, createOutlet);
router.post('/:id/menu', protect, admin, addMenuItem);
router.patch('/:id/toggle-status', protect, admin, toggleOutletStatus);

module.exports = router;
