const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');

// Create a new candidate
router.post('/create', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Missing candidate data', data: {} });
    }

    const newCandidate = new Candidate({ ...req.body });
    const candidate = await newCandidate.save();

    res.status(201).json({ success: true, message: 'Candidate created successfully', data: candidate });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error creating candidate', data: err });
  }
});

// Get all candidates with optional filters
router.post('/list', async (req, res) => {
  try {
    const filters = req.body?.filters || {};
    const candidates = await Candidate.find(filters);

    res.status(200).json({ success: true, message: 'Candidates returned successfully', data: candidates });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching candidates', data: err });
  }
});

// Get all candidates with optional filters
router.post('/batch', async (req, res) => {
  try {
    const batchNo = parseInt(req.query.batch) || 1;
    const limit = 50;
    const skip = (batchNo - 1) * limit;

    const filters = req.body?.filters || {};
    const candidates = await Candidate.find(filters)
      .skip(skip)
      .limit(limit);

    const responseData = {
      candidates
    };

    if (batchNo === 1) {
      const totalCount = await Candidate.countDocuments(filters);
      responseData.totalCount = totalCount;
    }

    res.status(200).json({
      success: true,
      message: `Candidates (batch: ${batchNo}) returned successfully`,
      data: responseData,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching candidates', data: err });
  }
});

// Get a candidate by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing candidate ID', data: {} });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'Candidate fetched', data: candidate });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error fetching candidate', data: err });
  }
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
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing candidate ID', data: {} });
    }

    const deletedCandidate = await Candidate.findByIdAndDelete(id);
    if (!deletedCandidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found', data: {} });
    }

    res.status(200).json({ success: true, message: 'Candidate deleted successfully', data: deletedCandidate });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error deleting candidate', data: err });
  }
});

router.patch("/:id/willing-status", async (req, res) => {
  try {
    const { id } = req.params;
    const { willingStatus } = req.body;

    const allowedStatuses = ["Seeking", "On Hold", "Done"];
    if (!allowedStatuses.includes(willingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid willing status",
        data: null
      });
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { willingStatus },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Willingness status updated successfully",
      data: updatedCandidate
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating willingness status",
      data: err
    });
  }
});

module.exports = router;