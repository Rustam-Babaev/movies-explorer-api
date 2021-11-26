const {
  DATA_MOVIES = 'mongodb://localhost:27017/moviedb',
  PORT = 3000,
  NODE_ENV = 'development',
  JWT_SECRET = 'dev-key',
} = process.env;

module.exports = {
  DATA_MOVIES,
  PORT,
  NODE_ENV,
  JWT_SECRET,
};
