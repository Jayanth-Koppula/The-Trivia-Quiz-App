import React, { useState, useEffect } from 'react';
import he from 'he';

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

const QuestionCard = ({
  questionData,
  currentQuestion,
  totalQuestions,
  handleAnswer,
  selectedAnswer,
}) => {
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    if (questionData) {
      const allOptions = [
        ...questionData.incorrect_answers,
        questionData.correct_answer,
      ];
      setShuffledOptions(shuffleArray(allOptions));
    }
  }, [questionData]);

  if (!questionData) return <div>Loading question...</div>;

  return (
    <div className="card p-4 shadow">
      <h5>
        {Q${currentQuestion + 1} of ${totalQuestions}: }
        <span dangerouslySetInnerHTML={{ __html: he.decode(questionData.question) }} />
      </h5>
      
      <form className="mt-3">
        {shuffledOptions.map((opt, idx) => (
          <div className="form-check" key={idx}>
            <input
              type="radio"
              className="form-check-input"
              id={option-${idx}}
              name={question-${currentQuestion}}
              value={opt}
              checked={selectedAnswer === opt}
              onChange={() => handleAnswer(opt)}
            />
            <label
              className="form-check-label"
              htmlFor={option-${idx}}
              dangerouslySetInnerHTML={{ __html: he.decode(opt) }}
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default QuestionCard;