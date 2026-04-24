const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = process.env.GOOGLE_CLIENT_ID
    ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    : null;

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, studentId, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            studentId,
            authProvider: 'local',
            role: role || 'student'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                outletId: user.outletId,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.authProvider === 'google') {
            return res.status(400).json({ message: 'This account uses Google sign-in. Please continue with Google.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            outletId: user.outletId,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate/Register user with Google OAuth token
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    try {
        if (!googleClient) {
            return res.status(500).json({ message: 'Google OAuth is not configured on server' });
        }

        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'Google credential token is required' });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.sub) {
            return res.status(401).json({ message: 'Invalid Google token payload' });
        }

        let user = await User.findOne({ email: payload.email });

        if (!user) {
            user = await User.create({
                name: payload.name || payload.email.split('@')[0],
                email: payload.email,
                phone: '',
                authProvider: 'google',
                googleId: payload.sub,
                password: crypto.randomBytes(32).toString('hex')
            });
        } else {
            let needsSave = false;

            if (!user.googleId) {
                user.googleId = payload.sub;
                needsSave = true;
            }

            if (!user.name && payload.name) {
                user.name = payload.name;
                needsSave = true;
            }

            if (needsSave) {
                await user.save();
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            outletId: user.outletId,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            outletId: user.outletId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser, getMe, googleAuth };
