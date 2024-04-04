const Establecimiento = require('../models/establecimiento_model');
const Joi = require('@hapi/joi');

// Validaciones para el objeto Establecimiento
const Schema = Joi.object({
    NombreEstablecimiento: Joi.string().required(),
    Capacidad: Joi.number().integer().required(),
    Tarifa: Joi.number().required()
});

// Función asincrónica para crear un establecimiento
async function crearEstablecimiento(body) {
    try {
        const value = await Schema.validateAsync(body);
        const establecimiento = new Establecimiento(value);
        return await establecimiento.save();
    } catch (error) {
        throw new Error("Error al crear el establecimiento: " + error.message);
    }
}

// Función asincrónica para desactivar un establecimiento
async function desactivarEstablecimiento(id) {
    try {
        return await Establecimiento.findByIdAndUpdate(id, { estado: false }, { new: true });
    } catch (error) {
        throw new Error("Error al desactivar el establecimiento: " + error.message);
    }
}

// Función asincrónica para listar todos los establecimientos
async function listarEstablecimientos() {
    try {
        return await Establecimiento.find();
    } catch (error) {
        throw new Error("Error al listar los establecimientos: " + error.message);
    }
}

// Función asincrónica para actualizar los datos de un establecimiento
async function actualizarEstablecimiento(id, datos) {
    try {
        return await Establecimiento.findByIdAndUpdate(id, datos, { new: true });
    } catch (error) {
        throw new Error("Error al actualizar el establecimiento: " + error.message);
    }
}

// Función asincrónica para buscar un establecimiento por su nombre
async function buscarPorNombre(nombre) {
    try {
        return await Establecimiento.findOne({ NombreEstablecimiento: nombre });
    } catch (error) {
        throw new Error("Error al buscar el establecimiento por nombre: " + error.message);
    }
}

module.exports = {
    Schema,
    crearEstablecimiento,
    desactivarEstablecimiento,
    listarEstablecimientos,
    actualizarEstablecimiento,
    buscarPorNombre
};
