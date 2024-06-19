const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
    valoration: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

const Qualification = mongoose.model('Qualification', qualificationSchema);

module.exports = Qualification;
