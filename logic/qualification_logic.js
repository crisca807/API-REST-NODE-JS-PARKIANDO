const Qualification = require('../models/qualification_model');
const Joi = require('@hapi/joi');

// Esquema de validación para el objeto de calificación
const Schema = Joi.object({
    valoration: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
});

// Función asincrónica para crear una calificación
async function createQualification(body) {
    try {
        const value = await Schema.validateAsync(body);
        const qualification = new Qualification(value);
        return await qualification.save();
    } catch (error) {
        throw new Error("Error al crear la calificación: " + error.message);
    }
}

// Función asincrónica para listar todas las calificaciones
async function listQualifications() {
    try {
        return await Qualification.find();
    } catch (error) {
        throw new Error("Error al listar las calificaciones: " + error.message);
    }
}

// Función asincrónica para actualizar una calificación
async function updateQualification(id, data) {
    try {
        let qualification = await Qualification.findById(id);

        if (!qualification) {
            throw new Error("Calificación no encontrada");
        }

        if (data.valoration) {
            qualification.valoration = data.valoration;
        }

        return await qualification.save();
    } catch (error) {
        throw new Error("Error al actualizar la calificación: " + error.message);
    }
}


// Función asincrónica para eliminar una calificación
async function deleteQualification(id) {
    try {
        const calificacion = await Qualification.findByIdAndDelete(id);
        if (!calificacion) {
            throw new Error('Calificación no encontrada');
        }
    } catch (err) {
        throw new Error('Error al eliminar la calificación: ' + err.message);
    }
}

module.exports = {
    Schema,
    createQualification,
    listQualifications,
    updateQualification,
    deleteQualification
};
