const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const { validationResult } = require('express-validator');
const admin = require('./firebase'); // Replace './firebase.js' with the actual path to your firebase.js file
var jwt = require('jsonwebtoken');



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const contestRoutes = require('./routes/contest');
const profileRoutes = require('./routes/profile');
mongoose
  .connect('mongodb://127.0.0.1:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection successful');
  })
  .catch((e) => {
    console.log('Connection error');
  });

app.use(bodyParser.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Import your fetchuser middleware
const fetchuser = require('./middlewares/fetchuser'); // Adjust the path to your fetchuser.js file

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,       // Add the 'role' field
  userType: String,   // Add the 'userType' field
});

const User = new mongoose.model('user1', userSchema);

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imagePaths: [String], // Store paths or references to Firebase Storage
  tags: String,
  projectType: String,
  link: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user1'
  },
});
const Project = mongoose.model('Project', projectSchema);


app.post('/login', async (req, res) => {
  const { email, password ,role} = req.body;
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      if (password === user.password) {
        // Generate a JWT token upon successful login
        const token = jwt.sign({ userId: user._id }, '1234'); // Replace 'your-secret-key' with a secure secret key

        // Send the token in the response and store it in local storage
        res.send({
          success: true,
          message: 'Login Successful',
          user: user,
          token: token,
        });
      } else {
        // Send a failure message if the password doesn't match
        res.send({ success: false, message: "Invalid Input" });
      }
    } else {
      // Send a failure message if the user is not registered
      res.send({ success: false, message: 'User not registered' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
});


app.post('/projects', fetchuser, upload.array('images', 5), async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Store uploaded images in Firebase Storage
    const imagePaths = [];
    const storageBucket = admin.storage().bucket();

    for (const file of req.files) {
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      const blob = storageBucket.file(uniqueFileName);

      await blob.save(file.buffer, {
        gzip: true,
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Get the public URL of the uploaded image
      //const imageUrl = `https://storage.googleapis.com/${storageBucket.name}/${uniqueFileName}`;
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/login99-64b21.appspot.com/o/${uniqueFileName}?alt=media&token=e20eb32a-6072-40f6-80b6-7aee85809cde`;

      imagePaths.push(imageUrl);
    }

    // Create a new project with image paths
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      imagePaths: imagePaths,
      tags: req.body.tags,
      projectType: req.body.projectType,
      link: req.body.link,
      user: req.user, // Assuming you have a user object available after middleware validation
    });
    //console.log(project)

    const savedProject = await project.save();
    //console.log(savedProject)
    res.json(savedProject); // Send the response once after all processing is complete
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project' }); // Handle errors and send a response
  }
});

app.get('/projects', fetchuser, async (req, res) => {
  try {
    console.log("from post")
    console.log(req.user)
    // Assuming your JWT payload looks like { userId: '64ff736e597d80f15adaf718', iat: 1694717741 }
    const userId1 = req.user; // Access the user ID from the JWT payload

    const projects = await Project.find({ user: userId1 });
    console.log("before error")
    res.json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Error retrieving projects' });
  }
});
// Add this route in your Express app
app.get('/trending-projects', async (req, res) => {
  try {
    // Assuming you have a "Project" model
    const trendingProjects = await Project.find({}).limit(10).exec(); // Fetch the top 10 trending projects

    res.json(trendingProjects);
  } catch (error) {
    console.error('Error fetching trending projects:', error);
    res.status(500).json({ error: 'Error fetching trending projects' });
  }
});

//Add this registration route
app.post('/register', async (req, res) => {
  const { name, email, password, role, userType } = req.body;

  try {
    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email: email }).exec();

    if (existingUser) {
      return res.send({ success: false, message: 'User with this email already exists' });
    }

    // Create a new user
    const newUser = new User({
      name: name,
      email: email,
      password: password, // You should hash the password for security
      role: role,         // Add the 'role' field
      userType: userType, // Add the 'userType' field
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token upon successful registration
    const token = jwt.sign({ userId: savedUser._id }, '1234'); // Replace 'your-secret-key' with a secure secret key

    // Send the token in the response and store it in local storage
    res.send({
      success: true,
      message: 'Registration Successful',
      user: savedUser,
      token: token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
});
// Server-side code
app.get('/api/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 
    console.log(userId)// Retrieve the userId from the request parameters

    // Fetch the user's data from the database, including userType and role
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming 'userType' and 'role' are fields in your user schema
    const { userType, role } = user;

    res.json({ userType, role }); // Send userType and role as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.use('/contests', contestRoutes);
app.use('/user-profile', profileRoutes);
app.listen(9002, () => {
  console.log('Backend started at port 9002');
});
