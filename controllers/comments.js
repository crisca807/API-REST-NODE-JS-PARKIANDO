const express = require('express');
const router = express.Router();
const commentLogic = require('../logic/comment_logic');

// GET endpoint to list all comments
router.get('/', (req, res) => {
    commentLogic.listComments()
        .then(comments => {
            res.json(comments);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// POST endpoint to create a new comment
router.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = commentLogic.Schema.validate(body);

    if (!error) {
        commentLogic.createComment(body)
            .then(comment => {
                res.json({ comment });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// PUT endpoint to update a comment by its ID
router.put('/:id', (req, res) => {
    const { error, value } = commentLogic.Schema.validate(req.body);

    if (!error) {
        commentLogic.updateComment(req.params.id, req.body)
            .then(comment => {
                res.json({ comment });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// DELETE endpoint to delete a comment by its ID
router.delete('/:id', (req, res) => {
    commentLogic.deleteComment(req.params.id)
        .then(() => {
            res.json({ message: "Comment deleted successfully" });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

module.exports = router;
