// routes/bookGenres.js
const express = require('express');
const router = express.Router();
const BookGenre = require('../models/bookGenre');

// Create a new genre
router.post('/create', async (req, res) => {
  try {
    const { newGenre  } = req.body;

    if (!newGenre  || !newGenre .trim()) {
      return res.status(400).json({
        success: false,
        message: 'Genre name is required',
        data: {}
      });
    }

    // Check for duplicate name
    const existing = await BookGenre.findOne({ name: newGenre .trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Genre already exists',
        data: {}
      });
    }

    const genre = new BookGenre({ name: newGenre .trim() });
    await genre.save();

    return res.status(201).json({
      success: true,
      message: 'Genre created successfully',
      data: genre
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error creating genre',
      data: err
    });
  }
});

// Get all genres
router.get('/list', async (req, res) => {
  try {
    const genres = await BookGenre.find().sort('name');

    return res.status(200).json({
      success: true,
      message: 'Genres returned successfully',
      data: genres
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching genres',
      data: err
    });
  }
});

module.exports = router;
