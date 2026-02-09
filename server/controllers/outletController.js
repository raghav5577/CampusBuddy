const Outlet = require('../models/Outlet');
const MenuItem = require('../models/MenuItem');

// @desc    Get all outlets
// @route   GET /api/outlets
// @access  Public
const getOutlets = async (req, res) => {
    try {
        const query = req.query.all === 'true' ? {} : { isOpen: true };
        const outlets = await Outlet.find(query);
        res.json(outlets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get outlet by ID with menu
// @route   GET /api/outlets/:id
// @access  Public
const getOutletById = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);

        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found' });
        }

        const menuItems = await MenuItem.find({ outletId: req.params.id });

        res.json({ ...outlet.toObject(), menuItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new outlet
// @route   POST /api/outlets
// @access  Private/Admin
const createOutlet = async (req, res) => {
    try {
        const outlet = await Outlet.create(req.body);
        res.status(201).json(outlet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add menu item to outlet
// @route   POST /api/outlets/:id/menu
// @access  Private/Admin
const addMenuItem = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);

        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found' });
        }

        const menuItem = await MenuItem.create({
            ...req.body,
            outletId: req.params.id
        });

        res.status(201).json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle outlet status (Open/Close)
// @route   PATCH /api/outlets/:id/toggle-status
// @access  Private/Admin
const toggleOutletStatus = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);

        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found' });
        }

        // Use findByIdAndUpdate to avoid validation errors on legacy data with missing fields
        // and get the updated document in one go.
        const updatedOutlet = await Outlet.findByIdAndUpdate(
            req.params.id,
            { isOpen: !outlet.isOpen },
            { new: true }
        );

        console.log(`[Outlet] Toggled status for ${outlet.name} (${outlet._id}) to ${updatedOutlet.isOpen}`);

        res.json(updatedOutlet);
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
    toggleOutletStatus
};
