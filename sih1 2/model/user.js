const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,       // Add the 'role' field
  userType: String,   // Add the 'userType' field
});

const User = new mongoose.model('user1', userSchema);
module.exports = User;
