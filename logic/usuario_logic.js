const Usuario = require('../models/usuario_model');
const Joi = require('@hapi/joi');

// Validaciones para el objeto usuario
const Schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(30)
        .required(),
    
    apellido: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu', 'co'] } })
        .required(),

    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),

    tipoUsuario: Joi.string()
        .valid('administrador', 'cliente')
        .required()
});

// Función asincrónica para crear un objeto de tipo de usuario 
async function crearUsuario(body) {
    try {
        // Validar los datos de entrada
        const value = await Schema.validateAsync(body);

        // Crear un nuevo usuario con los datos proporcionados
        const usuario = new Usuario(value);

        // Guardar el usuario en la base de datos
        return await usuario.save();
    } catch (error) {
        throw new Error("Error al crear el usuario: " + error.message);
    }
}

// Función asincrónica para inactivar un usuario 
async function desactivarUsuario(email) {
    try {
        // Buscar el usuario por su correo electrónico y actualizar su estado a false
        return await Usuario.findOneAndUpdate({ email: email }, { estado: false }, { new: true });
    } catch (error) {
        throw new Error("Error al desactivar el usuario: " + error.message);
    }
}

// Función asincrónica para listar todos los usuarios activos 
async function listarUsuariosActivos() {
    try {
        // Encontrar y devolver todos los usuarios con estado activo (true)
        return await Usuario.find({ estado: true });
    } catch (error) {
        throw new Error("Error al listar usuarios activos: " + error.message);
    }
}

// Función asincrónica para actualizar un usuario 
async function actualizarUsuario(email, datos) {
    try {
        // Buscar el usuario por su correo electrónico
        let usuario = await Usuario.findOne({ email: email });

        // Verificar si el usuario existe
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        // Actualizar los campos del usuario con los nuevos datos
        if (datos.nombre) {
            usuario.nombre = datos.nombre;
        }
        if (datos.apellido) {
            usuario.apellido = datos.apellido;
        }
        if (datos.password) {
            usuario.password = datos.password;
        }
        if (datos.email) {
            usuario.email = datos.email;
        }

        // Guardar los cambios en la base de datos
        return await usuario.save();
    } catch (error) {
        throw new Error("Error al actualizar el usuario: " + error.message);
    }
}

// Función asincrónica para verificar si un usuario existe
async function verificarUsuario(email) {
    try {
        // Buscar un usuario por su correo electrónico
        const usuario = await Usuario.findOne({ email });
        
        // Devolver true si el usuario existe, false si no
        return usuario ? true : false;
    } catch (error) {
        throw new Error("Error al verificar el usuario: " + error.message);
    }
}

// Función asincrónica para autenticar a un usuario
async function autenticarUsuario(email, password) {
    try {
        // Buscar un usuario por su correo electrónico y contraseña
        const usuario = await Usuario.findOne({ email, password });

        // Si el usuario existe, devolver un token de autenticación (podrías usar JWT)
        // Si no, devolver null
        if (usuario) {
            // Aquí podrías generar y devolver un token JWT para el usuario
            return "token_de_autenticacion_generado"; // Simplemente un placeholder, debes implementar la generación real del token
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("Error al autenticar el usuario: " + error.message);
    }
}

module.exports = {
    Schema,
    crearUsuario,
    actualizarUsuario,
    desactivarUsuario,
    listarUsuariosActivos,
    verificarUsuario,
    autenticarUsuario
};
