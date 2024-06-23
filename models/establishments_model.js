// models/establishments_model.js
const mongoose = require('mongoose');

const establishmentSchema = new mongoose.Schema({
    EstablishmentName: {
        type: String,
        required: true
    },
    Owner: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Capacity: {
        type: Number,
        required: true
    },
    MotoPrice: {
        type: Number,
        required: true
    },
    CarPrice: {
        type: Number,
        required: true
    }
});

const Establishment = mongoose.model('Establishment', establishmentSchema);

module.exports = Establishment;
