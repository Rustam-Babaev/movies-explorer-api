const { noAuthMessage } = require('../constants/constants');

class AuthError extends Error {
  constructor(message = noAuthMessage) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = AuthError;
