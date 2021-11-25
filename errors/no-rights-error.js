const { noRightsMessage } = require('../constants/constants');

class NoRightsError extends Error {
  constructor(message = noRightsMessage) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = NoRightsError;
