const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String },
  phoneNumber: { type: String },
  paymentInfo: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
