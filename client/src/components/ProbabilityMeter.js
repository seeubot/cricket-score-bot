// client/src/components/ProbabilityMeter.js
import React from 'react';

const ProbabilityMeter = ({ team1, team1Prob, team2, team2Prob }) => {
  return (
    <div className="probability-container">
      <h3>Probability</h3>
      
      <div className="view-toggle">
        <button className="active">% View</button>
        <button>Odds View</button>
      </div>
      
      <div className="team-probabilities">
        <div className="team-row">
          <div className="team-name">{team1}</div>
          <div className="probability-bar">
            <div 
              className="probability-fill team1" 
              style={{ width: `${team1Prob}%` }}
            ></div>
          </div>
          <div className="probability-value">{team1Prob}%</div>
        </div>
        
        <div className="team-row">
          <div className="team-name">{team2}</div>
          <div className="probability-bar">
            <div 
              className="probability-fill team2" 
              style={{ width: `${team2Prob}%` }}
            ></div>
          </div>
          <div className="probability-value">{team2Prob}%</div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityMeter;

// client/src/components/ProjectedScore.js
import React from 'react';

const ProjectedScore = ({ currentRunRate, projections }) => {
  return (
    <div className="projected-score-container">
      <h3>Projected Score <span className="subtitle">as per RR</span></h3>
      
      <table className="projections-table">
        <thead>
          <tr>
            <th>Run Rate</th>
            {projections.map(proj => (
              <th key={proj.runRate}>{proj.runRate}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{projections[0].overs} Overs</td>
            {projections.map(proj => (
              <td key={proj.runRate}>{proj.score}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProjectedScore;

// client/src/components/BattingStats.js
import React from 'react';

const BattingStats = ({ player, runs, balls }) => {
  return (
    <div className="batting-stats">
      <div className="player-info">
        <img src={player.image} alt={player.name} className="player-image" />
        <div className="player-name">{player.name}</div>
      </div>
      
      <div className="stats">
        <div className="runs">{runs}<span className="balls">({balls})</span></div>
      </div>
    </div>
  );
};

export default BattingStats;

// client/src/components/BowlingStats.js
import React from 'react';

const BowlingStats = ({ player, wickets, runs, overs }) => {
  return (
    <div className="bowling-stats">
      <div className="player-info">
        <img src={player.image} alt={player.name} className="player-image" />
        <div className="player-name">{player.name}</div>
      </div>
      
      <div className="stats">
        <div className="wickets-runs">
          {wickets}-{runs} <span className="overs">({overs})</span>
        </div>
      </div>
    </div>
  );
};

export default BowlingStats;

// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import SeriesPage from './pages/SeriesPage';
import FixturesPage from './pages/FixturesPage';
import MatchDetailPage from './pages/MatchDetailPage';
import StatsCornerPage from './pages/StatsCornerPage';
import RankingsPage from './pages/RankingsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/fixtures" element={<FixturesPage />} />
            <Route path="/match/:id" element={<MatchDetailPage />} />
            <Route path="/stats" element={<StatsCornerPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
