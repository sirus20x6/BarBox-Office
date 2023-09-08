const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); 
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3393;
const path = require('path');

app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

const authRoutes = require('./routes/auth');

app.use(authRoutes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

const movies = require('./movies.json');

app.get('/', (req, res) => {
    const sortedMovies = movies.sort((a, b) => (b.imdbRating + b.votes * 0.5) - (a.imdbRating + a.votes * 0.5));
    res.render('movies', {
        movies: sortedMovies,
        user: req.user
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.status(403).send('You must be logged in to vote.');
  }

app.post('/addmovie', async (req, res) => {
    const imdbID = req.body.imdbID;

    const apiKey = '3063b358';
    try {
        const response = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
        const movieData = response.data;

        if (!movies.find(movie => movie.id === imdbID)) {
            movies.push({
                id: movieData.imdbID,
                title: movieData.Title,
                poster: movieData.Poster,
                synopsis: movieData.Plot,
                votes: 0,
		imdbRating: movieData.imdbRating
            });
            fs.writeFileSync('./movies.json', JSON.stringify(movies, null, 4));
        }
    } catch(error) {
        console.error("Error fetching from OMDb:", error);
    }

    res.redirect('/');
});

const moviesPath = 'movies.json';

app.post('/vote', ensureAuthenticated, (req, res) => {
    const movieId = req.body.id;
    const action = req.body.action;
    
    const movie = movies.find(m => m.id === movieId);
    
    if (!movie) {
        return res.status(404).send('Movie not found.');
    }
    
    if (action === 'up') {
        movie.votes++;
    } else if (action === 'down') {
        movie.votes--;
    } else {
        return res.status(400).send('Invalid action.');
    }
    
    // Re-sort movies based on new criteria
    movies.sort((a, b) => (b.imdbRating + b.votes * 0.5) - (a.imdbRating + a.votes * 0.5));
    
    // Save updated movies list to movies.json
    fs.writeFile(path.join(__dirname, 'movies.json'), JSON.stringify(movies, null, 2), (err) => {
        if (err) {
            console.error('Error saving vote to file:', err);
            return res.status(500).send('Internal server error.');
        }
        
                res.json({
            newVoteCount: movie.votes
        });
    });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
