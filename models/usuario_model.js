const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
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
    tipoUsuario: {
        type: String,
        enum: ['administrador', 'cliente'],
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

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
