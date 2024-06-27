// logic/establishments_logic.js
const Establishment = require('../models/establishments_model');
const Joi = require('@hapi/joi');
const nodemailer = require('nodemailer');

// Schema validation for Establishment object
const Schema = Joi.object({
    EstablishmentName: Joi.string().required(),
    Owner: Joi.string().required(),
    Address: Joi.string().required(),
    Capacity: Joi.number().integer().required(),
    MotoPrice: Joi.number().required(),
    CarPrice: Joi.number().required()
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'crisca807@gmail.com', // Cambiar con tu dirección de correo electrónico
        pass: 'aihw ontj qary qixj' // Cambiar con tu contraseña de correo electrónico
    }
});

// Función para enviar correos electrónicos al propietario del establecimiento
async function sendEmailToOwner(establishment) {
    try {
        // Correo electrónico del destinatario
        const ownerEmail = 'crisca807@gmail.com'; // Cambiar con la dirección de correo electrónico del destinatario

        // Preparar el correo electrónico
        const mailOptions = {
            from: 'tucorreo@gmail.com',
            to: ownerEmail,
            subject: 'Establecimiento Creado',
            text: `Se ha creado el establecimiento con los siguientes datos:\n\n${JSON.stringify(establishment, null, 2)}`
        };

        // Enviar el correo electrónico
        const info = await transporter.sendMail(mailOptions);

        console.log('Correo electrónico enviado:', info.messageId);
        return true; // Indica que el correo se envió correctamente
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw new Error('No se pudo enviar el correo electrónico');
    }
}
// Asynchronous function to create an establishment
async function createEstablishment(body) {
    try {
        // Validar los datos del establecimiento
        const value = await Schema.validateAsync(body);
        
        // Crear una nueva instancia del establecimiento
        const establishment = new Establishment(value);
        
        // Guardar el establecimiento en la base de datos
        const savedEstablishment = await establishment.save();
        
        // Enviar un correo electrónico con los detalles del establecimiento creado
        await sendEmailToOwner(savedEstablishment);
        
        // Devolver el establecimiento guardado
        return savedEstablishment;
    } catch (error) {
        throw new Error("Error creating establishment: " + error.message);
    }
}

// Asynchronous function to deactivate an establishment by its ID
async function deactivateEstablishment(id) {
    try {
        return await Establishment.findByIdAndUpdate(id, { isActive: false }, { new: true });
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
    searchByName,
    sendEmailToOwner
};
