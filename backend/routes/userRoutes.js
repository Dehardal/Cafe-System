const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile } = require('../controllers/authController');
const { getAllOwners, updateOwnerPlan } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

// Admin Routes
router.get('/admin/all', protect, admin, getAllOwners);
router.put('/admin/update-plan/:id', protect, admin, updateOwnerPlan);

module.exports = router;
