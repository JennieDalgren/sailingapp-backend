const express    = require('express');
const router     = express.Router();
const User      = require('../models/user');
const upload = require('../config/multer');

/* CREATE a new Phone. */
router.post('/', upload.single('file'), function(req, res) {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    image: `/uploads/${req.file.filename}`
  });

  user.save((err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'New User created!',
      user: user
    });
  });
});

module.exports = router;
