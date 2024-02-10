const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

// Middleware for parsing JSON requests
router.use(express.json());

// Route to handle user registration
router.post(
  '/',
  [
    // Validation using express-validator
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('confirmPassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if a user with the same email already exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create a new user instance
      user = new User({
        name,
        email,
        password, // Save the plain text password directly
      });

      // Save the user to the database
      await user.save();

      // Create and send a JWT token for authentication
      jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;

        res.json({
          success: true,
          message: 'Registration successful',
          user: user,
          token: token,
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
