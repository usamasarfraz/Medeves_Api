// middlewear
const authMiddleware = require('../config/auth');
// routes
const authRoutes = require('./auth');
const userRoutes = require('./users');
const nonVerifyRoutes = require('./nonVerify');

module.exports = (app) => {
    app.use('/users', authRoutes);
    app.use('/users', nonVerifyRoutes);
    app.use(
        '/users',
        authMiddleware,
        userRoutes
    );
}