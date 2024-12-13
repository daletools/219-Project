const express = require('express');
const dotenv = require('dotenv');                      // Keeping our API key safe
const path = require('path');
const MovieDb = require('moviedb-promise').MovieDb;         //A MovieDB library
const cors = require('cors');   // CORS so we can run the server and site locally
const mysql = require('mysql2/promise');               // MYSQL

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const moviedb = new MovieDb(process.env.TMDB_API_KEY);

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/search', async (req, res) => {
    try {
        const response = await moviedb.searchMovie({ query: req.query.q });
        res.json(response.results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});