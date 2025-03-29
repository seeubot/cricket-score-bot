const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/matches', require('./routes/matches'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/stats', require('./routes/stats'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// server/config.js
module.exports = {
  CRICAPI_KEY: process.env.CRICAPI_KEY,
  CRICAPI_HOST: 'https://cricapi.com/api/v1',
  // Add other configuration variables here
};

// server/routes/matches.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/current', matchController.getCurrentMatches);
router.get('/:id', matchController.getMatchById);
router.get('/:id/scorecard', matchController.getScorecard);
router.get('/:id/live', matchController.getLiveScore);

module.exports = router;

// server/controllers/matchController.js
const axios = require('axios');
const config = require('../config');

const apiClient = axios.create({
  baseURL: config.CRICAPI_HOST,
  headers: {
    'apikey': config.CRICAPI_KEY
  }
});

exports.getCurrentMatches = async (req, res) => {
  try {
    const response = await apiClient.get('/currentMatches');
    
    // Process and structure the data before sending to client
    const formattedMatches = response.data.data.map(match => ({
      id: match.id,
      series: match.series_id,
      teams: {
        team1: match.teamInfo[0].name,
        team2: match.teamInfo[1].name,
        team1Logo: match.teamInfo[0].img || '/assets/images/team-logos/default.png',
        team2Logo: match.teamInfo[1].img || '/assets/images/team-logos/default.png',
      },
      score: {
        team1: match.score[0] || { r: 0, w: 0, o: 0 },
        team2: match.score[1] || { r: 0, w: 0, o: 0 },
      },
      status: match.status,
      venue: match.venue,
      date: match.date,
      matchType: match.matchType
    }));
    
    res.json(formattedMatches);
  } catch (error) {
    console.error('Error fetching current matches:', error);
    res.status(500).json({ error: 'Failed to fetch current matches' });
  }
};

exports.getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await apiClient.get(`/match_info?id=${id}`);
    
    // Format and send match details
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching match ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch match details' });
  }
};

exports.getScorecard = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await apiClient.get(`/match_scorecard?id=${id}`);
    
    // Process scorecard data
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching scorecard for match ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch scorecard' });
  }
};

exports.getLiveScore = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await apiClient.get(`/match_live?id=${id}`);
    
    // Process live score data
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching live score for match ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch live score' });
  }
};
