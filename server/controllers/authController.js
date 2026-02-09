const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// OTP import removed
const axios = require('axios');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, studentId, role, secretKey } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists (Email)
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }



        // Basic admin protection (for demo purposes)
        if (role === 'admin' && secretKey !== 'admin_secret_123') {
            return res.status(401).json({ message: 'Invalid admin secret key' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            studentId,
            role: role || 'student'
        });

        if (user) {


            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                outletId: user.outletId
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                outletId: user.outletId
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);

};

module.exports = {
    registerUser,
    loginUser,
    getMe,

};
