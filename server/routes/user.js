const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { signUpSchema } = require('../schemas/user');

// Create a new user
router.post('/create', async (req, res) => {
  try {
    // Validate user
    await signUpSchema.validate(req.body, { abortEarly: true });

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({ ...req.body, password: hashedPassword });
    const user = await newUser.save();

    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error creating user', data: err });
  }
});

// Get all users with optional filters
router.post('/list', async (req, res) => {
  try {
    const filters = req.body?.filters || {};
    const users = await User.find(filters);

    res.status(200).json({ success: true, message: 'Users returned successfully', data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching users', data: err });
  }
});

// Get all users with optional filters
router.post('/batch', async (req, res) => {
  try {
    const batchNo = parseInt(req.query.batch) || 1;
    const limit = 50;
    const skip = (batchNo - 1) * limit;

    const filters = req.body?.filters || {};
    const users = await User.find(filters)
      .skip(skip)
      .limit(limit);

    const responseData = {
      users
    };

    if (batchNo === 1) {
      const totalCount = await User.countDocuments(filters);
      responseData.totalCount = totalCount;
    }

    res.status(200).json({
      success: true,
      message: `Users (batch: ${batchNo}) returned successfully`,
      data: responseData,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching users', data: err });
  }
});

// Get a user by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing user ID', data: {} });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'User fetched', data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching user', data: err });
  }
});

// Update a user by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || !updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing ID or update data',
        data: {},
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error updating user', data: err });
  }
});

// Delete a user by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing user ID', data: {} });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully', data: deletedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error deleting user', data: err });
  }
});

module.exports = router;