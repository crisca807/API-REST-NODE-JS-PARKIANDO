const Reservation = require('../models/reservations_model');
const Joi = require('@hapi/joi');

// Schema validation for reservation object
const Schema = Joi.object({
    ReservationTime: Joi.date().required(),
    Plate: Joi.string().max(15).required(),
    VehicleType: Joi.string().valid('motorcycle', 'car').required(),
    Duration: Joi.number().integer().min(1).required() // Duration in minutes
});

// Function to calculate the total price based on the duration and vehicle type
function calculateTotalPrice(vehicleType, duration) {
    const pricePerMinute = vehicleType === 'motorcycle' ? 50 : 100; // Example prices
    return pricePerMinute * duration;
}

// Asynchronous function to create a reservation
async function createReservation(body) {
    try {
        // Validate input data
        const value = await Schema.validateAsync(body);

        // Calculate the total price based on the vehicle type and duration
        value.TotalPrice = calculateTotalPrice(value.VehicleType, value.Duration);

        // Create a new reservation with the provided data
        const reservation = new Reservation(value);

        // Save the reservation to the database
        return await reservation.save();
    } catch (error) {
        throw new Error("Error creating reservation: " + error.message);
    }
}

// Asynchronous function to list all reservations
async function listReservations() {
    try {
        return await Reservation.find();
    } catch (error) {
        throw new Error("Error listing reservations: " + error.message);
    }
}

// Asynchronous function to delete a reservation by ID
async function deleteReservation(id) {
    try {
        return await Reservation.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error deleting reservation: " + error.message);
    }
}

// Asynchronous function to update a reservation by ID
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

// Asynchronous function to search for a reservation by plate
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
