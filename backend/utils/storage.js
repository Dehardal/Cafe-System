const multer = require('multer');

// Switch to memory storage - we will handle the GridFS streaming manually 
// in the controller for maximum stability and control.
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = { upload };
