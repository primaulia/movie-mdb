var mongoose = require('mongoose');
// var bcrypt   = require('bcrypt');

var User = new mongoose.Schema({
  name:  { type: String },
  email: { type: String, required: true,  unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', User);
