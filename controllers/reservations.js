const express = require('express');
const router = express.Router();
const reservationLogic = require('../logic/reservations_logic');

// GET endpoint to list all reservations
router.get('/', (req, res) => {
    reservationLogic.listReservations()
        .then(reservations => {
            res.json(reservations);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// POST endpoint to create a new reservation
router.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = reservationLogic.Schema.validate(body);

    if (!error) {
        reservationLogic.createReservation(body)
            .then(reservation => {
                res.json({ value: reservation });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// PUT endpoint to update reservation data by ID
router.put('/:id', (req, res) => {
    const { error, value } = reservationLogic.Schema.validate(req.body);

    if (!error) {
        reservationLogic.updateReservation(req.params.id, req.body)
            .then(value => {
                res.json({ value });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// DELETE endpoint to delete a reservation by ID
router.delete('/:id', (req, res) => {
    reservationLogic.deleteReservation(req.params.id)
        .then(value => {
            res.json({ reservation: value });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// GET endpoint to search for a reservation by plate
router.get('/search', (req, res) => {
    const plate = req.query.plate;

    if (!plate) {
        res.status(400).json({ error: "Parameter 'plate' is required" });
    } else {
        reservationLogic.searchReservationByPlate(plate)
            .then(reservation => {
                res.json({ reservation });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    }
});

module.exports = router;
