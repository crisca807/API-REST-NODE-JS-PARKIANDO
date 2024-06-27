const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const establishmentsLogic = require('../logic/establishments_logic');
const Establishment = require('../models/establishments_model');

describe('Establishments Logic', () => {
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
        await Establishment.deleteMany({});
    });

    describe('Schema Validation', () => {
        test('Valid schema should pass validation', async () => {
            const validEstablishment = {
                EstablishmentName: 'Example Establishment',
                Owner: 'John Doe',
                Address: '123 Main St',
                Capacity: 50,
                MotoPrice: 10,
                CarPrice: 20
            };

            await expect(establishmentsLogic.Schema.validateAsync(validEstablishment)).resolves.toBeTruthy();
        });

        test('Invalid schema should throw error', async () => {
            const invalidEstablishment = {
                EstablishmentName: 'Example Establishment',
                Owner: 'John Doe',
                Address: '123 Main St',
                Capacity: 50,
                MotoPrice: 'invalid',
                CarPrice: 20
            };

            await expect(establishmentsLogic.Schema.validateAsync(invalidEstablishment)).rejects.toThrow();
        });
    });

    describe('CRUD Operations', () => {
        test('Create new establishment', async () => {
            const newEstablishment = {
                EstablishmentName: 'Test Establishment',
                Owner: 'Jane Doe',
                Address: '456 Oak St',
                Capacity: 30,
                MotoPrice: 8,
                CarPrice: 15
            };

            const created = await establishmentsLogic.createEstablishment(newEstablishment);
            expect(created.EstablishmentName).toBe(newEstablishment.EstablishmentName);
        });

        test('List all establishments', async () => {
            const establishments = await establishmentsLogic.listEstablishments();
            expect(establishments).toHaveLength(0);

            await establishmentsLogic.createEstablishment({
                EstablishmentName: 'Test Establishment 1',
                Owner: 'John Doe',
                Address: '789 Elm St',
                Capacity: 40,
                MotoPrice: 12,
                CarPrice: 18
            });

            await establishmentsLogic.createEstablishment({
                EstablishmentName: 'Test Establishment 2',
                Owner: 'Jane Doe',
                Address: '101 Pine St',
                Capacity: 25,
                MotoPrice: 7,
                CarPrice: 14
            });

            const updatedEstablishments = await establishmentsLogic.listEstablishments();
            expect(updatedEstablishments).toHaveLength(2);
        });

        test('Update establishment', async () => {
            const establishmentToUpdate = await establishmentsLogic.createEstablishment({
                EstablishmentName: 'Test Update Establishment',
                Owner: 'John Doe',
                Address: '123 Elm St',
                Capacity: 30,
                MotoPrice: 8,
                CarPrice: 15
            });

            const updatedData = {
                Owner: 'Jane Doe',
                Address: '456 Oak St',
                Capacity: 40
            };

            const updatedEstablishment = await establishmentsLogic.updateEstablishment(establishmentToUpdate._id, updatedData);
            expect(updatedEstablishment.Owner).toBe(updatedData.Owner);
            expect(updatedEstablishment.Address).toBe(updatedData.Address);
            expect(updatedEstablishment.Capacity).toBe(updatedData.Capacity);
        });

        test('Delete establishment', async () => {
            const establishmentToDelete = await establishmentsLogic.createEstablishment({
                EstablishmentName: 'Test Delete Establishment',
                Owner: 'John Doe',
                Address: '123 Elm St',
                Capacity: 30,
                MotoPrice: 8,
                CarPrice: 15
            });

            const deletedEstablishment = await establishmentsLogic.deleteEstablishment(establishmentToDelete._id);
            expect(deletedEstablishment).toBeTruthy();

            const checkDeleted = await Establishment.findById(establishmentToDelete._id);
            expect(checkDeleted).toBeNull();
        });

        test('Search establishment by name', async () => {
            const establishmentToFind = await establishmentsLogic.createEstablishment({
                EstablishmentName: 'Search Test Establishment',
                Owner: 'John Doe',
                Address: '123 Elm St',
                Capacity: 30,
                MotoPrice: 8,
                CarPrice: 15
            });

            const foundEstablishment = await establishmentsLogic.searchByName('Search Test Establishment');
            expect(foundEstablishment).toBeDefined();
            expect(foundEstablishment.EstablishmentName).toBe('Search Test Establishment');
        });
    });
});
