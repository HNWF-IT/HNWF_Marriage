const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/user");

router.post("/login", async (req, res) => {
  if (!email || !password || typeof rememberMe != 'boolean') {
    return res.status(400).json({ success: false, message: "Missing: email | password | rememberMe", data: {} });
  }

  try {
    // Find user
    const user = await User.findOne({ email });
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

    res.status(200).json({ success: true, message: "Logged in successfully!", data: token });
  } catch (error) {
    console.log('Error:', error)
    res.status(500).json({ success: false, message: "Server error", data: error });
  }
});

module.exports = router;