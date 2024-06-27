const Comment = require('../models/comment_model');
const Joi = require('@hapi/joi');

// Validation schema for Comment object
const Schema = Joi.object({
    parking: Joi.string().required(),
    valoration: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
    email: Joi.string().email().required() // Added email validation
});

// Asynchronous function to create a comment
async function createComment(body) {
    try {
        // Validate input data
        const value = await Schema.validateAsync(body);

        // Create a new comment with the provided data
        const comment = new Comment(value);

        // Save the comment to the database
        return await comment.save();
    } catch (error) {
        throw new Error("Error creating comment: " + error.message);
    }
}

// Asynchronous function to list all comments
async function listComments() {
    try {
        // Find and return all comments
        return await Comment.find();
    } catch (error) {
        throw new Error("Error listing comments: " + error.message);
    }
}

// Asynchronous function to update a comment
async function updateComment(id, data) {
    try {
        // Find the comment by its ID
        let comment = await Comment.findById(id);

        // Check if the comment exists
        if (!comment) {
            throw new Error("Comment not found");
        }

        // Update the comment fields with the new data
        if (data.parking) {
            comment.parking = data.parking;
        }
        if (data.valoration) {
            comment.valoration = data.valoration;
        }
        if (data.comment) {
            comment.comment = data.comment;
        }
        if (data.email) {
            comment.email = data.email;
        }

        // Save the changes to the database
        return await comment.save();
    } catch (error) {
        throw new Error("Error updating comment: " + error.message);
    }
}

// Asynchronous function to delete a comment
async function deleteComment(id) {
    try {
        // Find and delete the comment by its ID
        return await Comment.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error deleting comment: " + error.message);
    }
}
async function deleteCommentByEmail(email) {
    try {
        // Find and delete the comment by email
        return await Comment.deleteMany({ email: email });
    } catch (error) {
        throw new Error("Error deleting comment by email: " + error.message);
    }
}
async function updateCommentByEmail(email, data) {
    try {
        // Find the comment by email and update it
        let comment = await Comment.findOneAndUpdate({ email }, data, { new: true });

        // Check if the comment exists
        if (!comment) {
            throw new Error("Comment not found");
        }

        return comment;
    } catch (error) {
        throw new Error("Error updating comment: " + error.message);
    }
}

async function updateCommentByEmail(email, data) {
    try {
        // Find the comment by email and update it
        let comment = await Comment.findOneAndUpdate({ email }, data, { new: true });

        // Check if the comment exists
        if (!comment) {
            throw new Error("Comment not found");
        }

        return comment;
    } catch (error) {
        throw new Error("Error updating comment: " + error.message);
    }
}

async function getCommentByEmail(email) {
    try {
        // Find comments by email
        return await Comment.find({ email: email });
    } catch (error) {
        throw new Error("Error getting comments by email: " + error.message);
    }
}



module.exports = {
    Schema,
    createComment,
    listComments,
    updateComment,
    deleteComment,
    deleteCommentByEmail,
    updateCommentByEmail,
    getCommentByEmail

};
