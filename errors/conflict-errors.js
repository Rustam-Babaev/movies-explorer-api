class ConflictError extends Error {
    constructor(message = 'Произошёл кофликт') {
        super(message);
        this.statusCode = 409;
    }
}

module.exports = ConflictError;