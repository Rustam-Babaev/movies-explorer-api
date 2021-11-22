/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator(email) {
                return validator.isEmail(email);
            },
            message: (props) => `${props.value} неккоректный email`,
        },
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 4,
        select: false,
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
    },

});

userSchema.statics.findUserByCredentials = function(email, password) {
    return this.findOne({ email }).select('+password')
        .then((user) => {
            const customError = new Error('Неправильные почта или пароль');
            customError.statusCode = 401;
            if (!user) {
                return Promise.reject(customError);
            }

            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        return Promise.reject(customError);
                    }

                    return user;
                });
        });
};

module.exports = mongoose.model('user', userSchema);