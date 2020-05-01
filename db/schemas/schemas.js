const mongoose = require('mongoose');

exports.userSchema = () => {
    return mongoose.Schema({
        email: String,
        firstName: String,
        lastName: String,
        password: String,
        phone: String,
        userType: Number,
        device_token: String,
    });
}