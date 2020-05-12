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

exports.storeSchema = () => {
    return mongoose.Schema({
        email: String,
        firstName: String,
        lastName: String,
        password: String,
        phone: String,
        userType: Number,
        store_name: String,
        cnic: String,
        city: String,
        address: String,
        certificate: String,
        images: Array,
        latitude: String,
        longitude: String,
        device_token: String,
    });
}

exports.riderSchema = () => {
    return mongoose.Schema({
        email: String,
        firstName: String,
        lastName: String,
        password: String,
        phone: String,
        userType: Number,
        rider_name: String,
        cnic: String,
        city: String,
        address: String,
        age: Number,
        images: Array,
        latitude: String,
        longitude: String,
        device_token: String,
    });
}