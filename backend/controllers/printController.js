const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const PrintJob = require('../models/PrintJob');

// GridFS Bucket initialization
let bucket;
mongoose.connection.once('open', () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

// @desc    Create a new print job
// @route   POST /api/print/upload
// @access  Public
const createPrintJob = asyncHandler(async (req, res) => {
    const { ownerId, customerName, phone, copies, printType, notes } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    // Manual GridFS Streaming
    const filename = `${Date.now()}-${req.file.originalname}`;
    const uploadStream = bucket.openUploadStream(filename, {
        contentType: req.file.mimetype
    });

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    // Promise to handle the upload completion
    const uploadResult = await new Promise((resolve, reject) => {
        readableStream.pipe(uploadStream)
            .on('error', reject)
            .on('finish', () => resolve(uploadStream.id));
    });

    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/api/print/file/${filename}`;

    const printJob = await PrintJob.create({
        ownerId,
        customerName,
        phone,
        fileUrl,
        cloudinaryId: uploadResult.toString(), // Use the actual GridFS ID
        fileName: req.file.originalname,
        copies,
        printType,
        notes,
    });

    if (printJob) {
        const io = req.app.get('socketio');
        if (io) {
            io.to(ownerId.toString()).emit('new_job', printJob);
        }
        res.status(201).json(printJob);
    } else {
        res.status(400);
        throw new Error('Invalid job data');
    }
});

// @desc    Stream file from GridFS
// @route   GET /api/print/file/:filename
// @access  Public
const getFile = asyncHandler(async (req, res) => {
    const files = await bucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
        res.status(404);
        throw new Error('File not found');
    }

    const file = files[0];
    let contentType = file.contentType || 'application/octet-stream';
    if (req.params.filename.endsWith('.pdf')) contentType = 'application/pdf';
    if (req.params.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) contentType = `image/${req.params.filename.split('.').pop().toLowerCase()}`;

    res.set('Content-Type', contentType);
    res.set('Content-Disposition', 'inline');
    
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
    downloadStream.pipe(res);
});

// @desc    Get all print jobs for an owner
const getPrintJobs = asyncHandler(async (req, res) => {
    const jobs = await PrintJob.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
});

// @desc    Update print job status
const updateJobStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const job = await PrintJob.findById(req.params.id);

    if (job) {
        if (job.ownerId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this job');
        }

        job.status = status;
        const updatedJob = await job.save();

        const io = req.app.get('socketio');
        if (io) {
            io.to(job.ownerId.toString()).emit('job_updated', updatedJob);
        }
        res.json(updatedJob);
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

// @desc    Delete a print job manually
const deleteJob = asyncHandler(async (req, res) => {
    const job = await PrintJob.findById(req.params.id);

    if (job) {
        if (job.ownerId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this job');
        }

        if (job.cloudinaryId) {
            try {
                await bucket.delete(new mongoose.Types.ObjectId(job.cloudinaryId));
            } catch (err) {
                console.error('GridFS Deletion Error:', err.message);
            }
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

module.exports = { createPrintJob, getPrintJobs, updateJobStatus, deleteJob, getFile };
