const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');

const response = require('../helpers/response');
const User = require('../models/user').User;

const upload = require('../config/multer');

//LOGIN
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

//CREATE ACCOUNT
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

//LOG OUT
router.post('/logout', (req, res) => {
  req.logout();
  return response.ok(req, res);
});

//UPLOAD FILE
router.post('/upload', upload.single('file'), (req, res, next) => {
  const data = {
    userFileName: req.file.secure_url

  };

  return response.data(req, res, data);
});


//Update USER profile
router.put('/me', (req, res, next) => {

  const userUpdate = {
    name: req.body.name || req.user.name,
    phoneNumber: req.body.phoneNumber || req.user.phoneNumber,
    photo: req.body.photo || req.user.photo,
    bio: req.body.bio || req.user.bio
  };

  User.findByIdAndUpdate(req.user._id, userUpdate, {new: true}, (err, user) => {
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

//Show logged in user profile
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    return User.findById(req.user._id, (err, user) => {
      return response.data(req, res, user.asData());
    });
  }

  return response.notFound(req, res);
});


router.get('/:id', (req, res, next) => {
  console.log("im in the backend route");
  if (!req.params.id.match(/^[a-zA-Z0-9]{24}$/)) {
    console.log("No match first if");
    return response.notFound(req, res);
  }
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log("in findbyId but error");
      return next(err);
    }
    if (!user) {
      console.log("in finbyId but no User");
      return response.notFound(req, res);
    }
    let data = user.asData();
    console.log("in finbyId shpuld give data");

      return response.data(req, res, data);
  });
});

module.exports = router;
