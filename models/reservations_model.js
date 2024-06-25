const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    parkingLotId: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    plate: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending',
        required: true
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
