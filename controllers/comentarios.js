
const express = require('express');
const router = express.Router();
const logic = require('../logic/comentario_logic');

// Endpoint de tipo GET para listar todos los comentarios
router.get('/', (req, res) => {
    logic.listarComentarios()
        .then(comentarios => {
            res.json(comentarios);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Endpoint de tipo POST para crear un nuevo comentario
router.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = logic.Schema.validate(body);

    if (!error) {
        logic.crearComentario(body)
            .then(comentario => {
                res.json({ comentario });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// Endpoint de tipo PUT para actualizar los datos de un comentario
router.put('/:id', (req, res) => {
    const { error, value } = logic.Schema.validate(req.body);

    if (!error) {
        logic.actualizarComentario(req.params.id, req.body)
            .then(comentario => {
                res.json({ comentario });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});
  
// Endpoint de tipo DELETE para eliminar un comentario
router.delete('/:id', (req, res) => {
    logic.eliminarComentario(req.params.id)
        .then(() => {
            res.json({ mensaje: "Comentario eliminado correctamente" });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

module.exports = router;
