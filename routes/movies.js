const router = require('express').Router();
const {
    getMovie,
    createMovie,
    deleteMovie,
} = require('../controllers/movies');
const { idMovieValidator, movieValidator } = require('../validation/movie-validation');

router.get('/', getMovie);

router.post('/', movieValidator, createMovie);

router.delete('/:movieId', idMovieValidator, deleteMovie);

module.exports = router;