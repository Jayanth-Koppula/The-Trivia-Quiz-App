const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');

// Save attempt
router.post('/', async (req, res) => {
  try {
    const attempt = new Attempt(req.body);
    await attempt.save();
    res.status(201).json({ message: 'Attempt saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save attempt' });
  }
});

// Get top 5 attempts
router.get('/top', async (req, res) => {
  try {
    const topAttempts = await Attempt.find().sort({ percentage: -1 }).limit(5);
    res.json(topAttempts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

router.get('/top', async (req, res) => {
  try {
    const top = await Attempt.aggregate([
      {
        $group: {
          _id: "$name",
          score: { $max: "$score" },
          total: { $first: "$total" },
        }
      },
      {
        $project: {
          name: "$_id",
          percentage: { $round: [{ $multiply: [{ $divide: ["$score", "$total"] }, 100] }, 2] }
        }
      },
      { $sort: { percentage: -1 } },
      { $limit: 5 }
    ]);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;