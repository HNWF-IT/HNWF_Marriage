const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');

// Create a new candidate
router.post('/create', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Missing candidate data', data: {} });
    }

    const newCandidate = new Candidate({ ...req.body })
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
  try {
    const filters = req.body?.filters || {};
    const candidates = await Candidate.find(filters);
    res.status(200).json({ success: true, message: 'Candidates returned successfully', data: candidates });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching candidates', data: {} });
  }
});

// Get a candidate by ID
router.get('/get/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing candidate ID', data: {} });
    }

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

    const updatedCandidate = await Candidate.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCandidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'Candidate updated successfully', data: updatedCandidate });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error updating candidate', data: err });
  }
});

// Delete a candidate by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing candidate ID', data: {} });
    }

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