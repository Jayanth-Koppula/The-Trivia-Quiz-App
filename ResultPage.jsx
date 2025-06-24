import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

const ResultPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const hasSavedAttempt = useRef(false); // ✅ Prevent duplicate API calls

  const name = state?.name || '';
  const score = state?.score || 0;
  const total = state?.total || 0;
  const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : 0;

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  useEffect(() => {
    if (!state || hasSavedAttempt.current) return;

    hasSavedAttempt.current = true;

    const saveAndFetchLeaderboard = async () => {
      try {
        await axios.post('http://localhost:5000/api/attempts', {
          name,
          score,
          total,
          percentage,
        });

        const res = await axios.get('http://localhost:5000/api/attempts/top');
        const unique = Array.from(
          new Map(res.data.map(item => [item.name, item])).values()
        );
        setLeaderboard(unique);
      } catch (err) {
        console.error('Error saving/fetching leaderboard:', err);
      }
    };

    saveAndFetchLeaderboard();
  }, [state, name, score, total, percentage]);

  if (!state) {
    return <div className="text-center mt-5">Redirecting...</div>;
  }

  const isPassed = parseFloat(percentage) >= 70;
  const imageSrc = isPassed ? '/images/Congo.png' : '/images/BetterLuck.png';
  const message = isPassed
    ? 🎉 Congratulations, ${name}!
    : Better luck next time :(;

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow text-center bg-light border-0">
        <img
          src={imageSrc}
          alt={isPassed ? 'Great Work!' : 'Try Again'}
          style={{ height: '400px', objectFit: 'contain' }} // 🔽 reduced height
          className="img-fluid mb-3"
        />
        <h2 className={isPassed ? 'text-success mb-3' : 'text-danger mb-3'}>
          {message}
        </h2>
        <h4 className="mb-4">
          You scored <strong>{score}</strong> out of <strong>{total}</strong> ({percentage}%)
        </h4>

        <div className="row justify-content-center mb-4">
          <div className="col-md-6 mb-3">
            <div className="card text-white bg-primary h-100 shadow">
              <div className="card-body">
                <h5 className="card-title">🏆 Leaderboard (Top 3)</h5>
                <ul className="list-group text-start">
                  {leaderboard.map((item, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      <strong>{item.name}</strong> <span>{item.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary px-4" onClick={() => navigate('/')}>
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultPage;