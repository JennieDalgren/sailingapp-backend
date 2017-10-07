const express    = require('express');
const router     = express.Router();
const User      = require('../models/user');
const upload = require('../config/multer');

//
// //UPLOAD FILE
// router.post('/upload', upload.single('file'), (req, res, next) => {
//   const data = {
//     userFileName: `/uploads/${req.file.userFileName}`
//
//   };
//   return response.data(req, res, data);
// });
//
//
//
// //Update USER profile
// router.post('/:id', (req, res, next) => {
//   const userUpdate = {
//     name: req.body.username,
//     email: req.body.email,
//     phoneNumber: req.body.phoneNumber,
//     photo: req.file.userFileName,
//     bio: req.body.bio,
//     paymentInfo: req.body.paymentInfo
//   };
//
//   Trip.findByIdAndUpdate(req.params.id, userUpdate, (err, trip) => {
//     if (err) {
//       return next(err);
//     }
//     if (!trip) {
//       return response.notFound(req, res);
//     }
//     let data = trip.asData();
//     return response.data(req, res, data);
//   });
// });


module.exports = router;
