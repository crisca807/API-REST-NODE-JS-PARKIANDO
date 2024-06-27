// routes/establishments.js
const express = require('express');
const router = express.Router();
const establishmentLogic = require('../logic/establishments_logic');
const nodemailer = require('nodemailer');

// Endpoint GET para buscar un establecimiento por su nombre
router.get('/search/:name', (req, res) => {
    const establishmentName = req.params.name;

    establishmentLogic.searchByName(establishmentName)
        .then(establishment => {
            if (establishment) {
                res.json(establishment);
            } else {
                res.status(404).json({ error: "Establishment not found" });
            }
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Endpoint GET para listar todos los establecimientos
router.get('/', (req, res) => {
    establishmentLogic.listEstablishments()
        .then(establishments => {
            res.json(establishments);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Endpoint POST para crear un nuevo establecimiento
router.post('/', async (req, res) => {
    const body = req.body;

    try {
        // Validar el cuerpo de la solicitud
        const { error, value } = establishmentLogic.Schema.validate(body);

        if (error) {
            return res.status(400).json({ error });
        }

        // Crear el establecimiento y obtener el resultado
        const establishment = await establishmentLogic.createEstablishment(body);

        // Enviar correo electrónico con los datos del establecimiento creado
        await establishmentLogic.sendEmailToOwner(establishment);

        // Enviar una respuesta JSON con el establecimiento creado
        res.status(201).json({ establishment });
    } catch (error) {
        console.error('Error creating establishment:', error);
        res.status(500).json({ error: 'Error creating establishment' });
    }
});

// Endpoint PUT para actualizar datos de un establecimiento por su ID
router.put('/:id', (req, res) => {
    const establishmentId = req.params.id;
    const { error, value } = establishmentLogic.Schema.validate(req.body);

    if (!error) {
        establishmentLogic.updateEstablishment(establishmentId, req.body)
            .then(updatedEstablishment => {
                res.json({ value: updatedEstablishment });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// DELETE endpoint para desactivar un establecimiento por su ID
router.delete('/:id', (req, res) => {
    const establishmentId = req.params.id;

    establishmentLogic.deleteEstablishment(establishmentId)
        .then(deletedEstablishment => {
            if (deletedEstablishment) {
                res.json({ establishment: deletedEstablishment });
            } else {
                res.status(404).json({ error: "Establishment not found" });
            }
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

module.exports = router;
