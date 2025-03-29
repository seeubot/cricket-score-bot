// client/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const getMatches = async () => {
  try {
    const response = await apiClient.get('/matches/current');
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const getMatchById = async (id) => {
  try {
    const response = await apiClient.get(`/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching match ${id}:`, error);
    throw error;
  }
};

export const getLiveScore = async (id) => {
  try {
    const response = await apiClient.get(`/matches/${id}/live`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching live score for match ${id}:`, error);
    throw error;
  }
};

export const getScorecard = async (id) => {
  try {
    const response = await apiClient.get(`/matches/${id}/scorecard`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching scorecard for match ${id}:`, error);
    throw error;
  }
};

// client/src/components/MatchInfo.js
import React, { useEffect, useState } from 'react';
import { getMatchById } from '../services/api';
import Loader from './common/Loader';

const MatchInfo = ({ matchId }) => {
  const [matchInfo, setMatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchInfo = async () => {
      try {
        setLoading(true);
        const data = await getMatchById(matchId);
        setMatchInfo(data);
      } catch (err) {
        setError('Failed to load match information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchInfo();
  }, [matchId]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!matchInfo) return <div>No match information available</div>;

  return (
    <div className="match-info-container">
      <h2>{matchInfo.name}</h2>
      <div className="match-details">
        <p><strong>Series:</strong> {matchInfo.series}</p>
        <p><strong>Venue:</strong> {matchInfo.venue}</p>
        <p><strong>Date:</strong> {new Date(matchInfo.date).toLocaleDateString()}</p>
        <p><strong>Match Type:</strong> {matchInfo.matchType}</p>
        <p><strong>Status:</strong> {matchInfo.status}</p>
      </div>
      
      <div className="teams-info">
        <div className="team">
          <img src={matchInfo.teamInfo[0].img} alt={matchInfo.teamInfo[0].name} />
          <h3>{matchInfo.teamInfo[0].name}</h3>
        </div>
        <div className="vs">VS</div>
        <div className="team">
          <img src={matchInfo.teamInfo[1].img} alt={matchInfo.teamInfo[1].name} />
          <h3>{matchInfo.teamInfo[1].name}</h3>
        </div>
      </div>
      
      {/* Additional match information can be added here */}
    </div>
  );
};

export default MatchInfo;

// client/src/components/LiveScore.js
import React, { useEffect, useState } from 'react';
import { getLiveScore } from '../services/api';
import Loader from './common/Loader';

const LiveScore = ({ matchId }) => {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveScore = async () => {
      try {
        setLoading(true);
        const data = await getLiveScore(matchId);
        setLiveData(data);
      } catch (err) {
        setError('Failed to load live score');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveScore();
    
    // Set up polling for live updates
    const intervalId = setInterval(fetchLiveScore, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [matchId]);

  if (loading && !liveData) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!liveData) return <div>No live data available</div>;

  const { batting, bowling, score, currentOver } = liveData;

  return (
    <div className="live-score-container">
      <div className="score-header">
        <div className="team-score">
          <h3>{liveData.teamInfo[0].name}</h3>
          <p className="score">{score[0]?.r || 0}-{score[0]?.w || 0} ({score[0]?.o || 0})</p>
        </div>
        <div className="team-score">
          <h3>{liveData.teamInfo[1].name}</h3>
          <p className="score">{score[1]?.r || 0}-{score[1]?.w || 0} ({score[1]?.o || 0})</p>
        </div>
      </div>
      
      <div className="match-status">
        <p>{liveData.status}</p>
      </div>
      
      <div className="current-players">
        <div className="batsmen">
          <h4>Batsmen</h4>
          {batting?.map(batsman => (
            <div key={batsman.id} className="player-row">
              <span className="name">{batsman.name}</span>
              <span className={`runs ${batsman.batting === 'striker' ? 'active' : ''}`}>
                {batsman.r} ({batsman.b})
              </span>
              <span className="stats">
                {batsman.fours}x4s, {batsman.sixes}x6s, SR: {batsman.sr}
              </span>
            </div>
          ))}
        </div>
        
        <div className="bowler">
          <h4>Bowler</h4>
          {bowling?.map(bowler => (
            <div key={bowler.id} className="player-row">
              <span className="name">{bowler.name}</span>
              <span className="stats">
                {bowler.o} - {bowler.m} - {bowler.r} - {bowler.w}, Econ: {bowler.eco}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="current-over">
        <h4>This Over:</h4>
        <div className="balls">
          {currentOver?.map((ball, index) => (
            <span key={index} className={`ball ${getBallClass(ball)}`}>
              {ball}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function for ball styling
const getBallClass = (ball) => {
  if (ball === 'W') return 'wicket';
  if (ball === '4') return 'boundary';
  if (ball === '6') return 'six';
  if (ball === '0') return 'dot';
  return '';
};

export default LiveScore;

// client/src/pages/MatchDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchById } from '../services/api';
import MatchInfo from '../components/MatchInfo';
import LiveScore from '../components/LiveScore';
import Scorecard from '../components/Scorecard';
import Loader from '../components/common/Loader';

const MatchDetailPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMatchById(id);
        setMatch(data);
      } catch (err) {
        setError('Failed to load match details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!match) return <div>Match not found</div>;

  return (
    <div className="match-detail-page">
      <div className="match-header">
        <div className="team-names">
          {match.teamInfo[0].name} vs {match.teamInfo[1].name}
        </div>
        <div className="match-subtitle">
          {match.series}, {match.venue}
        </div>
        
        <div className="score-summary">
          <div className="team">
            <img src={match.teamInfo[0].img} alt={match.teamInfo[0].name} />
            <div className="score">
              {match.score[0] ? `${match.score[0].r}-${match.score[0].w} (${match.score[0].o})` : 'Yet to bat'}
            </div>
          </div>
          <div className="team">
            <img src={match.teamInfo[1].img} alt={match.teamInfo[1].name} />
            <div className="score">
              {match.score[1] ? `${match.score[1].r}-${match.score[1].w} (${match.score[1].o})` : 'Yet to bat'}
            </div>
          </div>
        </div>
        
        <div className="match-status">{match.status}</div>
      </div>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Match info
        </button>
        <button 
          className={`tab-button ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Live
        </button>
        <button 
          className={`tab-button ${activeTab === 'scorecard' ? 'active' : ''}`}
          onClick={() => setActiveTab('scorecard')}
        >
          Scorecard
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'info' && <MatchInfo matchId={id} />}
        {activeTab === 'live' && <LiveScore matchId={id} />}
        {activeTab === 'scorecard' && <Scorecard matchId={id} />}
      </div>
    </div>
  );
};

export default MatchDetailPage;
