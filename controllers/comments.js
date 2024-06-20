const express = require('express');
const router = express.Router();
const commentLogic = require('../logic/comment_logic');

// GET endpoint para listar todos los comentarios
router.get('/', (req, res) => {
    commentLogic.listComments()
        .then(comments => {
            res.json(comments);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

// POST endpoint to create a new comment
router.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = commentLogic.Schema.validate(body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    commentLogic.createComment(body)
        .then(comment => {
            res.status(201).json({ comment });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

// PUT endpoint para actualizar un comentario por su ID
router.put('/:id', (req, res) => {
    const { error, value } = commentLogic.commentSchema.validate(req.body); // Asegúrate de utilizar commentSchema aquí

    if (!error) {
        commentLogic.updateComment(req.params.id, req.body)
            .then(comment => {
                if (comment) {
                    res.json({ comment });
                } else {
                    res.status(404).json({ error: 'Comment not found' });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error: error.details[0].message });
    }
});

// DELETE endpoint para eliminar un comentario por su ID
router.delete('/:id', (req, res) => {
    commentLogic.deleteComment(req.params.id)
        .then(result => {
            if (result.deletedCount > 0) {
                res.json({ message: "Comment deleted successfully" });
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

module.exports = router;
