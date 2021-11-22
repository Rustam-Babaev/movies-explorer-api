const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value) => {
    if (!validator.isURL(value, { require_protocol: true })) {
        throw new Error('Неправильный формат ссылки');
    }
    return value;
};

const loginValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
    }),
});

const registrationValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().min(2).max(30),
    }),
});

const idMovieValidator = celebrate({
    params: Joi.object().keys({
        movieId: Joi.string().hex().length(24),
    }),
});

const movieValidator = celebrate({
    body: Joi.object().keys({
        country: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        year: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required().custom(validateURL, 'custom validation for links'),
        trailer: Joi.string().required().custom(validateURL, 'custom validation for links'),
        thumbnail: Joi.string().required().custom(validateURL, 'custom validation for links'),
        owner: Joi.string().required().hex().length(24),
        movieId: Joi.string().required().hex().length(24),
        nameRU: Joi.string().required(),
        nameEN: Joi.string().required(),

    }),
});

module.exports = {
    loginValidator,
    registrationValidator,
    idMovieValidator,
    movieValidator,
    validateURL,
};