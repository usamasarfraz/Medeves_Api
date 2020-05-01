const mongoose = require('mongoose');
const { userSchema, adminSchema } = require('../schemas/schemas');

exports.User = () => {
    return mongoose.model('user', userSchema());
}

exports.Admin = () => {
    return mongoose.model('admin', adminSchema());
}