const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { loginSchema } = require("../schemas/user");

router.post("/login", async (req, res) => {
  try {
    // Validate user
    await loginSchema.validate(req.body, { abortEarly: true });

    // Find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials", data: {} });
    }

    // Compare password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
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