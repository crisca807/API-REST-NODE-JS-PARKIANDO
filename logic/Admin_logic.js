const User = require('../models/Admin_model');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

// Validation schema for user object
const Schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    lastName: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu', 'co'] } })
        .required(),

    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),

    address: Joi.string()
        .min(3)
        .max(30)
        .required(),

    userType: Joi.string()
        .valid('admin', 'client') // Permitir solo 'admin' y 'client'
        .required()
});

// Async function to create a user
async function createUser(body) {
    try {
        const value = await Schema.validateAsync(body);
        const hashedPassword = await bcrypt.hash(value.password, 10); // Encripta la contraseña
        value.password = hashedPassword;
        const user = new User(value);
        return await user.save();
    } catch (error) {
        throw new Error("Error creating user: " + error.message);
    }
}

// Async function to deactivate a user
async function deactivateUser(email) {
    try {
        return await User.findOneAndUpdate({ email: email }, { estado: false }, { new: true });
    } catch (error) {
        throw new Error("Error deactivating user: " + error.message);
    }
}

// Async function to list all active users
async function listActiveUsers() {
    try {
        return await User.find({ estado: true });
    } catch (error) {
        throw new Error("Error listing active users: " + error.message);
    }
}

// Async function to update user data
async function updateUser(email, data) {
    try {
        let user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("User not found");
        }

        if (data.name) {
            user.name = data.name;
        }
        if (data.lastName) {
            user.lastName = data.lastName;
        }
        if (data.password) {
            user.password = await bcrypt.hash(data.password, 10); // Encripta la nueva contraseña
        }
        if (data.email) {
            user.email = data.email;
        }
        if (data.address) {
            user.address = data.address;
        }

        return await user.save();
    } catch (error) {
        throw new Error("Error updating user: " + error.message);
    }
}

// Async function to check if a user exists
async function checkUserExists(email) {
    try {
        const user = await User.findOne({ email });
        return user ? true : false;
    } catch (error) {
        throw new Error("Error checking user: " + error.message);
    }
}

// Async function to authenticate a user
async function authenticateUser(email, password) {
    try {
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            return "generated_authentication_token"; // Placeholder, implement actual token generation
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("Error authenticating user: " + error.message);
    }
}

// Async function to reset user password
async function resetUserPassword(email, newPassword) {
    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario
        user.password = hashedPassword;
        await user.save();

        return true; // Indicar que la contraseña se ha restablecido correctamente
    } catch (error) {
        throw new Error('Error restableciendo contraseña del usuario: ' + error.message);
    }
}

module.exports = {
    Schema,
    createUser,
    updateUser,
    deactivateUser,
    listActiveUsers,
    checkUserExists,
    authenticateUser,
    resetUserPassword
};
