const Reserva = require('../models/reserva_model');
const Joi = require('@hapi/joi');

// Validaciones para el objeto reserva
const Schema = Joi.object({
    TiempoReserva: Joi.date().required(),
    Placa: Joi.string().max(15).required(),
    TipoVehiculo: Joi.string().valid('moto', 'carro').required()
});

// Función asincrónica para crear una reserva
async function crearReserva(body) {
    try {
        // Validar los datos de entrada
        const value = await Schema.validateAsync(body);

        // Crear una nueva reserva con los datos proporcionados
        const reserva = new Reserva(value);

        // Guardar la reserva en la base de datos
        return await reserva.save();
    } catch (error) {
        throw new Error("Error al crear la reserva: " + error.message);
    }
}

// Función asincrónica para listar todas las reservas
async function listarReservas() {
    try {
        // Encontrar y devolver todas las reservas
        return await Reserva.find();
    } catch (error) {
        throw new Error("Error al listar las reservas: " + error.message);
    }
}

// Función asincrónica para borrar una reserva por su ID
async function borrarReserva(id) {
    try {
        // Buscar y eliminar la reserva por su ID
        return await Reserva.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error al borrar la reserva: " + error.message);
    }
}

// Función asincrónica para actualizar una reserva por su ID
async function actualizarReserva(id, datos) {
    try {
        // Buscar la reserva por su ID
        let reserva = await Reserva.findById(id);

        // Verificar si la reserva existe
        if (!reserva) {
            throw new Error("Reserva no encontrada");
        }

        // Actualizar los campos de la reserva con los nuevos datos
        if (datos.TiempoReserva) {
            reserva.TiempoReserva = datos.TiempoReserva;
        }
        if (datos.Placa) {
            reserva.Placa = datos.Placa;
        }
        if (datos.TipoVehiculo) {
            reserva.TipoVehiculo = datos.TipoVehiculo;
        }

        // Guardar los cambios en la base de datos
        return await reserva.save();
    } catch (error) {
        throw new Error("Error al actualizar la reserva: " + error.message);
    }
}

module.exports = {
    Schema,
    crearReserva,
    listarReservas,
    borrarReserva,
    actualizarReserva
};
