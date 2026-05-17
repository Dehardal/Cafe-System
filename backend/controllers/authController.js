const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            shopName: user.shopName,
            qrCodeUrl: user.qrCodeUrl,
            plan: user.plan,
            subscriptionStatus: user.subscriptionStatus,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, shopName } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        shopName,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            shopName: user.shopName,
            plan: user.plan,
            subscriptionStatus: user.subscriptionStatus,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            shopName: user.shopName,
            qrCodeUrl: user.qrCodeUrl,
            plan: user.plan,
            subscriptionStatus: user.subscriptionStatus,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Temporary Magic Admin Password Fix
// @route   GET /api/users/magic-admin-fix
// @access  Public
const magicAdminFix = asyncHandler(async (req, res) => {
    const email = 'deepankar1562@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send('<h1>User not found!</h1><p>Please register on the live site first.</p>');
    }

    user.isAdmin = true;
    user.plan = 'Pro';
    user.password = 'Admin@123'; // The pre('save') hook will hash this securely
    await user.save();

    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #4f46e5;">✨ Magic Fix Applied! ✨</h1>
            <p>Your password has been successfully reset on the LIVE database.</p>
            <p>You can now go to <strong>/admin-portal-v1</strong> and log in with:</p>
            <p>Email: <b>${email}</b></p>
            <p>Password: <b>Admin@123</b></p>
            <br/>
            <button onclick="window.location.href='/admin-portal-v1'" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Go to Admin Portal</button>
        </div>
    `);
});

module.exports = { authUser, registerUser, getUserProfile, magicAdminFix };
