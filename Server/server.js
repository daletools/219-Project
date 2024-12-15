const express = require('express');
const dotenv = require('dotenv');                      // Keeping our API key safe
const path = require('path');
const MovieDb = require('moviedb-promise').MovieDb;         //A MovieDB library
const cors = require('cors');   // CORS so we can run the server and site locally
const mysql = require('mysql2/promise');               // MYSQL
const bodyParser = require('body-parser');                  //login form

// Load .env
dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
const moviedb = new MovieDb(process.env.TMDB_API_KEY);

//SQL stuff
const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'MovieUsers'
});

async function getUsers() {
    const [rows] = await pool.query(`SELECT * FROM users`);
    console.log(rows);
}

async function getUserID(username) {
    const query = `SELECT id FROM users WHERE username = ?`;
    const [rows] = await pool.query(query, [username]);
    if (rows.length > 0) {
        return rows[0].id;
    } else {
        console.log("Null user");
        return null;
    }
}

async function getUserPlaylists(userID) {
    const query = `SELECT p.* FROM playlists p, users u WHERE u.id = ? AND u.id = p.user_id`;
    const [rows] = await pool.query(query, [userID]);
    return rows;
}

async function getPlaylistMovies(playlistName, userID) {
    const query = `SELECT movie_id FROM playlist_movies pm, playlists p WHERE p.name = ? AND p.user_id = ?`;

    const [rows] = await pool.query(query, [playlistName, userID]);
    return rows;
}

async function createUser(username, password) {
    const check = `SELECT * FROM users WHERE user = ?`;
    const [checkRows] = await pool.query(check, username);
    if (checkRows.length === 0) {
        const query = `INSERT INTO users VALUES(null, ?, SHA1(?))`
        await pool.query(query, [username, password]);
        resolve();
    } else {
        reject("Another user already exists with that name.");
    }
}

async function createPlaylist(user_id, playlistName) {
    const check = `SELECT * FROM playlists WHERE user_id = ? AND name = ?`;
    const [rows] = await pool.query(check, [user_id, playlistName]);
    if (rows.length === 0) {
        const query = `INSERT INTO playlists VALUES(null, ?, ?)`;
        await pool.query(query, [playlistName, user_id]);
    } else {
        console.log(`Playlist with name ${playlistName} already exists for user with id ${user_id}`);
    }
}

async function createPlayListFromUser(username, playlistName) {
    const id = await getUserID(username);
    if (id) {
        await createPlaylist(id, playlistName);
    } else {
        console.log('User not found');
    }
}

async function addMovieToPlaylist(user_id, playlistID, movieID) {
    const query = `SELECT * FROM playlists WHERE user_id = ? AND id = ?`;
    const [check] = await pool.query(query, [user_id, playlistID]);
    if (check.length > 0) {
        const insert = `INSERT INTO playlist_movies (playlist_id, movie_id) VALUES(?, ?)`;
        try {
            await pool.query(insert, [playlistID, movieID]);
        } catch (e) {
            console.log(e);
        }
    }
}

// Enable CORS and parser
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userpage.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req);
    console.log(username + ' ' + password);
    try {
        const query = `SELECT * FROM users WHERE username = ? AND password = SHA1(?)`;
        const [rows] = await pool.query(query, [username, password]);
        console.log(rows);

        if (rows.length > 0) {
            res.send({ success: true, message: 'Login successful!' });
        } else {
            res.send({ success: false, message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Server error. Please try again later.' });
    }
});

app.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        const response = await moviedb.searchMovie({ query });
        res.json(response.results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/discover', async (req, res) => {
    try {
        const { genres, providers } = req.body;
        const response = await moviedb.discoverMovie({
            with_genres: genres.join(','),
            watch_region: 'CA',
            with_watch_providers: providers.join('|'),
            sort_by: 'popularity.desc'
        });
        res.json(response.results);
    } catch (error) {
        console.log(error);
    }
})

app.post('/filteredSearch', async (req, res) => {
    try {
        const { genres, providers, query } = req.body;
        const search = await moviedb.searchMovie({ query });

        let filteredResults = [];
        for (let movie of search.results) {
            let genreMatch = true;
            let providerMatch = false;

            for (let genre of genres) {
                if (!movie.genre_ids.includes(Number(genre))) {
                    genreMatch = false;
                }
            }
            if (!genreMatch) continue;

            const idProviders = await moviedb.movieWatchProviders(movie.id);
            if (idProviders.results.CA?.flatrate) {
                for (let check of idProviders.results.CA?.flatrate) {
                    console.log(check.provider_id);
                    if (providers.includes(check.provider_id.toString())) {
                        providerMatch = true;
                    }
                }
            }
            if (!providerMatch) continue;

            filteredResults.push(movie);
        }

        res.json(filteredResults);

    } catch (error) {
        console.log(error);
    }
})


async function startServer() {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();