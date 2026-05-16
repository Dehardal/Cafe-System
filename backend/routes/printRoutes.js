const express = require('express');
const router = express.Router();
const { createPrintJob, getPrintJobs, updateJobStatus, deleteJob, getFile } = require('../controllers/printController');
const { getGlobalStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { upload } = require('../utils/storage');

router.post('/upload', upload.single('file'), createPrintJob);
router.get('/', protect, getPrintJobs);
router.get('/file/:filename', getFile); // Route to serve files from GridFS
router.put('/:id/status', protect, updateJobStatus);
router.delete('/:id', protect, deleteJob);

// Admin Routes
router.get('/admin/stats', protect, admin, getGlobalStats);

module.exports = router;
