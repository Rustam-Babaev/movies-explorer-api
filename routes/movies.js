const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { idMovieValidator, movieValidator } = require('../validation/movie-validation');

router.get('/', getMovies);

router.post('/', movieValidator, createMovie);

router.delete('/:movieId', idMovieValidator, deleteMovie);

module.exports = router;
