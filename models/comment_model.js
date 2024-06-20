const mongoose = require('mongoose');

// Define schema for Comment model
const commentSchema = new mongoose.Schema({
    parking: {
        type: String,
        required: true
    },
    valoration: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
});

// Create Comment model based on the defined schema
const Comment = mongoose.model('Comment', commentSchema);

// Export Comment model for use in other parts of the application
module.exports = Comment;
