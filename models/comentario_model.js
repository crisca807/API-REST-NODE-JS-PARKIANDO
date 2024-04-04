
const mongoose = require('mongoose');

// Definición del esquema para el modelo Comentario
const comentarioSchema = new mongoose.Schema({
    texto: {
        type: String,
        required: true
    }
});

// Creación del modelo Comentario a partir del esquema definido
const Comentario = mongoose.model('Comentario', comentarioSchema);

// Exportación del modelo Comentario para su uso en otras partes de la aplicación
module.exports = Comentario;
