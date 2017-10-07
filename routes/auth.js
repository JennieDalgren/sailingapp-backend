const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');

const response = require('../helpers/response');
const User = require('../models/user').User;

const upload = require('../config/multer');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return response.notFound(req, res);
    }
    req.login(user, (err) => {
      if (err) {

        return next(err);
      }
      return response.data(req, res, req.user);
    });
  })(req, res, next);
});

router.post('/signup', (req, res, next) => {
  const {
    name,
    email,
    password,
    phoneNumber
  } = req.body;

  if (!name) {
    return response.unprocessable(req, res, 'Missing mandatory field "Name".');
  }
  if (!password) {
    return response.unprocessable(req, res, 'Missing mandatory field "Password".');
  }
  if (!email) {
    return response.unprocessable(req, res, 'Missing mandatory field "Email".');
  }
  if (!phoneNumber) {
    return response.unprocessable(req, res, 'Missing mandatory field "Phone Number".');
  }

  User.findOne({
    email
  }, 'email', (err, userExists) => {
    if (err) {
      return next(err);
    }
    if (userExists) {
      return response.unprocessable(req, res, 'Email already in use.');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      name,
      email,
      password: hashPass,
      phoneNumber
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return response.data(req, res, newUser.asData());
      });
    });
  });
});

router.post('/logout', (req, res) => {
  req.logout();
  return response.ok(req, res);
});

//UPLOAD FILE
router.post('/upload', upload.single('file'), (req, res, next) => {
  const data = {
    userFileName: `/uploads/${req.file.userFileName}`

  };

  return response.data(req, res, data);
});


//Update USER profile
router.post('/:id', (req, res, next) => {

  const userUpdate = {
    name: req.body.username || req.user.name,
    email: req.body.email || req.user.email,
    phoneNumber: req.body.phoneNumber || req.user.phoneNumber,
    photo: req.body.userFileName || req.user.photo,
    bio: req.body.bio || req.user.bio
  };

  User.findByIdAndUpdate(req.user._id, userUpdate, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return response.notFound(req, res);
    }
    let data = user.asData();
    return response.data(req, res, data);
  });
});


router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    return response.data(req, res, user.asData());
  }

  return response.notFound(req, res);
});

module.exports = router;
