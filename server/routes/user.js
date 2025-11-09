// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { signUpSchema } = require('../schemas/user');
const bcrypt = require('bcryptjs');

// CREATE: New user
router.post('/create', async (req, res) => {
  try {
    const userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ success: false, message: 'Missing user data', data: {} });
    }

    // Validate user
    // await signUpSchema.validate(req.body, { abortEarly: true });

    // Hash password before creating user
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // Exclude password from response manually
    const { password, ...userWithoutPassword } = savedUser.toObject();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error creating user', data: err });
  }
});

// READ: List all users with filters
router.post('/list', async (req, res) => {
  try {
    const filters = req.body?.filters || {};
    const users = await User.find(filters).select('-password');

    res.status(200).json({
      success: true,
      message: 'Users returned successfully',
      data: users
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching users', data: err });
  }
});

// READ: Paginated user batch
router.post('/batch', async (req, res) => {
  try {
    const batchNo = parseInt(req.query.batch) || 1;
    const limit = 50;
    const skip = (batchNo - 1) * limit;

    const filters = req.body?.filters || {};
    const users = await User.find(filters)
      .select('-password')
      .skip(skip)
      .limit(limit);

    const responseData = { users };

    if (batchNo === 1) {
      const totalCount = await User.countDocuments(filters);
      responseData.totalCount = totalCount;
    }

    res.status(200).json({
      success: true,
      message: `Users (batch: ${batchNo}) returned successfully`,
      data: responseData
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching users', data: err });
  }
});

// READ: Get user by ID
router.get('/get/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing user ID', data: {} });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching user', data: err });
  }
});

// UPDATE: Update user by ID
router.put('/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (!userId || !updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing user ID or update data',
        data: {}
      });
    }

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error updating user', data: err });
  }
});

// PATCH: Reset user password by ID
router.patch('/reset-password/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Missing user ID or new password',
        data: {}
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update only the password field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: {}
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: updatedUser
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error resetting password',
      data: err
    });
  }
});

// PATCH: Deactivate or Activate user by ID
router.patch('/status/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing user ID',
        data: {},
      });
    }

    if (typeof status !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be true or false.',
        data: {},
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${status ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error updating user status',
      data: err,
    });
  }
});

// DELETE: Delete user by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing user ID', data: {} });
    }

    const user = await User.findByIdAndDelete(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully', data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error deleting user', data: err });
  }
});

module.exports = router;
