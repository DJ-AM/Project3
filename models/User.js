var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var User = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  googleId: String,
  created: { type: Date, default: Date.now }
 })

module.exports = mongoose.model('User', User)
