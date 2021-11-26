const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../constants/configure');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-errors');
const {
  notCorrectIdMessage,
  noUserMessage,
  notCorrectDataUserMessage,
  emailBusyMessage,
  conflictMessage,
} = require('../constants/constants');

const NotFoundUserError = () => { throw new NotFoundError(noUserMessage); };

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))

    .then((user) => {
      res.send({ _id: user._id, email: user.email, name: user.name });
    })
    .catch((err) => {
      let customError = err;
      if (err.name === 'ValidationError') {
        customError = new ValidationError(notCorrectDataUserMessage);
      }
      if (customError.code === 11000) {
        customError = new ConflictError(emailBusyMessage);
      }
      next(customError);
    });
};

const changeProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(NotFoundUserError)
    .then((user) => res.send(user))
    .catch((err) => {
      let customError = err;
      if (err.name === 'CastError') {
        customError = new ValidationError(notCorrectIdMessage);
      }
      if (err.name === 'ValidationError') {
        customError = new ValidationError(notCorrectDataUserMessage);
      }
      if (err.name === 'MongoServerError') {
        customError = new ConflictError(conflictMessage);
      }
      next(customError);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: JSON.stringify(token) });
    })
    .catch(next);
};

const signOut = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res
        .cookie('jwt', '', {
          maxAge: -1,
          httpOnly: true,
        })
        .send({ message: `${user.email} вышел из аккаунта` });
    })
    .catch(next);
};

const getOwner = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(NotFoundUserError)
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser,
  changeProfile,
  login,
  getOwner,
  signOut,
};
