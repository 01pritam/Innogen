const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imagePaths: [String], // Store paths or references to Firebase Storage
  tags: String,
  projectType: String,
  link: String,
  // Reference to the user who created the project
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user1', // 'User' should match the name of your user model
  },
});

const project = new mongoose.model('project', projectSchema);

module.exports = project;
