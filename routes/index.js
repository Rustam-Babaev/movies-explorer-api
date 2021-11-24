const router = require('express').Router();
const routerUsers = require('./users');
const routerMovies = require('./movies');
const { loginValidator, registrationValidator } = require('../validation/movie-validation');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');

router.post('/signin', loginValidator, login);
router.post('/signup', registrationValidator, createUser);

router.use(auth);

router.use('/users', routerUsers);
router.use('/movies', routerMovies);

module.exports = router;