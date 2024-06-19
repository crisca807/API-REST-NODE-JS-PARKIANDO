const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    ReservationTime: {
        type: Date,
        required: true
    },
    Plate: {
        type: String,
        required: true,
        maxlength: 15
    },
    VehicleType: {
        type: String,
        enum: ['motorcycle', 'car'],
        required: true
    },
    Duration: {
        type: Number, // Duration in minutes
        required: true
    },
    TotalPrice: {
        type: Number, // Total price in Colombian Pesos
        required: true
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
