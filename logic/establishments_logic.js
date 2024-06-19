const Establishment = require('../models/establishments_model');
const Joi = require('@hapi/joi');

// Schema validation for Establishment object
const Schema = Joi.object({
    EstablishmentName: Joi.string().required(),
    Capacity: Joi.number().integer().required(),
    Price: Joi.string().required() // Validación actualizada para aceptar un String
});

// Asynchronous function to create an establishment
async function createEstablishment(body) {
    try {
        const value = await Schema.validateAsync(body);
        const establishment = new Establishment(value);
        return await establishment.save();
    } catch (error) {
        throw new Error("Error creating establishment: " + error.message);
    }
}

// Función asincrónica para desactivar un establecimiento por su ID
async function deactivateEstablishment(id) {
    try {
        return await Establishment.findByIdAndUpdate(id, { isActive: false }, { new: true });
    } catch (error) {
        throw new Error("Error desactivando establecimiento: " + error.message);
    }
}

// Otra función asincrónica para eliminar un establecimiento por su ID
async function deleteEstablishment(id) {
    try {
        return await Establishment.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error eliminando establecimiento: " + error.message);
    }
}


// Asynchronous function to list all establishments
async function listEstablishments() {
    try {
        return await Establishment.find();
    } catch (error) {
        throw new Error("Error listing establishments: " + error.message);
    }
}

// Asynchronous function to update establishment data by ID
async function updateEstablishment(id, data) {
    try {
        return await Establishment.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw new Error("Error updating establishment: " + error.message);
    }
}

// Asynchronous function to search for an establishment by its name
async function searchByName(name) {
    try {
        return await Establishment.findOne({ EstablishmentName: name });
    } catch (error) {
        throw new Error("Error searching establishment by name: " + error.message);
    }
}

module.exports = {
    Schema,
    createEstablishment,
    deactivateEstablishment,
    deleteEstablishment,
    listEstablishments,
    updateEstablishment,
    searchByName
};
