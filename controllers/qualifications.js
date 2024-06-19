const express = require('express');
const router = express.Router();
const logic = require('../logic/qualification_logic');

// Endpoint GET para listar todas las calificaciones
router.get('/', async (req, res) => {
    try {
        const qualifications = await logic.listQualifications();
        res.json(qualifications);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Endpoint POST para crear una nueva calificación
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const { error, value } = logic.Schema.validate(body);

        if (!error) {
            const qualification = await logic.createQualification(body);
            res.status(201).json({ qualification });
        } else {
            res.status(400).json({ error: error.details[0].message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint PUT para actualizar los datos de una calificación
router.put('/:id', async (req, res) => {
    try {
        const { error, value } = logic.Schema.validate(req.body);

        if (!error) {
            const updatedQualification = await logic.updateQualification(req.params.id, req.body);
            res.json({ updatedQualification });
        } else {
            res.status(400).json({ error: error.details[0].message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint DELETE para eliminar una calificación
router.delete('/:id', async (req, res) => {
    try {
        await logic.deleteQualification(req.params.id);
        res.json({ message: "Calificación eliminada correctamente" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
