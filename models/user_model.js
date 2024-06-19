const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['admin', 'client'],
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String
    }
});

const User = mongoose.model('Usuarios', userSchema);

module.exports = User;
