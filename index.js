const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importamos CORS

const users = require('./controllers/user');
const reservations = require('./controllers/reservations');
const establishments = require('./controllers/establishments');
const comments = require('./controllers/comments');
const qualifications = require('./controllers/qualifications');

const app = express();

// Middleware para conectar a la base de datos MongoDB
mongoose.connect('mongodb+srv://crisca807:PARKIANDO@apiparkiandorest1.uzojh3u.mongodb.net/')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('No se pudo conectar con MongoDB...', err));

// Middleware para el manejo de solicitudes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS para permitir peticiones desde localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Endpoint /ping para verificar la conexión con el frontend
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Conexión establecida con el frontend' });
});

// Endpoints de la API
app.use('/api/user', users);
app.use('/api/reservations', reservations);
app.use('/api/establishments', establishments);
app.use('/api/comments', comments);
app.use('/api/qualifications', qualifications);

// Puerto de escucha
const port = process.env.PORT || 3004;
app.listen(port, () => {
    console.log('API REST en funcionamiento en el puerto:', port);
});
