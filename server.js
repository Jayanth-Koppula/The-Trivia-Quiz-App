const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const attemptRoutes = require('./routes/attempts');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/attempts', attemptRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => console.error(err));

// Retry logic with exponential backoff for rate-limiting
const fetchWithRetry = async (url, retries = 5, delay = 1500) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url);
            return response;
        } catch (error) {
            if (error.response?.status === 429 && attempt < retries) {
                const waitTime = delay * attempt;
                console.warn(Rate limited (attempt ${attempt}). Retrying in ${waitTime}ms...);
                await new Promise(res => setTimeout(res, waitTime));
            } else {
                throw error;
            }
        }
    }
};

app.get("/api/quiz", async (req, res) => {
    try {
        const { amount, category, difficulty } = req.query;

        const url = https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple;
        const response = await fetchWithRetry(url);

        const data = response.data;

        if (!data || data.response_code !== 0 || !data.results || data.results.length === 0) {
            return res.status(400).json({ error: "No quiz questions found. Please try different options." });
        }

        res.json(data);
    } catch (error) {
        console.error("Failed to fetch quiz data:", error.message);
        res.status(500).json({ error: "Failed to fetch quiz data from OpenTDB." });
    }
});