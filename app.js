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

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

mongoose.connect(MONGO, {
  useNewUrlParser: true,
});
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routerApp);

app.use(errorLogger);
app.use(errors());
app.use(handlerErrors);
app.listen(PORT, () => {});
