const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
    valoracion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

const Calificacion = mongoose.model('Calificacion', calificacionSchema);

module.exports = Calificacion;
