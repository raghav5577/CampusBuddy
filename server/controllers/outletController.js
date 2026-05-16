const Outlet = require('../models/Outlet');
const MenuItem = require('../models/MenuItem');

// @desc    Get all outlets
// @route   GET /api/outlets
// @access  Public
const getOutlets = async (req, res) => {
    try {
        const outlets = await Outlet.find().sort({ createdAt: -1 });
        res.json(outlets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single outlet by ID (with menu items)
// @route   GET /api/outlets/:id
// @access  Public
const getOutletById = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id).populate('menuItems');
        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found' });
        }
        res.json(outlet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new outlet
// @route   POST /api/outlets
// @access  Private/Admin
const createOutlet = async (req, res) => {
    try {
        const outlet = new Outlet(req.body);
        const createdOutlet = await outlet.save();
        res.status(201).json(createdOutlet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a menu item to an outlet
// @route   POST /api/outlets/:id/menu
// @access  Private/Admin
const addMenuItem = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found' });
        }
        const menuItem = new MenuItem({ ...req.body, outletId: outlet._id });
        const savedItem = await menuItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle outlet open/closed status
// @route   PATCH /api/outlets/:id/toggle-status
// @access  Private/Admin
const toggleOutletStatus = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found' });
        }
        outlet.isOpen = !outlet.isOpen;
        const updatedOutlet = await outlet.save();

        // Notify via socket
        const io = req.app.get('io');
        if (io) {
            io.emit('outlet_status_changed', { outletId: outlet._id, isOpen: updatedOutlet.isOpen });
        }

        res.json(updatedOutlet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all menu items for an outlet (admin use)
// @route   GET /api/outlets/:id/menu
// @access  Private/Admin
const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find({ outletId: req.params.id }).sort({ category: 1, name: 1 });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle a menu item's availability
// @route   PATCH /api/outlets/:id/menu/:itemId/toggle-availability
// @access  Private/Admin
const toggleMenuItemAvailability = async (req, res) => {
    try {
        const item = await MenuItem.findOne({ _id: req.params.itemId, outletId: req.params.id });
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        item.isAvailable = !item.isAvailable;
        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a menu item
// @route   PUT /api/outlets/:id/menu/:itemId
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findOneAndUpdate(
            { _id: req.params.itemId, outletId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/outlets/:id/menu/:itemId
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findOneAndDelete({ _id: req.params.itemId, outletId: req.params.id });
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Bulk update menu items
// @route   PUT /api/outlets/:id/menu/bulk
// @access  Private/Admin
const bulkUpdateMenu = async (req, res) => {
    try {
        const outletId = req.params.id;
        const items = req.body; // Array of menu items

        // Remove all existing items for this outlet
        await MenuItem.deleteMany({ outletId });

        // Insert new items
        const newItems = items.map(item => ({
            ...item,
            outletId,
            _id: item._id && item._id.length === 24 ? item._id : undefined // keep ID if valid, otherwise new ID generated
        }));

        const inserted = await MenuItem.insertMany(newItems);
        res.json(inserted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getOutlets,
    getOutletById,
    createOutlet,
    addMenuItem,
    getMenuItems,
    toggleMenuItemAvailability,
    toggleOutletStatus,
    updateMenuItem,
    deleteMenuItem,
    bulkUpdateMenu
};
