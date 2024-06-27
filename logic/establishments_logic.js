// logic/establishments_logic.js
const Establishment = require('../models/establishments_model');
const Joi = require('@hapi/joi');

// Schema validation for Establishment object
const Schema = Joi.object({
    EstablishmentName: Joi.string().required(),
    Owner: Joi.string().required(),
    Address: Joi.string().required(),
    Capacity: Joi.number().integer().required(),
    MotoPrice: Joi.number().required(),
    CarPrice: Joi.number().required()
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

// Asynchronous function to deactivate an establishment by its ID
async function deactivateEstablishment(id) {
    try {
        const updatedEstablishment = await Establishment.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return updatedEstablishment;
    } catch (error) {
        throw new Error("Error deactivating establishment: " + error.message);
    }
}


// Asynchronous function to delete an establishment by its ID
async function deleteEstablishment(id) {
    try {
        return await Establishment.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error deleting establishment: " + error.message);
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
