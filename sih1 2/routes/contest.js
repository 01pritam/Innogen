const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const Contest = require('../model/contest'); // Adjust the path to your Contest model
const fetchuser = require('../middlewares/fetchuser'); // Import your fetchuser middleware

// Create a new contest
router.post('/create', fetchuser, async (req, res) => {
  try {
    // Validate request body
    console.log(req.user)
    const errors = validationResult(req.user);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new contest and assign it to the authenticated user
    const { title, description, projectLink, problems } = req.body;
    const contest = new Contest({
      title,
      description,
      projectLink,
      problems,
      createdBy: req.user, // Assuming you have a user object available after middleware validation
    });

    // Save the contest to the database
    const savedContest = await contest.save();

    res.status(201).json(savedContest);
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({ error: 'Error creating contest' });
  }
});

module.exports = router;
