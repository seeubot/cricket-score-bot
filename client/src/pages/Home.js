// client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../services/api';
import Loader from '../components/common/Loader';
import { FaCricket } from 'react-icons/fa';

const MatchCard = ({ match }) => {
  return (
    <Link to={`/match/${match.id}`} className="match-card">
      <div className="match-card-header">
        <div className="match-card-title">{match.series}</div>
        <div className="match-card-subtitle">{match.venue}</div>
      </div>
      
      <div className="match-card-content">
        <div className="team-info">
          <img src={match.teams.team1Logo} alt={match.teams.team1} className="team-logo" />
          <div className="team-score-info">
            <div className="team-name">{match.teams.team1}</div>
            {match.score.team1.r !== undefined ? (
              <div className="team-score">{match.score.team1.r}/{match.score.team1.w} ({match.score.team1.o})</div>
            ) : (
              <div className="team-score">Yet to bat</div>
            )}
          </div>
        </div>
        
        <div className="team-info">
          <img src={match.teams.team2Logo} alt={match.teams.team2} className="team-logo" />
          <div className="team-score-info">
            <div className="team-name">{match.teams.team2}</div>
            {match.score.team2.r !== undefined ? (
              <div className="team-score">{match.score.team2.r}/{match.score.team2.w} ({match.score.team2.o})</div>
            ) : (
              <div className="team-score">Yet to bat</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="match-card-footer">
        <div className="match-date">{new Date(match.date).toLocaleDateString()}</div>
        <div className="match-status">{match.status}</div>
      </div>
    </Link>
  );
};

const Home = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'live', 'upcoming', 'completed'
  
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await getMatches();
        setMatches(data);
      } catch (err) {
        setError('Failed to load matches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
    
    // Poll for updates every 60 seconds for live matches
    const intervalId = setInterval(fetchMatches, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const filteredMatches = () => {
    switch (filter) {
      case 'live':
        return matches.filter(match => 
          match.status.toLowerCase().includes('live') || 
          match.status.toLowerCase().includes('innings break')
        );
      case 'upcoming':
        return matches.filter(match => 
          match.status.toLowerCase().includes('upcoming') || 
          match.status.toLowerCase().includes('scheduled')
        );
      case 'completed':
        return matches.filter(match => 
          match.status.toLowerCase().includes('completed') || 
          match.status.toLowerCase().includes('finished') ||
          match.status.toLowerCase().includes('won by')
        );
      default:
        return matches;
    }
  };

  if (loading && matches.length === 0) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (matches.length === 0) return <div>No matches found</div>;

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Cricket Matches</h1>
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Matches
          </button>
          <button 
            className={`filter-btn ${filter === 'live' ? 'active' : ''}`}
            onClick={() => setFilter('live')}
          >
            Live
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      {loading && <div className="loading-indicator">Refreshing matches...</div>}
      
      <div className="match-cards-container">
        {filteredMatches().length > 0 ? (
          filteredMatches().map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <div className="no-matches">
            <FaCricket size={48} />
            <p>No {filter !== 'all' ? filter : ''} matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
