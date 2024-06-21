// User.js
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
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
    address: {
        type: String, // Tipo de dato para la dirección
        required: true  // Puedes modificar esta validación según tu caso
    },
    userType: {
        type: String,
        enum: ['admin', 'client'],
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

const Admin = mongoose.model('Administrador', AdminSchema);

module.exports = Admin;