const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const store = new MongoDBStore({
    uri: 'mongodb+srv://samiali:tnz4LyYgMfQEuKoz@cluster0.5aycxc3.mongodb.net/sessions?retryWrites=true&w=majority',
    collection: 'sessions',
});

store.on('error', function (error) {
    console.error('Session store error:', error);
});

module.exports = (app) => {
    app.use(
        session({
            name: 'ziraat',
            secret: 'VJr7ToUJipFU9vjdQ6dqEWS1VvVcfAusewUWTTNMVJr7ToUJipFU9vjdQ6dqE2AWS1VvVcfAusewUWTTNMVJr7ToUJipFU9vjdQ6dqE2AWS1VvVcfAusewUWTTNM', // A secret key to sign the session ID cookie
            resave: false, // Don't save the session if it hasn't been modified
            saveUninitialized: false,
            store: store,
             // Don't save sessions that are uninitialized
            cookie: {
                maxAge: 360000000,
                secure: false,
                sameSite:false,
                httpOnly: true
            }, // Session timeout in milliseconds (1 hour)
        })
    );
};