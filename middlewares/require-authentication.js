var response = require('../helpers/response');

function isAuthenticated(req, res, next){
  if (!req.isAuthenticated()){
     return response.forbidden(req, res);
  }
  return next();
}

module.exports = isAuthenticated;
