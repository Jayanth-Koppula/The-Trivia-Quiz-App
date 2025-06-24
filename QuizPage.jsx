import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchQuizQuestions } from '../utils/api';
import QuestionCard from '../components/QuestionCard';
import { ThemeContext } from '../context/ThemeContext';

const QuizPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60 * state.amount); // ⏳ 1 min per question
  const timerRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!state) return navigate('/');
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchQuizQuestions(state.amount, state.category, state.difficulty);
        if (!data || data.length === 0) {
          setError('No quiz questions found. Please try different options.');
        } else {
          setQuestions(data);
          setCurrent(0);
          setScore(0);
          setAnswers({});
        }
      } catch (err) {
        console.error("Quiz fetch error:", err);
        setError('Failed to load quiz questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [navigate, state]);

  // ⏱ Timer logic
  useEffect(() => {
    if (loading || error) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, error]);

  const handleAnswer = (selectedAnswer) => {
    const correctAnswer = questions[current].correct_answer;
    const prevSelected = answers[current];

    if (prevSelected === selectedAnswer) return;

    setAnswers(prev => ({ ...prev, [current]: selectedAnswer }));

    if (!prevSelected && selectedAnswer === correctAnswer) {
      setScore(prev => prev + 1);
    } else if (prevSelected === correctAnswer && selectedAnswer !== correctAnswer) {
      setScore(prev => prev - 1);
    }
  };

  const handlePrevious = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = (isAuto = false) => {
    clearInterval(timerRef.current);
    navigate('/result', {
      state: {
        name: state.name,
        score,
        total: questions.length,
        timeTaken: state.amount * 60 - timeLeft,
        autoSubmitted: isAuto
      },
    });
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!questions.length) return <p>No questions available.</p>;

  const isAnswered = answers.hasOwnProperty(current);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Category: {state.categoryName}</h4>
          <p className="text-muted mb-0">Player: {state.name}</p>
        </div>
        <div className="bg-dark text-white px-3 py-2 rounded shadow">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <QuestionCard
        questionData={questions[current]}
        currentQuestion={current}
        totalQuestions={questions.length}
        selectedAnswer={answers[current]}
        handleAnswer={handleAnswer}
      />

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={current === 0}
        >
          Previous
        </button>

        {current === questions.length - 1 ? (
          <button
            className="btn btn-success"
            onClick={() => handleSubmit(false)}
            disabled={!isAnswered}
          >
            Submit
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isAnswered}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
