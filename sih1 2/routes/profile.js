const express = require('express');
const router = express.Router();
const UserProfile = require('../model/profile'); // Import your UserProfile schema/model
const fetchUser = require('../middlewares/fetchUser'); // Import your fetchUser middleware

// Add express.json() middleware to handle JSON data
router.use(express.json());

// Define routes for your profiles

// Route to fetch user profile
router.get('/', fetchUser, async (req, res) => {
  try {
    // The user data is available in req.user due to the fetchUser middleware
    const userId = req.user;

    // Retrieve user profile data based on the logged-in user
    let profile = await UserProfile.findOne({ userId });

    // If the profile doesn't exist, create a new one and save it
    if (!profile) {
      profile = new UserProfile({
        userId,
        name: '', // Initialize name
        profilePicture: '', // Initialize profilePicture
        githubLink: '', // Initialize githubLink
        skills: '', // Initialize skills
        description: '', // Initialize description
        // Initialize other fields as needed
      });
      await profile.save();
    }

    // Return the profile data as JSON
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create or update user profile
router.put('/', fetchUser, async (req, res) => {
  try {
    const userId = req.user;
    console.log(req.body)
    const { name, githubLink, skills, description, profilePicture } = req.body;

    // Check if the profile already exists
    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // If the profile doesn't exist, create a new one with the provided data
      profile = new UserProfile({
        userId,
        name, // Initialize name
        githubLink, // Initialize githubLink
        skills, // Initialize skills
        description, // Initialize description
        profilePicture, // Initialize profilePicture
        // Initialize other fields as needed
      });
    } else {
      // If the profile already exists, update the fields
      profile.name = name;
      profile.githubLink = githubLink;
      profile.skills = skills;
      profile.description = description;
      profile.profilePicture = profilePicture; // Update profilePicture
      // Update other fields as needed
    }

    // Save the profile
    await profile.save();

    // Return the profile data as JSON
    console.log(profile)
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... (other routes)

// Export the router to be used in your main Express app
module.exports = router;