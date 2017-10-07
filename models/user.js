const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String,

  },
  password: {
    type: String,

  },
  email: {
    type: String,

  },
  phoneNumber: {
    type: String,
    
   },
  photo: {
    type: String
  },
  bio: {
    type: String
  },
  paymentInfo: {
    type: String
  },
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.asData = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email
  };
};

const User = mongoose.model('User', UserSchema);


module.exports = {
  User
};
