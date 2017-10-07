const User = require('../models/user').User;

var response = require('../helpers/response');

function isAuthenticated(req, res, next){
  if (!req.isAuthenticated()){
     return response.forbidden(req, res);
  }
  // User.findById(req.user._id, function (err, user) {
  //   if (err) return next(err);
  //   if (!user) return res.send(401);
  //
  //   req.user = user;
  //   return next();
  // });
  return next();
}

module.exports = isAuthenticated;
