const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// HTML Email Template Helper
const getOtpEmailTemplate = (name, otp) => {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4285f4; padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🎓 CampusBuddy</h1>
            </div>
            
            <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #333333; margin-top: 0; font-size: 24px;">Hello ${name}!</h2>
                
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                    You've requested to register for a CampusBuddy account. Please use the following One-Time Password (OTP) to complete your registration:
                </p>
                
                <div style="margin: 30px 0; padding: 20px; border: 2px dashed #4285f4; border-radius: 8px; display: inline-block; background-color: #f8faff;">
                    <div style="font-size: 14px; color: #666666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</div>
                    <div style="font-size: 36px; font-weight: bold; color: #4285f4; letter-spacing: 4px;">${otp}</div>
                </div>
                
                <p style="color: #888888; font-size: 14px; margin-top: 10px;">
                    This code will expire in 10 minutes.
                </p>
                
                <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #999999; font-size: 12px;">
                    If you didn't request this code, you can safely ignore this email.
                </div>
            </div>
        </div>
    `;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, studentId, role, secretKey } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            // If user exists and is verified, simple error
            if (userExists.isVerified) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Resend OTP logic for unverified user
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            userExists.name = name;
            userExists.password = password;
            userExists.phone = phone;
            userExists.otp = otp;
            userExists.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

            await userExists.save();

            const message = `Your CampusBuddy registration OTP is: ${otp}`;
            const htmlMessage = getOtpEmailTemplate(userExists.name, otp);

            try {
                // Race: Email vs Timeout
                const emailPromise = sendEmail({
                    email: userExists.email,
                    subject: 'CampusBuddy Verification Code',
                    message,
                    html: htmlMessage
                });

                await Promise.race([
                    emailPromise,
                    new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), 8000))
                ]);

                return res.status(200).json({
                    message: 'OTP sent to email',
                    email: userExists.email,
                    isVerified: false
                });
            } catch (error) {
                console.error('Resend Email Error:', error);
                // FAILSAFE: Return success anyway so user can proceed via logs
                return res.status(200).json({
                    message: 'OTP generated (Check Logs)',
                    email: userExists.email,
                    isVerified: false
                });
            }
        }

        // Basic admin protection (for demo purposes)
        if (role === 'admin' && secretKey !== 'admin_secret_123') {
            return res.status(401).json({ message: 'Invalid admin secret key' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            studentId,
            role: role || 'student',
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000 // 10 mins
        });

        if (user) {
            console.log(`[DEBUG] Generated OTP for ${user.email}: ${otp}`); // ALWAYS LOG OTP FOR DEBUGGING

            const message = `Your CampusBuddy registration OTP is: ${otp}`;
            const htmlMessage = getOtpEmailTemplate(user.name, otp);

            try {
                // Race: Email Send vs 5-second Timeout
                const emailPromise = sendEmail({
                    email: user.email,
                    subject: 'CampusBuddy Verification Code',
                    message,
                    html: htmlMessage
                });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Email sending timed out')), 8000)
                );

                await Promise.race([emailPromise, timeoutPromise]);

                res.status(201).json({
                    message: 'OTP sent to email',
                    email: user.email,
                    isVerified: false
                });
            } catch (error) {
                console.error('Email sending failed/timed out:', error);

                // CRITICAL: Even if email fails, return SUCCESS so user can enter OTP from logs
                // This stops the spinner and lets you proceed.
                res.status(201).json({
                    message: 'OTP generated (Check Server Logs if Email failed)',
                    email: user.email,
                    isVerified: false
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Verify OTP and Activate User
// @route   POST /api/auth/verify
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log('Verifying OTP for:', email, 'OTP:', otp);

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user.email, 'Stored OTP:', user.otp);

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        if (user.otp !== otp) {
            console.log('Invalid OTP. Expected:', user.otp, 'Got:', otp);
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            console.log('OTP Expired');
            return res.status(400).json({ message: 'OTP expired' });
        }

        console.log('OTP Valid. Updating user...');
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        try {
            await user.save();
            console.log('User saved successfully');
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            throw saveError;
        }

        console.log('Generating token...');
        const token = generateToken(user._id);
        console.log('Token generated');

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
            outletId: user.outletId
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
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
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first' });
            }
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
    verifyOTP
};
