import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchQuizQuestions = async (amount, category, difficulty) => {
  try {
    const response = await axios.get(${API_BASE_URL}/quiz, {
      params: { amount, category, difficulty },
    });

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      throw new Error('No questions returned from API');
    }

    return response.data.results;
  } catch (error) {
    console.error('API Error: ', error.message || error);
    throw error;
  }
};