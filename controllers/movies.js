const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const NoRightsError = require('../errors/no-rights-error');
const {
    noMovieMessage,
    notCorrectDataMovieMessage,
    notCorrectIdMessage,
} = require('../constants/constants');

const NotFoundMovieError = () => { throw new NotFoundError(noMovieMessage); };

const getMovie = (req, res, next) => {
    Movie.find({})
        .orFail(NotFoundMovieError)
        .then((movies) => res.send({ data: movies }))
        .catch(next);
};

const createMovie = (req, res, next) => {
    const {
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
    } = req.body;
    Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner: req.user,
    })
        .then((movie) => res.send({ data: movie }))
        .catch((err) => {
            let customError = err;
            if (err.name === 'ValidationError') {
                customError = new ValidationError(notCorrectDataMovieMessage);
            }
            next(customError);
        });
};

const deleteMovie = (req, res, next) => {
    Movie.findById(req.params.movieId)
        .orFail(NotFoundMovieError)
        .then((movie) => {
            if (movie.owner.toString() !== req.user._id) {
                throw new NoRightsError();
            } else {
                return movie.delete(req.params.movieId)
                    .then((film) => res.send(film));
            }
        })
        .catch((err) => {
            let customError = err;
            if (err.name === 'CastError') {
                customError = new ValidationError(notCorrectIdMessage);
            }
            next(customError);
        });
};

module.exports = {
    getMovie,
    createMovie,
    deleteMovie,
};