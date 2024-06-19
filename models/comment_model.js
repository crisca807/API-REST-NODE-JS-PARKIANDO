const mongoose = require('mongoose');

// Define schema for Comment model
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
});

// Create Comment model based on the defined schema
const Comment = mongoose.model('Comment', commentSchema);

// Export Comment model for use in other parts of the application
module.exports = Comment;
