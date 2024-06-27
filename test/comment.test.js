const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const commentLogic = require('../logic/comment_logic');
const Comment = require('../models/comment_model');

describe('Comments Logic', () => {
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
        await Comment.deleteMany({});
    });

    describe('Schema Validation', () => {
        test('Valid schema should pass validation', async () => {
            const validComment = {
                parking: 'Parking Lot A',
                valoration: 4,
                comment: 'Great experience!'
            };

            await expect(commentLogic.Schema.validateAsync(validComment)).resolves.toBeTruthy();
        });

        test('Invalid schema should throw error', async () => {
            const invalidComment = {
                parking: 'Parking Lot A',
                valoration: 'not a number',
                comment: 'Invalid comment'
            };

            await expect(commentLogic.Schema.validateAsync(invalidComment)).rejects.toThrow();
        });
    });

    describe('CRUD Operations', () => {
        test('Create new comment', async () => {
            const newComment = {
                parking: 'Parking Lot B',
                valoration: 5,
                comment: 'Excellent service!'
            };

            const created = await commentLogic.createComment(newComment);
            expect(created.parking).toBe(newComment.parking);
        });

        test('List all comments', async () => {
            const comments = await commentLogic.listComments();
            expect(comments).toHaveLength(0);

            await commentLogic.createComment({
                parking: 'Parking Lot C',
                valoration: 3,
                comment: 'Could improve signage.'
            });

            await commentLogic.createComment({
                parking: 'Parking Lot D',
                valoration: 4,
                comment: 'Good location.'
            });

            const updatedComments = await commentLogic.listComments();
            expect(updatedComments).toHaveLength(2);
        });

        test('Update comment', async () => {
            const commentToUpdate = await commentLogic.createComment({
                parking: 'Parking Lot E',
                valoration: 2,
                comment: 'Not satisfied with cleanliness.'
            });
        
            const updatedData = {
                comment: 'Not satisfied with cleanliness.'
            };
        
            const updatedComment = await commentLogic.updateComment(commentToUpdate._id, updatedData);
            expect(updatedComment.comment).toBe(updatedData.comment);
        });
        

        test('Delete comment', async () => {
            const commentToDelete = await commentLogic.createComment({
                parking: 'Parking Lot F',
                valoration: 4,
                comment: 'Spacious parking area.'
            });

            const deletedComment = await commentLogic.deleteComment(commentToDelete._id);
            expect(deletedComment).toBeTruthy();

            const checkDeleted = await Comment.findById(commentToDelete._id);
            expect(checkDeleted).toBeNull();
        });
    });
});
