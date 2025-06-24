A full-stack quiz web application that allows users to take multiple-choice quizzes, track scores, and view the leaderboard. Built with React, Node.js, Express, and MongoDB, this app fetches quiz questions from the Open Trivia DB API in real-time and stores user attempts for leaderboard rankings.

---

## 🚀 Features

- 🧑 Enter your name and choose quiz preferences
- 🧠 Real-time quiz questions from [Open Trivia DB](https://opentdb.com/)
- 🔢 Multiple difficulty levels and categories
- ✅ Live score tracking with answer review and navigation
- ⏱️ Quiz timer to add challenge
- 📊 Result page with score, percentage, and pass/fail status
- 🏆 Leaderboard displaying top 5 high scorers
- 🌗 Light/Dark mode with system theme detection
- 🎨 Responsive UI using Bootstrap

---

## 🛠️ Tech Stack

| Frontend       | Backend         | Database | Other           |
|----------------|-----------------|----------|------------------|
| React 19       | Node.js         | MongoDB  | Axios            |
| React Router 7 | Express.js      | Mongoose | Bootstrap 5      |
| Context API    | dotenv, cors    |          | HTML Entities (`he`) |
| React Hooks    |                 |          |                 |

---

## 🔧 Setup Instructions

### ⚙️ Prerequisites

- Node.js & npm
- MongoDB (running locally or Atlas)
- Internet connection to fetch questions from OpenTDB

---

### 🖥️ Frontend Setup

```bash
cd quiz-app
npm install
npm start
