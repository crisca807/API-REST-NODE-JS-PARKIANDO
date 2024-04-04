const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    TiempoReserva: {
        type: Date,
        required: true
    },
    Placa: {
        type: String,
        required: true,
        maxlength: 15
    },
    TipoVehiculo: {
        type: String,
        enum: ['moto', 'carro'],
        required: true
    }
});

const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;
