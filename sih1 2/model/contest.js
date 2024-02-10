const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectLink: {
    type: String,
    required: true,
  },
  problems: [
    {
      text: {
        type: String,
        required: true,
      },
      participants: {
        type: Number,
        default: 1, // Default participants value is 1
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user1', // Reference to the User model for the creator of the contest
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
