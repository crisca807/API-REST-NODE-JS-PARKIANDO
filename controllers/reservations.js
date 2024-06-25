const express = require('express');
const router = express.Router();
const reservationLogic = require('../logic/reservations_logic');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    const userType = req.user && req.user.userType;
    if (userType === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}

router.get('/', (req, res) => {
    reservationLogic.listReservations()
        .then(reservations => {
            res.json(reservations);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

router.post('/', async (req, res) => {
    const body = req.body;

    try {
        const reservation = await reservationLogic.createReservation(body);
        res.json({ reservation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', isAdmin, (req, res) => {
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

router.delete('/:id', isAdmin, (req, res) => {
    reservationLogic.deleteReservation(req.params.id)
        .then(value => {
            res.json({ reservation: value });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

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
