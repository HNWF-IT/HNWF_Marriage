const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate'); // Assuming candidate.js is in the models folder

// Create a new candidate
router.post('/create', (req, res) => {
  // Create a new candidate
  const newCandidate = new Candidate({ ...req.body });

  newCandidate.save()
    .then((candidate) => {
      res.status(201).json({ message: 'Candidate created successfully', candidate });
    })
    .catch((err) => {
      res.status(400).json({ message: 'Error creating candidate', error: err });
    });
});

// Get all candidates with optional filters
router.post('/list', async (req, res) => {
  console.log(res.user, "res.user")
  const filters = req.body.filters;

  try {
    const candidates = await Candidate.find(filters);
    res.json(candidates);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching candidates' });
  }
});

// Get a candidate by ID
router.get('/get/:id', (req, res) => {
  const { id } = req.params;

  Candidate.findById(id)
    .then((candidate) => {
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      res.status(200).json(candidate);
    })
    .catch((err) => {
      res.status(400).json({ message: 'Error fetching candidate', error: err });
    });
});

// Update a candidate by ID
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, education } = req.body;

  Candidate.findByIdAndUpdate(id, { name, email, phoneNumber, education }, { new: true })
    .then((updatedCandidate) => {
      if (!updatedCandidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      res.status(200).json({ message: 'Candidate updated successfully', updatedCandidate });
    })
    .catch((err) => {
      res.status(400).json({ message: 'Error updating candidate', error: err });
    });
});

// Delete a candidate by ID
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  Candidate.findByIdAndDelete(id)
    .then((deletedCandidate) => {
      if (!deletedCandidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      res.status(200).json({ message: 'Candidate deleted successfully' });
    })
    .catch((err) => {
      res.status(400).json({ message: 'Error deleting candidate', error: err });
    });
});

module.exports = router;