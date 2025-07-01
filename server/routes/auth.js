const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/user");

router.post("/login", async (req, res) => {
  const {email, password, rememberMe} = req.body;

  if (!email || !password || typeof rememberMe != 'boolean') {
    return res.status(400).json({ success: false, message: "Missing: email | password | rememberMe", data: {} });
  }

  try {
    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials", data: {} });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials", data: {} });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: rememberMe ? "24d" : "24h" });

    res.status(200).json(
      { 
        success: true, 
        message: "Logged in successfully!", 
        data: {
          token,
          user: {
            id: user._id,
            name: user.fullname,
            email: user.email,
            role: user.role,
            appPermissions: user.appPermissions
          }
        } 
      });
  } catch (error) {
    console.log('Error:', error)
    res.status(500).json({ success: false, message: "Server error", data: error });
  }
});

router.post("/signup", async (req, res) => {
  const userData = req.body;

  if (!userData.email || !userData.password) {
    return res.status(400).json({ success: false, message: "Missing email or password", data: {} });
  }

  // use all permissions for admin
  if (userData.role === 'admin') {
    userData.appPermission = [...APP_PERMISSIONS];
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists", data: {} });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Create new user
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ success: true, message: "User created successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", data: {} });
  }
});

module.exports = router;