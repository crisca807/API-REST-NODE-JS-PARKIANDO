const assert = require('assert');
const mongoose = require('mongoose');
const { createUser, authenticateUser } = require('../../controllers/user');
const { createReservation, listReservations } = require('../../controllers/reservations');
const User = require('../../models/user_model');

describe('Integration Tests', function () {
    // Conectar a la base de datos antes de las pruebas
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    // Desconectar la base de datos después de las pruebas
    afterAll(async () => {
        await mongoose.disconnect();
    });

    // Limpiar colecciones después de cada prueba
    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should create a user and make a reservation', async () => {
        // Crear un usuario de ejemplo
        const userData = {
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
            userType: 'client'
        };

        // Crear un usuario usando la función de controlador
        const createdUser = await createUser(userData);

        // Verificar que el usuario se haya creado correctamente
        assert.ok(createdUser._id);

        // Autenticar al usuario para obtener el token de autenticación
        const authResult = await authenticateUser(userData.email, userData.password);

        // Verificar que la autenticación sea exitosa
        assert.strictEqual(authResult.message, 'success');

        // Datos de la reserva de ejemplo
        const reservationData = {
            parkingLotId: 1,
            startDate: new Date(),
            startTime: '10:00 AM',
            duration: 120, // Duración en minutos
            plate: 'ABC123',
            vehicleType: 'car'
        };

        // Crear una reserva vinculada al usuario autenticado
        const createdReservation = await createReservation(reservationData);

        // Verificar que la reserva se haya creado correctamente
        assert.ok(createdReservation._id);

        // Listar todas las reservas para el usuario
        const reservations = await listReservations();

        // Verificar que la lista de reservas no esté vacía y contenga la reserva creada
        assert.ok(reservations.length > 0);
        const reservationExists = reservations.some(res => res._id.toString() === createdReservation._id.toString());
        assert.strictEqual(reservationExists, true);
    });
});
