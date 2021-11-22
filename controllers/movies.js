/* eslint-disable indent */
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const NoRightsError = require('../errors/no-rights-error');

const NotFoundMovieError = () => { throw new NotFoundError('Нет фильма по заданному id'); };

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
                customError = new ValidationError('Переданы некорректные данные при создании фильма.');
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
            }
        })
        .then(() => {
            Movie.findByIdAndDelete(req.params.movieId)
                .orFail(NotFoundMovieError)
                .then((movie) => res.send(movie));
        })
        .catch((err) => {
            let customError = err;
            if (err.name === 'CastError') {
                customError = new ValidationError('передан невалидный id.');
            }
            next(customError);
        });
};

// const putLike = (req, res, next) => {
//   Card.findByIdAndUpdate(
//           req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true },
//       )
//       .orFail(NotFoundCardError)
//       .then((card) => res.send(card))
//       .catch((err) => {
//           let customError = err;
//           if (err.name === 'ValidationError') { customError = new ValidationError('Переданы некорректные данные для постановки/снятии лайка.'); }
//           if (err.name === 'CastError') { customError = new ValidationError('Передан невалидный id.'); }
//           next(customError);
//       });
// };

// const deleteLike = (req, res, next) => {
//   Card.findByIdAndUpdate(
//           req.params.cardId, { $pull: { likes: req.user._id } }, { new: true, runValidators: true },
//       )
//       .orFail(NotFoundCardError)
//       .then((card) => res.send(card))
//       .catch((err) => {
//           let customError = err;
//           if (err.name === 'ValidationError') { customError = new ValidationError('Переданы некорректные данные для постановки/снятии лайка.'); }
//           if (err.name === 'CastError') { customError = new ValidationError('Передан невалидный id.'); }
//           next(customError);
//       });
// };

module.exports = {
    getMovie,
    createMovie,
    deleteMovie,
};