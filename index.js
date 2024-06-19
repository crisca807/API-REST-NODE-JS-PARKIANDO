const express = require('express');
const mongoose = require('mongoose');



const users = require('./controllers/User');
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

// Middleware para servir la documentación de Swagger


// Endpoints de la API
app.use('/api/user', users);
app.use('/api/reservations', reservations);
app.use('/api/establishments', establishments);
app.use('/api/comments', comments);
app.use('/api/qualifications', qualifications);

const cors = require('cors'); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  

// Puerto de escucha
const port = process.env.PORT || 3004;
app.listen(port, () => {
    console.log('API REST en funcionamiento en el puerto:', port);
});