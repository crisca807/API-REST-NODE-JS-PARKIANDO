const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/user'); // Ruta correcta de tu controlador
const userLogic = require('../logic/user_logic'); // Ruta correcta de tu lógica

// Configura la aplicación de Express
const app = express();
app.use(bodyParser.json());
app.use('/api/users', userController);

// Mockea los módulos del modelo para evitar llamadas reales a la base de datos durante las pruebas
jest.mock('../logic/user_logic');

describe('User Controller', () => {

    // Prueba para verificar si un usuario existe
    it('should check if a user exists', async () => {
        userLogic.checkUserExists.mockResolvedValue(true);
        
        const res = await request(app)
            .post('/api/users/check-account')
            .send({ email: 'test@example.com' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.userExists).toBe(true);
    });

    // Prueba para autenticar un usuario
    it('should authenticate a user', async () => {
        userLogic.authenticateUser.mockResolvedValue({
            userType: 'client',
            name: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            error: null
        });

        const res = await request(app)
            .post('/api/users/auth')
            .send({ email: 'john@example.com', password: 'password' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('success');
        expect(res.body.user.name).toBe('John');
    });

    // Prueba para obtener todos los usuarios activos
    it('should get all active users', async () => {
        userLogic.listActiveUsers.mockResolvedValue([{ name: 'John', lastName: 'Doe', email: 'john@example.com' }]);

        const res = await request(app).get('/api/users');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('John');
    });

    // Prueba para desactivar un usuario
    it('should deactivate a user', async () => {
        userLogic.deactivateUser.mockResolvedValue({
            name: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            userType: 'client',
            estado: false
        });

        const res = await request(app)
            .delete('/api/users/john@example.com');

        expect(res.statusCode).toEqual(200);
        expect(res.body.user.estado).toBe(false);
    });

    // Prueba para restablecer la contraseña de un usuario
    it('should reset user password', async () => {
        userLogic.resetUserPassword.mockResolvedValue(true);

        const res = await request(app)
            .post('/api/users/reset-password')
            .send({ email: 'john@example.com', newPassword: 'newpassword' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Contraseña restablecida exitosamente');
    });
});
