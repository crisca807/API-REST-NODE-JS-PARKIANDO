const Reservation = require('../models/reservations_model');
const Joi = require('@hapi/joi');

const parqueaderos = [
    { id: 1, nombre: 'Parqueadero A', tarifaCarro: 60, tarifaMoto: 52 },
    { id: 2, nombre: 'Parqueadero B', tarifaCarro: 50, tarifaMoto: 42 },
    // Otros parqueaderos...
];

const Schema = Joi.object({
    parkingLotId: Joi.number().integer().required(),
    startDate: Joi.date().iso().required(),
    startTime: Joi.string().required(),
    duration: Joi.number().integer().min(1).required(),
    totalPrice: Joi.number().required(),
    plate: Joi.string().required(),
    vehicleType: Joi.string().valid('car', 'motorcycle').required() // Ajustado para que coincida con los valores esperados
});


function calculateTotalPrice(vehicleType, duration, parqueadero) {
    const pricePerMinute = vehicleType === 'motorcycle' ? parqueadero.tarifaMoto : parqueadero.tarifaCarro;
    return pricePerMinute * duration;
}

async function createReservation(body) {
    try {
        const value = await Schema.validateAsync(body);

        const parqueadero = parqueaderos.find(p => p.id === value.parkingLotId);
        if (!parqueadero) {
            throw new Error('Parqueadero not found');
        }

        value.totalPrice = calculateTotalPrice(value.vehicleType, value.duration, parqueadero);

        const reservation = new Reservation(value);
        return await reservation.save();
    } catch (error) {
        throw new Error("Error creating reservation: " + error.message);
    }
}

async function listReservations() {
    try {
        return await Reservation.find();
    } catch (error) {
        throw new Error("Error listing reservations: " + error.message);
    }
}

async function deleteReservation(id) {
    try {
        return await Reservation.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error deleting reservation: " + error.message);
    }
}

async function updateReservation(id, data) {
    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            throw new Error("Reservation not found");
        }

        if (data.ReservationTime) reservation.ReservationTime = data.ReservationTime;
        if (data.Plate) reservation.Plate = data.Plate;
        if (data.VehicleType) reservation.VehicleType = data.VehicleType;
        if (data.Duration) {
            reservation.Duration = data.Duration;
            reservation.TotalPrice = calculateTotalPrice(reservation.VehicleType, data.Duration);
        }

        return await reservation.save();
    } catch (error) {
        throw new Error("Error updating reservation: " + error.message);
    }
}

async function searchReservationByPlate(plate) {
    try {
        return await Reservation.findOne({ Plate: plate });
    } catch (error) {
        throw new Error("Error searching reservation by plate: " + error.message);
    }
}

module.exports = {
    Schema,
    createReservation,
    listReservations,
    deleteReservation,
    updateReservation,
    searchReservationByPlate
};
