require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./constants/limiter');
const corsOptions = require('./constants/cors');
const routerApp = require('./routes/index');
const handlerErrors = require('./errors/handler-errors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { loginValidator, registrationValidator } = require('./validation/movie-validation');

const { PORT = 3000, MONGO = 'mongodb://localhost:27017/dev' } = process.env;
const app = express();

mongoose.connect(MONGO, {
    useNewUrlParser: true,
});
app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', (req, res, next) => {
    setTimeout(() => {
        const customError = new Error('Сервер сейчас упадёт');
        customError.statusCode = 521;
        next(customError);
    }, 0);
});

app.post('/signin', loginValidator, login);
app.post('/signup', registrationValidator, createUser);

app.use(auth);

app.use('/', routerApp);
app.use('/', (req, res, next) => {
    const customError = new Error('введен некорректный url');
    customError.statusCode = 404;
    next(customError);
});
app.use(errorLogger);
app.use(errors());
app.use(handlerErrors);
app.listen(PORT, () => {});