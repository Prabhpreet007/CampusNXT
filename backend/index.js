const express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const accountSid = process.env.TWILIOaccountSid
const authToken = process.env.TWILIOauthToken
const secretKEY = process.env.JWTsecretKEY
const client = require("twilio")(accountSid, authToken);
const cookieParser = require("cookie-parser")
const imageuploadRoute = require('./cloudinary.js');
const bodyParser = require('body-parser');
const cors = require("cors");
const Post = require("./models/Post.js");
const logoutRoute = require("./logout.js")

const students = []
// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/image-upload', imageuploadRoute);
app.use("/ProfileLogout",logoutRoute)

const jwtAuthMiddleware = (req, res, next) => {
  console.log("Cookie : ", req.cookies)
  const authToken = req.cookies.authToken
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized cookie' });
  }
  if (!authToken) return res.status(401).json({ error: 'Unauthorized 1' });
  console.log("authHeader: ", JSON.stringify(authToken))
  // console.log("vaishnav sir ne bola krne ka toh krne ka ",authToken)
  if (!authToken) return res.status(401).json({ error: 'Unauthorized 2' });

  try {
    console.log(`authToken:${authToken}`)
    const decoded = jwt.verify(authToken, secretKEY);
    console.log(decoded)
    req.jwtPayload = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid authToken" });
  }
};


const generateToken = (userData) => {
  return jwt.sign(userData, secretKEY)
}

const sendSMS = async (body, num) => {
  let msgOptions = {
    from: +19786361948,
    to: num,
    body,
  };
  try {
    const message = await client.messages.create(msgOptions);
    console.log(message);
  } catch (err) {
    console.log(err);
  }
};
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/placement-portal');

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
  password: String,
  role: { type: String, default: 'admin' }
});
const Admin = mongoose.model('Admin', adminSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
  password: String,
  role: { type: String, default: 'student' }
});
const Student = mongoose.model('Student', studentSchema);


// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, phNumber, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingAdmin = await Admin.findOne({ email });
    const existingStudent = await Student.findOne({ email });

    if (existingAdmin || existingStudent) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    let formattedPhNumber = phNumber.replace(/\D/g, '');

    if (!formattedPhNumber.startsWith('91')) {
      formattedPhNumber = '91' + formattedPhNumber;
    }

    const formattedPhNumberWithPlus = `+${formattedPhNumber}`;

    if (role === 'admin') {
      const admin = new Admin({ name, email, phNumber, password: hashedPassword, role });
      await admin.save();
    } else if (role === 'student') {
      const student = new Student({ name, email, phNumber, password: hashedPassword, role });
      await student.save();
      students.push(formattedPhNumberWithPlus);
      console.log(students)
    }
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
});


app.get('/check-session', (req, res) => {
  const token = req.cookies.authToken;
  console.log(token," this is token")

  if (!token) {
    return res.status(401).json({ loggedIn: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKEY);
    res.status(200).json({ loggedIn: true, role: decoded.role });
  } catch (error) {
    console.log(error," error is this")
    res.status(401).json({ loggedIn: false, message: 'Invalid or expired token' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user;
    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else if (role === 'student') {
      user = await Student.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ email, role });

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: false
    })


    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ---------------- Post Routes --------------------

// Create a new internship post (Admin only)
app.post('/posts', jwtAuthMiddleware, async (req, res) => {
  const { id, image, title, description, requirements, date } = req.body;

  try {
    const newPost = new Post({ id, image, title, description, requirements, date });
    await newPost.save();

    console.log("New Post: ", newPost)
    if (!newPost) {
      return res.status(500).json({ error: 'Failed to create post' });
    }


    //Fetch all the students...
    // Store interests array in each students document...
    // Fitler out only those students with matching interets and send SMS only to them... Future Enhancemnts on VIVA

    const studentObjs = await Student.find({}, { phNumber: 1 })

    const phoneNumbers = []


    console.log("Students:: ", studentObjs)
    studentObjs.forEach((student) => {
      let phNumber = student.phNumber
      let formattedPhNumber = phNumber.replace(/\D/g, '');
      if (!formattedPhNumber.startsWith('91')) {
        formattedPhNumber = '91' + formattedPhNumber;
      }
      const formattedPhNumberWithPlus = `+${formattedPhNumber}`;
      phoneNumbers.push(formattedPhNumberWithPlus)
    })

    // console.log("formatted: ", phoneNumbers)

    phoneNumbers.forEach((mbno) => {
      sendSMS("Dear Students,\n\nExciting new placement opportunities have been added to the CampusNXT website. Feel free to explore and check them out!", mbno)
    })



    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({ error: 'Failed to create post' });
  }
});


app.delete('/posts/:id', jwtAuthMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete post using _id
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Fetch all internship posts (Available for both Admin and Students)
app.get('/posts', jwtAuthMiddleware, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Delete a post by ID
app.delete('/posts/:id', jwtAuthMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete post using _id
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Send OTP to email
app.get('/send-otp/:email', (req, res) => {
  const email = req.params.email; // Extract email from the request parameters

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000);

  const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "campusnxxt@gmail.com",
      pass: "odkkmadkbftifytt"
    }
  });

  const receiver = {
    from: "campusnxxt@gmail.com",
    to: email, // Use the dynamic email parameter
    subject: "OTP FOR CAMPUSNXT SIGNUP",
    text: `Your CampusNXT OTP is: ${otp}\nPlease do not share this OTP with anyone for your account's security.`
  };

  auth.sendMail(receiver, (error, emailResponse) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
    console.log(`Email sent successfully! OTP: ${otp}`);
    res.status(200).send({ otp }); // Send OTP back as JSON
  });
});




// ---------------- Server Start --------------------
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


