const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const OTP = require('../models/Otp');
const axios = require('axios');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Send OTP to mobile number
// @route   POST /api/auth/send-otp
// @access  Public
const sendMobileOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: 'Please provide a phone number' });
        }

        // Check if user already exists with this phone
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ message: 'User with this phone number already exists' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTP for this phone
        await OTP.findOneAndDelete({ phone });

        // Save new OTP
        await OTP.create({ phone, otp });

        console.log(`Sending OTP to ${phone}: ${otp}`);

        // Send SMS via Fast2SMS (Free Tier/Credits solution)
        // NOTE: For "Real Users" without paying, Fast2SMS is one of the few with free credits.
        // REQUIRES: FAST2SMS_API_KEY in .env
        const apiKey = process.env.FAST2SMS_API_KEY;

        if (apiKey) {
            try {
                // Fast2SMS API call
                const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                    params: {
                        authorization: apiKey,
                        variables_values: otp,
                        route: 'otp',
                        numbers: phone
                    }
                });

                if (response.data.return) {
                    console.log('Fast2SMS Success:', response.data);
                } else {
                    console.error('Fast2SMS Error:', response.data);
                    // Fallback to console log if API fails (so dev still works)
                }
            } catch (smsError) {
                console.error('Failed to send SMS via API:', smsError.message);
                // Continue execution so user isn't blocked in dev mode
            }
        } else {
            console.log('FAST2SMS_API_KEY not found in .env. OTP logged to console only.');
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, otp, studentId, role, secretKey } = req.body;

        if (!name || !email || !password || !phone || !otp) {
            return res.status(400).json({ message: 'Please add all fields including OTP' });
        }

        // Check if user exists (Email)
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({ phone });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
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
            // Delete OTP after successful registration
            await OTP.deleteOne({ _id: otpRecord._id });

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
    sendMobileOtp
};
