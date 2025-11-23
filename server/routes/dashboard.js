const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Candidate = require('../models/candidate');
const Book = require('../models/book');
const BookGenre = require('../models/bookGenre');

// GET: Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        admins: await User.countDocuments({ role: 'admin' }),
        members: await User.countDocuments({ role: 'member' }),
        active: await User.countDocuments({ status: true }),
        inactive: await User.countDocuments({ status: false })
      },
      candidates: {
        total: await Candidate.countDocuments(),
        seeking: await Candidate.countDocuments({ willingStatus: 'Seeking' }),
        done: await Candidate.countDocuments({ willingStatus: 'Done' }),
        onHold: await Candidate.countDocuments({ willingStatus: 'On Hold' }),
        male: await Candidate.countDocuments({ gender: 'Male' }),
        female: await Candidate.countDocuments({ gender: 'Female' }),
        single: await Candidate.countDocuments({ maritalStatus: 'Single' }),
        married: await Candidate.countDocuments({ maritalStatus: 'Married' })
      },
      books: {
        total: await Book.countDocuments(),
        available: await Book.countDocuments({ status: 'Available' }),
        checkedOut: await Book.countDocuments({ status: 'Checked Out' }),
        reserved: await Book.countDocuments({ status: 'Reserved' }),
        lost: await Book.countDocuments({ status: 'Lost' })
      },
      genres: {
        total: await BookGenre.countDocuments()
      }
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      data: err
    });
  }
});

// GET: Recent activity (upcoming marriages and conducted marriages)
router.get('/recent-activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Upcoming marriages: Candidates seeking marriage (most recent first)
    const upcomingMarriages = await Candidate.find({ willingStatus: 'Seeking' })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Conducted marriages: Candidates who are done (most recent first)
    const conductedMarriages = await Candidate.find({ willingStatus: 'Done' })
      .sort({ updatedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Recent activity retrieved successfully',
      data: {
        upcomingMarriages,
        conductedMarriages
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      data: err
    });
  }
});

// GET: Top matches - Pair matching algorithm (Male-Female pairs)
router.get('/top-matches', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Get all seeking candidates separated by gender
    const maleCandidates = await Candidate.find({ willingStatus: 'Seeking', gender: 'Male' });
    const femaleCandidates = await Candidate.find({ willingStatus: 'Seeking', gender: 'Female' });

    // Helper function to calculate individual candidate score
    const calculateCandidateScore = (candidate) => {
      const daysSinceCreation = (Date.now() - new Date(candidate.createdAt)) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(0, 100 - daysSinceCreation);

      const fields = [
        candidate.name, candidate.fatherName, candidate.gender, candidate.dob,
        candidate.height, candidate.qualification, candidate.caste, candidate.maslak,
        candidate.healthCondition, candidate.contact, candidate.city, candidate.address
      ];
      const filledFields = fields.filter(field => field && field !== '').length;
      const completenessScore = (filledFields / fields.length) * 100;

      let ageScore = 0;
      if (candidate.dob) {
        const age = Math.floor((Date.now() - new Date(candidate.dob)) / (1000 * 60 * 60 * 24 * 365.25));
        if (age >= 20 && age <= 35) ageScore = 100;
        else if (age >= 18 && age < 20) ageScore = 80;
        else if (age > 35 && age <= 45) ageScore = 70;
        else if (age > 45 && age <= 55) ageScore = 50;
        else ageScore = 30;
      }

      return {
        ...candidate.toObject(),
        individualScore: Math.round((recencyScore * 0.4) + (completenessScore * 0.3) + (ageScore * 0.3)),
        age: candidate.dob ? Math.floor((Date.now() - new Date(candidate.dob)) / (1000 * 60 * 60 * 24 * 365.25)) : null
      };
    };

    // Score all candidates
    const scoredMales = maleCandidates.map(calculateCandidateScore);
    const scoredFemales = femaleCandidates.map(calculateCandidateScore);

    // Calculate compatibility score for each pair
    const pairs = [];
    scoredMales.forEach(male => {
      scoredFemales.forEach(female => {
        // Compatibility factors
        let compatibilityScore = 0;

        // 1. Age compatibility (40%): Traditional preference - male slightly older
        if (male.age && female.age) {
          const ageDiff = male.age - female.age;
          if (ageDiff >= 0 && ageDiff <= 5) compatibilityScore += 40; // Ideal: male 0-5 years older
          else if (ageDiff > 5 && ageDiff <= 10) compatibilityScore += 30;
          else if (ageDiff < 0 && ageDiff >= -3) compatibilityScore += 25; // Female slightly older ok
          else compatibilityScore += 10;
        }

        // 2. Location compatibility (20%): Same city preferred
        if (male.city && female.city && male.city.toLowerCase() === female.city.toLowerCase()) {
          compatibilityScore += 20;
        }

        // 3. Caste compatibility (20%): Same caste preferred
        if (male.caste && female.caste && male.caste.toLowerCase() === female.caste.toLowerCase()) {
          compatibilityScore += 20;
        }

        // 4. Maslak compatibility (20%): Same maslak preferred
        if (male.maslak && female.maslak && male.maslak.toLowerCase() === female.maslak.toLowerCase()) {
          compatibilityScore += 20;
        }

        // Combined score: individual scores + compatibility
        const pairScore = ((male.individualScore + female.individualScore) / 2) * 0.5 + compatibilityScore * 0.5;

        pairs.push({
          male: male,
          female: female,
          matchScore: Math.round(pairScore),
          compatibility: {
            ageDifference: male.age && female.age ? male.age - female.age : null,
            sameCity: male.city && female.city && male.city.toLowerCase() === female.city.toLowerCase(),
            sameCaste: male.caste && female.caste && male.caste.toLowerCase() === female.caste.toLowerCase(),
            sameMaslak: male.maslak && female.maslak && male.maslak.toLowerCase() === female.maslak.toLowerCase()
          }
        });
      });
    });

    // Sort pairs by match score and return top matches
    const topMatches = pairs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    res.status(200).json({
      success: true,
      message: 'Top match pairs retrieved successfully',
      data: topMatches
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top matches',
      data: err
    });
  }
});

module.exports = router;
