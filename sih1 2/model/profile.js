// userProfiles.js

const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user1', // Assuming you have a 'User' model for authentication
    required: true,
  },
  name: String,
  profilePicture: String,
  githubLink: String,
  skills: String,
  description: String,
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
