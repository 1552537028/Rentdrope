const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  plainPassword: { type: String },
  password: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  localAddress: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
