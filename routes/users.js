const express    = require('express');
const router     = express.Router();
const User      = require('../models/user');
const response   = require('../helpers/response');
const upload = require('../config/multer');

//ONE USER profile page
// router.get('/:id', (req, res, next) => {
//   console.log("im in the backend route");
//   if (!req.params.id.match(/^[a-zA-Z0-9]{24}$/)) {
//     console.log("No match first if");
//     return response.notFound(req, res);
//   }
//   User.findById(req.params.id, (err, user) => {
//     if (err) {
//       console.log("in findbyId but error");
//       return next(err);
//     }
//     if (!user) {
//       console.log("in finbyId but no User");
//       return response.notFound(req, res);
//     }
//     let data = user.asData();
//     console.log("in finbyId shpuld give data");
//
//       return response.data(req, res, data);
//   });
// });



module.exports = router;
