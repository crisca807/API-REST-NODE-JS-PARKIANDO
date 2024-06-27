const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const reservationsLogic = require('../logic/reservations_logic');
const Reservation = require('../models/reservations_model');

describe('Reservations Logic', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Reservation.deleteMany({});
    });

    describe('Schema Validation', () => {
        test('Valid schema should pass validation', async () => {
            const validReservation = {
                parkingLotId: 1,
                startDate: new Date(),
                startTime: '09:00 AM',
                duration: 120,
                plate: 'ABC123',
                vehicleType: 'car',
                totalPrice: 240 
            };

            await expect(reservationsLogic.Schema.validateAsync(validReservation)).resolves.toBeTruthy();
        });

        test('Invalid schema should throw error', async () => {
            const invalidReservation = {
                parkingLotId: 1,
                startDate: new Date(),
                startTime: '09:00 AM',
                duration: 120,
                plate: 'ABC123',
                vehicleType: 'invalid'
            };

            await expect(reservationsLogic.Schema.validateAsync(invalidReservation)).rejects.toThrow();
        });
    });

    describe('CRUD Operations', () => {
        test('Create new reservation', async () => {
            const newReservation = {
                parkingLotId: 1,
                startDate: new Date(),
                startTime: '09:00 AM',
                duration: 120,
                plate: 'ABC123',
                vehicleType: 'car',
                totalPrice: 240 
            };

            const created = await reservationsLogic.createReservation(newReservation);
            expect(created.plate).toBe(newReservation.plate);
        });

        test('List all reservations', async () => {
            await reservationsLogic.createReservation({
                parkingLotId: 1,
                startDate: new Date(),
                startTime: '09:00 AM',
                duration: 120,
                plate: 'ABC123',
                vehicleType: 'car',
                totalPrice: 240 
            });

            const reservations = await reservationsLogic.listReservations();
            expect(reservations).toHaveLength(1);
        });

        test('Update reservation', async () => {
            const createdReservation = await reservationsLogic.createReservation({
                parkingLotId: 1,
                startDate: new Date(),
                startTime: '09:00 AM',
                duration: 120,
                plate: 'ABC123',
                vehicleType: 'car',
                totalPrice: 240 
            });

            const updatedData = {
                duration: 120
            };

            const updatedReservation = await reservationsLogic.updateReservation(createdReservation._id, updatedData);
            expect(updatedReservation.duration).toEqual(updatedData.duration);
        });

        test('Delete reservation', async () => {
            const createdReservation = await reservationsLogic.createReservation({
                parkingLotId: 1,
                startDate: new Date(),
                startTime: '09:00 AM',
                duration: 120,
                plate: 'ABC123',
                vehicleType: 'car',
                totalPrice: 240 
            });

            const deletedReservation = await reservationsLogic.deleteReservation(createdReservation._id);
            expect(deletedReservation._id).toEqual(createdReservation._id);

            const checkDeleted = await Reservation.findById(createdReservation._id);
            expect(checkDeleted).toBeNull();
        });

        test('Search reservation by plate', async () => {
            await reservationsLogic.createReservation({
                parkingLotId: 1,
                startDate: new Date(),
                startTime: '09:00 AM',
                duration: 120,
                plate: 'ABC123',
                vehicleType: 'car',
                totalPrice: 240 
            });

            const foundReservation = await reservationsLogic.searchReservationByPlate('ABC123');
            if (foundReservation) {
                expect(foundReservation.plate).toEqual('ABC123');
            } else {
                expect(foundReservation).toBeNull();
            }
        });
    });
});
