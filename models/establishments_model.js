const mongoose = require('mongoose');

const establishmentSchema = new mongoose.Schema({
    EstablishmentName: {
        type: String,
        required: true
    },
    Capacity: {
        type: Number,
        required: true
    },
    Price: {
        type: String,
        required: true
    },
});

const Establishment = mongoose.model('Establishment', establishmentSchema);

module.exports = Establishment;
