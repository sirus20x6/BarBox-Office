const express = require('express');
const router = express.Router();
const movies = require('../movies.json');

router.get('/', (req, res) => {
  res.json(movies);
});

router.post('/vote', (req, res) => {
  const movieId = req.body.id;
  const voteType = req.body.vote; // 'up' or 'down'
  // Implement your logic to update the movies.json or any database you use
  // After updating, send a response
  res.json({ success: true, message: 'Vote counted!' });
});

module.exports = router;
