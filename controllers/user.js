const express = require('express');
const router = express.Router();
const logic = require('../logic/user_logic');

// Endpoint to check if a user exists
router.post('/check-account', (req, res) => {
    let email = req.body.email;

    // Logic to check if the user exists
    let result = logic.checkUserExists(email);

    result.then(exists => {
        res.json({ userExists: exists });
    }).catch(err => {
        res.status(400).json({ error: err.message });
    });
});

// Endpoint to authenticate a user
router.post('/auth', (req, res) => {
    let { email, password } = req.body;

    // Logic to authenticate the user
    let result = logic.authenticateUser(email, password);

    result.then(token => {
        if (token) {
            res.json({ message: 'success', token: token });
        } else {
            res.status(401).json({ message: 'failed', error: 'Invalid email or password' });
        }
    }).catch(err => {
        res.status(401).json({ message: 'failed', error: err.message });
    });
});

// GET endpoint for the resource users, list all users
router.get('/', async (req, res) => {
    try {
        const users = await logic.listActiveUsers();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST endpoint for the resource USERS
router.post('/', (req, res) => {
    let body = req.body;

    const { error, value } = logic.Schema.validate({
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        userType: body.userType
    });

    if (error) {
        return res.status(400).json({ error: error.details });
    }

    // Verifica que el valor de userType sea válido
    if (!['admin', 'client'].includes(body.userType)) {
        return res.status(400).json({ error: `"${body.userType}" is not a valid value for 'userType'` });
    }

    logic.createUser(body)
        .then(user => {
            res.json({ user });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// PUT endpoint to update user data
router.put('/:email', async (req, res) => {
    try {
        const { error } = logic.Schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const result = await logic.updateUser(req.params.email, req.body);
        res.json({ user: result }); // Devuelve el usuario actualizado
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE endpoint for the resource Users
router.delete('/:email', (req, res) => {
    let result = logic.deactivateUser(req.params.email);
    result.then(value => {
        res.json({ user: value });
    }).catch(err => {
        res.status(400).json({ err });
    });
});

module.exports = router;
