const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate'); // Assuming candidate.js is in the models folder

// Create a new candidate
router.post('/create', (req, res) => {
  // Create a new candidate
  const newCandidate = new Candidate({ ...req.body });

  newCandidate.save()
    .then((candidate) => {
      res.status(201).json({ success: true, message: 'Candidate created successfully', data: candidate });
    })
    .catch((err) => {
      res.status(400).json({ success: true, message: 'Error creating candidate', data: err });
    });
});

// Get all candidates with optional filters
router.post('/list', async (req, res) => {
  const filters = req.body.filters;

  try {
    const candidates = await Candidate.find(filters);
    res.status(200).json({ success: true, message: 'Candidates returned successfully', data: candidates });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching candidates', data: {} });
  }
});

// Get a candidate by ID
router.get('/get/:id', (req, res) => {
  const { id } = req.params;

  Candidate.findById(id)
    .then((candidate) => {
      if (!candidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found', data: {} });
      }
      res.status(200).json(candidate);
    })
    .catch((err) => {
      res.status(400).json({ success: false, message: 'Error fetching candidate', data: err });
    });
});

// Update a candidate by ID
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, education } = req.body;

  Candidate.findByIdAndUpdate(id, { name, email, phoneNumber, education }, { new: true })
    .then((updatedCandidate) => {
      if (!updatedCandidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found', data: {} });
      }
      res.status(200).json({ success: true, message: 'Candidate updated successfully', data: updatedCandidate });
    })
    .catch((err) => {
      res.status(400).json({ success: false, message: 'Error updating candidate', data: err });
    });
});

// Delete a candidate by ID
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  Candidate.findByIdAndDelete(id)
    .then((deletedCandidate) => {
      if (!deletedCandidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found', data: {} });
      }
      res.status(200).json({ success: true, message: 'Candidate deleted successfully', data: deletedCandidate });
    })
    .catch((err) => {
      res.status(400).json({ success: false, message: 'Error deleting candidate', data: err });
    });
});

module.exports = router;