const mongoose = require('mongoose');

const establecimientoSchema = new mongoose.Schema({
    NombreEstablecimiento: {
        type: String,
        required: true
    },
    Capacidad: {
        type: Number,
        required: true
    },
    Tarifa: {
        type: Number,
        required: true
    }
});

const Establecimiento = mongoose.model('Establecimiento', establecimientoSchema);

module.exports = Establecimiento;
