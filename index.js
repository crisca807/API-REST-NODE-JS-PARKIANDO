const express = require('express');
const mongoose = require('mongoose');



const usuarios = require('./controllers/usuarios');
const reservas = require('./controllers/reservas');
const establecimientos = require('./controllers/establecimientos');
const comentarios = require('./controllers/comentarios');
const calificaciones = require('./controllers/calificaciones');

const app = express();

// Middleware para conectar a la base de datos MongoDB
mongoose.connect('mongodb+srv://crisca807:solomillos@cluster0.rqfwsbc.mongodb.net/')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('No se pudo conectar con MongoDB...', err));

// Middleware para el manejo de solicitudes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir la documentación de Swagger


// Endpoints (recursos)
app.use('/api/usuarios', usuarios);
app.use('/api/reservas', reservas);
app.use('/api/establecimientos', establecimientos);
app.use('/api/comentarios', comentarios);
app.use('/api/calificaciones', calificaciones);

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
