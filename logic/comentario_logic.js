const Comentario = require('../models/comentario_model');
const Joi = require('@hapi/joi');

// Validaciones para el objeto comentario
const Schema = Joi.object({
    texto: Joi.string()
        .required()
});

// Función asincrónica para crear un comentario
async function crearComentario(body) {
    try {
        // Validar los datos de entrada
        const value = await Schema.validateAsync(body);

        // Crear un nuevo comentario con los datos proporcionados
        const comentario = new Comentario(value);

        // Guardar el comentario en la base de datos
        return await comentario.save();
    } catch (error) {
        throw new Error("Error al crear el comentario: " + error.message);
    }
}

// Función asincrónica para listar todos los comentarios
async function listarComentarios() {
    try {
        // Encontrar y devolver todos los comentarios
        return await Comentario.find();
    } catch (error) {
        throw new Error("Error al listar comentarios: " + error.message);
    }
}

// Función asincrónica para actualizar un comentario
async function actualizarComentario(id, datos) {
    try {
        // Buscar el comentario por su ID
        let comentario = await Comentario.findById(id);

        // Verificar si el comentario existe
        if (!comentario) {
            throw new Error("Comentario no encontrado");
        }

        // Actualizar el texto del comentario con los nuevos datos
        if (datos.texto) {
            comentario.texto = datos.texto;
        }

        // Guardar los cambios en la base de datos
        return await comentario.save();
    } catch (error) {
        throw new Error("Error al actualizar el comentario: " + error.message);
    }
}

// Función asincrónica para eliminar un comentario
async function eliminarComentario(id) {
    try {
        // Buscar el comentario por su ID y eliminarlo
        return await Comentario.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error al eliminar el comentario: " + error.message);
    }
}

module.exports = {
    Schema,
    crearComentario,
    listarComentarios,
    actualizarComentario,
    eliminarComentario
};
