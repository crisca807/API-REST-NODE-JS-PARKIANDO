const express = require('express');
const router = express.Router();
const commentLogic = require('../logic/comment_logic');
const { Schema } = require('../logic/comment_logic');
const mongoose = require('mongoose');
 // Importa el Schema de validación si es necesario

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

// POST endpoint para crear un nuevo comentario
router.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = Schema.validate(body);

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

router.get('/email/:email', (req, res) => {
    const email = req.params.email;

    commentLogic.getCommentByEmail(email)
        .then(comments => {
            if (comments.length > 0) {
                res.json(comments);
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});
// PUT endpoint para actualizar un comentario por su ID
router.put('/:id', (req, res) => {
    const { error, value } = commentLogic.Schema.validate(req.body); // Asegúrate de utilizar commentLogic.Schema

    if (!error) {
        // Solo envía los campos que se desean actualizar
        const { parking, valoration, comment } = req.body;

        commentLogic.updateComment(req.params.id, { parking, valoration, comment })
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


// PUT endpoint para actualizar un comentario por su Email
router.put('/email/:email', (req, res) => {
    const { error, value } = Schema.validate(req.body);

    if (!error) {
        commentLogic.updateCommentByEmail(req.params.email, req.body)
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
router.delete('/id/:id', (req, res) => {
    const commentId = req.params.id;

    // Validar que commentId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ error: 'Invalid comment ID' });
    }

    commentLogic.deleteComment(commentId)
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

// DELETE endpoint para eliminar un comentario por su Email
router.delete('/email/:email', (req, res) => {
    commentLogic.deleteCommentByEmail(req.params.email)
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
