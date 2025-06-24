import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { ThemeContext } from '../context/ThemeContext';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: 5, // Default value set to 5
    category: '',
    difficulty: '',
  });

  const [errors, setErrors] = useState({});
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const fetchedOnceRef = useRef(false);

  // Detect system theme preference on first load
  useEffect(() => {
    const systemPrefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemPrefersDark);
  }, [setDarkMode]);

  useEffect(() => {
    if (fetchedOnceRef.current) return;

    fetchedOnceRef.current = true;

    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => {
        setCategories(data.trivia_categories);
        setFormData(prev => ({ ...prev, category: data.trivia_categories[0]?.id || '' }));
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!formData.amount || formData.amount < 5 || formData.amount > 20)
      newErrors.amount = 'Please enter a valid value between 5 to 20.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStart = () => {
    if (!validateFields()) return;

    const selectedCategoryName = categories.find(
      cat => cat.id === parseInt(formData.category)
    )?.name;

    navigate('/quiz', {
      state: {
        ...formData,
        categoryName: selectedCategoryName || '',
      },
    });
  };

  const isFormValid =
    formData.name &&
    formData.category &&
    formData.difficulty &&
    formData.amount >= 5 &&
    formData.amount <= 20;

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="themeSwitch"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <label className="form-check-label" htmlFor="themeSwitch">
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </label>
        </div>
      </div>

      <div className="container py-4 home-page">
        <h1 className="text-center mb-4 fw-bold text-homehead">Welcome to the Ultimate Quiz!</h1>

        <div className="text-center mb-4">
          <img
            src="/images/Image.jpg"
            alt="Quiz Banner"
            className="img-fluid rounded shadow banner-img"
            style={{ height: '500px', objectFit: 'contain' }}
          />
        </div>

        <div className="card shadow p-4 mb-4">
          <h4 className="mb-3 text-purple">Enter Your Name</h4>
          <input
            type="text"
            className="form-control"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            onBlur={validateFields}
          />
          {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
        </div>

        <div className="card shadow p-4 mb-4">
          <h4 className="mb-3 text-purple">Choose a Category</h4>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            onBlur={validateFields}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <div className="text-danger mt-1">{errors.category}</div>}
        </div>

        <div className="card shadow p-4 mb-4">
          <h4 className="mb-3 text-purple">Select Difficulty</h4>
          <div className="d-flex flex-wrap gap-4">
            {['easy', 'medium', 'hard'].map(level => (
              <div className="form-check form-check-inline" key={level}>
                <input
                  className="form-check-input"
                  type="radio"
                  value={level}
                  name="difficulty"
                  checked={formData.difficulty === level}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  id={diff-${level}}
                  onBlur={validateFields}
                />
                <label className="form-check-label" htmlFor={diff-${level}}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </label>
              </div>
            ))}
          </div>
          {errors.difficulty && <div className="text-danger mt-1">{errors.difficulty}</div>}
        </div>

        <div className="card shadow p-4 mb-4">
          <h4 className="mb-3 text-purple">Number of Questions</h4>
          <input
            type="number"
            className="form-control"
            min={5}
            max={20}
            value={formData.amount}
            onChange={(e) => {
              const value = parseInt(e.target.value || '0');
              setFormData(prev => ({ ...prev, amount: value }));
              if (value < 5 || value > 20) {
                setErrors(prev => ({ ...prev, amount: 'Please enter a valid value between 5 to 20.' }));
              } else {
                setErrors(prev => {
                  const updatedErrors = { ...prev };
                  delete updatedErrors.amount;
                  return updatedErrors;
                });
              }
            }}
            onBlur={validateFields}
          />
          {errors.amount && <div className="text-danger mt-1">{errors.amount}</div>}
        </div>

        <div className="text-center">
          <button
            className="btn btn-lg btn-success px-5 start-btn shadow"
            onClick={handleStart}
            disabled={!isFormValid}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;