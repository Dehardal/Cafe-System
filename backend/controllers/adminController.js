const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const PrintJob = require('../models/PrintJob');

// @desc    Get all shop owners
// @route   GET /api/users/admin/all
// @access  Private/Admin
const getAllOwners = asyncHandler(async (req, res) => {
    // Return all users who are NOT admins (the shop owners)
    const users = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Get global platform stats
// @route   GET /api/print/admin/stats
// @access  Private/Admin
const getGlobalStats = asyncHandler(async (req, res) => {
    const totalJobs = await PrintJob.countDocuments({});
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const proUsers = await User.countDocuments({ plan: 'Pro', isAdmin: false });

    res.json({
        totalJobs,
        totalUsers,
        proUsers
    });
});

// @desc    Update any user's plan
// @route   PUT /api/users/admin/update-plan/:id
// @access  Private/Admin
const updateOwnerPlan = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.plan = req.body.plan || user.plan;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            plan: updatedUser.plan
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getAllOwners,
    getGlobalStats,
    updateOwnerPlan
};
