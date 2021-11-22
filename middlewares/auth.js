const jwt = require('jsonwebtoken');
require('dotenv').config();
const AuthError = require('../errors/auth-errors');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
    let customError;
    if (!token) {
        customError = new AuthError();
    }

    let payload;

    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        customError = new AuthError();
        next(customError);
    }

    req.user = payload;

    next();
};