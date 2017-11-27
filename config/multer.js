const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: '/uploads',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}`);
  }
});

const upload   = multer({ storage });
module.exports = upload;
