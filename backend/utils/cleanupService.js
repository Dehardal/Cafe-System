const mongoose = require('mongoose');
const PrintJob = require('../models/PrintJob');

/**
 * Cleanup Service for GridFS
 * Automatically deletes jobs and GridFS chunks older than 24 hours
 */
const startCleanupService = () => {
  // Run every hour
  setInterval(async () => {
    console.log('--- Running 24h GridFS Cleanup Service ---');
    try {
      const db = mongoose.connection.db;
      if (!db) {
        console.warn('DB connection not ready for cleanup.');
        return;
      }
      
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'uploads'
      });

      const expirationDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // 1. Find jobs older than 24 hours
      const expiredJobs = await PrintJob.find({
        createdAt: { $lt: expirationDate }
      });

      if (expiredJobs.length === 0) {
        console.log('No expired jobs found.');
        return;
      }

      console.log(`Found ${expiredJobs.length} expired jobs. Cleaning up GridFS...`);

      for (const job of expiredJobs) {
        // Delete from GridFS
        if (job.cloudinaryId) {
          try {
            await bucket.delete(new mongoose.Types.ObjectId(job.cloudinaryId));
            console.log(`Deleted GridFS file: ${job.fileName}`);
          } catch (err) {
            // File might already be gone
            console.error(`Error deleting GridFS file ${job.fileName}:`, err.message);
          }
        }

        // Delete from Database
        await job.deleteOne();
      }

      console.log('GridFS Cleanup completed successfully.');
    } catch (error) {
      console.error('Cleanup Service Error:', error);
    }
  }, 60 * 60 * 1000); // 1 hour interval
};

module.exports = startCleanupService;
