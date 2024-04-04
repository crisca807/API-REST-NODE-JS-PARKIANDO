/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Operaciones sobre reservas
 */

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Obtiene todas las reservas.
 *     description: Retorna una lista de todas las reservas en la base de datos.
 *     responses:
 *       '200':
 *         description: OK. Retorna la lista de reservas.
 *       '400':
 *         description: Error en la solicitud del cliente.
 *
 *   post:
 *     summary: Crea una nueva reserva.
 *     description: Crea una nueva reserva con los datos proporcionados en el cuerpo de la solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tiempoReserva:
 *                 type: string
 *                 format: date-time
 *               placa:
 *                 type: string
 *                 maxLength: 15
 *               tipoVehiculo:
 *                 type: string
 *                 enum: [moto, carro]
 *             required:
 *               - tiempoReserva
 *               - placa
 *               - tipoVehiculo
 *     responses:
 *       '200':
 *         description: OK. Retorna la reserva creada.
 *       '400':
 *         description: Error en la solicitud del cliente.
 *
 * /api/reservas/{id}:
 *   put:
 *     summary: Actualiza una reserva existente.
 *     description: Actualiza los datos de una reserva existente identificada por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva que se va a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tiempoReserva:
 *                 type: string
 *                 format: date-time
 *               placa:
 *                 type: string
 *                 maxLength: 15
 *               tipoVehiculo:
 *                 type: string
 *                 enum: [moto, carro]
 *     responses:
 *       '200':
 *         description: OK. Retorna la reserva actualizada.
 *       '400':
 *         description: Error en la solicitud del cliente.
 *       '404':
 *         description: Reserva no encontrada.
 *
 *   delete:
 *     summary: Borra una reserva existente.
 *     description: Borra una reserva existente identificada por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva que se va a borrar.
 *     responses:
 *       '200':
 *         description: OK. Retorna la reserva borrada.
 *       '400':
 *         description: Error en la solicitud del cliente.
 *       '404':
 *         description: Reserva no encontrada.
 *
 * /api/reservas/buscar:
 *   get:
 *     summary: Busca una reserva por placa.
 *     description: Busca una reserva existente por su placa.
 *     parameters:
 *       - in: query
 *         name: placa
 *         required: true
 *         schema:
 *           type: string
 *         description: Placa del vehículo asociado a la reserva.
 *     responses:
 *       '200':
 *         description: OK. Retorna la reserva encontrada.
 *       '400':
 *         description: Error en la solicitud del cliente.
 *       '404':
 *         description: Reserva no encontrada.
 */


const express = require('express');
const router = express.Router();
const reservaLogic = require('../logic/reserva_logic');

// Endpoint de tipo GET para listar todas las reservas
router.get('/', (req, res) => {
    reservaLogic.listarReservas()
        .then(reservas => {
            res.json(reservas);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Endpoint de tipo POST para crear una nueva reserva
router.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = reservaLogic.Schema.validate(body);

    if (!error) {
        reservaLogic.crearReserva(body)
            .then(reserva => {
                res.json({ valor: reserva });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// Endpoint de tipo PUT para actualizar los datos de una reserva por su ID
router.put('/:id', (req, res) => {
    const { error, value } = reservaLogic.Schema.validate(req.body);

    if (!error) {
        reservaLogic.actualizarReserva(req.params.id, req.body)
            .then(valor => {
                res.json({ valor });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});
  
// Endpoint de tipo DELETE para borrar una reserva por su ID
router.delete('/:id', (req, res) => {
    reservaLogic.borrarReserva(req.params.id)
        .then(valor => {
            res.json({ reserva: valor });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Endpoint de tipo GET para buscar una reserva por placa
router.get('/buscar', (req, res) => {
    const placa = req.query.placa;

    if (!placa) {
        res.status(400).json({ error: "Se requiere el parámetro 'placa'" });
    } else {
        reservaLogic.buscarReservaPorPlaca(placa)
            .then(reserva => {
                res.json({ reserva });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    }
});

module.exports = router;
