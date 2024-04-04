const Calificacion = require('../models/calificacion_model');
const Joi = require('@hapi/joi');

// Validaciones para el objeto calificación
const Schema = Joi.object({
    valoracion: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
});

// Función asincrónica para crear una calificación
async function crearCalificacion(body) {
    try {
        // Validar los datos de entrada
        const value = await Schema.validateAsync(body);

        // Crear una nueva calificación con los datos proporcionados
        const calificacion = new Calificacion(value);

        // Guardar la calificación en la base de datos
        return await calificacion.save();
    } catch (error) {
        throw new Error("Error al crear la calificación: " + error.message);
    }
}

// Función asincrónica para listar todas las calificaciones
async function listarCalificaciones() {
    try {
        // Encontrar y devolver todas las calificaciones
        return await Calificacion.find();
    } catch (error) {
        throw new Error("Error al listar calificaciones: " + error.message);
    }
}

// Función asincrónica para actualizar una calificación
async function actualizarCalificacion(id, datos) {
    try {
        // Buscar la calificación por su ID
        let calificacion = await Calificacion.findById(id);

        // Verificar si la calificación existe
        if (!calificacion) {
            throw new Error("Calificación no encontrada");
        }

        // Actualizar los campos de la calificación con los nuevos datos
        if (datos.valoracion) {
            calificacion.valoracion = datos.valoracion;
        }

        // Guardar los cambios en la base de datos
        return await calificacion.save();
    } catch (error) {
        throw new Error("Error al actualizar la calificación: " + error.message);
    }
}

// Función asincrónica para eliminar una calificación
async function eliminarCalificacion(id) {
    try {
        // Buscar la calificación por su ID y eliminarla
        return await Calificacion.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error al eliminar la calificación: " + error.message);
    }
}

module.exports = {
    Schema,
    crearCalificacion,
    listarCalificaciones,
    actualizarCalificacion,
    eliminarCalificacion
};
