const mongoose = require('mongoose');

const printJobSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    customerName: {
        type: String,
        required: true,
    },

    fileUrl: {
        type: String,
        required: true,
    },
    cloudinaryId: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    copies: {
        type: Number,
        required: true,
        default: 1,
    },
    printType: {
        type: String,
        required: true,
        enum: ['Color', 'B/W'],
        default: 'B/W',
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Printing', 'Completed'],
        default: 'Pending',
    },
    notes: {
        type: String,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        index: { expires: 0 }, // TTL index
    },
}, {
    timestamps: true,
});

const PrintJob = mongoose.model('PrintJob', printJobSchema);

module.exports = PrintJob;
