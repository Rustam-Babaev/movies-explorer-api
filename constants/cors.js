const corsOptions = {
    origin: ['https://movies-explorer.babaev.nomoredomains.work', 'http://movies-explorer.babaev.nomoredomains.work', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
};

module.exports = corsOptions;