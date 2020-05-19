// middlewear
const authMiddleware = require('../config/auth');
// routes
const authRoutes = require('./auth');
const userRoutes = require('./users');

module.exports = (app) => {
    app.use('/users', authRoutes);
    app.use(
        '/users',
        authMiddleware,
        userRoutes
    );
}