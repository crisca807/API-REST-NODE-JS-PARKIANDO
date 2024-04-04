const express = require('express');
const ruta = express.Router();
const logic = require('../logic/usuario_logic');

// Endpoint para verificar si un usuario existe
ruta.post('/check-account', (req, res) => {
    let email = req.body.email;

    // Lógica para verificar si el usuario existe
    let resultado = logic.verificarUsuario(email);

    resultado.then(existe => {
        res.json({ userExists: existe });
    }).catch(err => {
        res.status(400).json({ error: err });
    });
});

// Endpoint para autenticar un usuario
ruta.post('/auth', (req, res) => {
    let { email, password } = req.body;

    // Lógica para autenticar al usuario
    let resultado = logic.autenticarUsuario(email, password);

    resultado.then(token => {
        res.json({ message: 'success', token: token });
    }).catch(err => {
        res.status(401).json({ message: 'failed', error: err });
    });
});


//endopoint de tipo GET  para el recurso usuarios.lista de todos los usuarios 

ruta.get('/',(req, res) => {
    let resultado = logic.listarUsuariosActivos();
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json(
            {
                err
            }
        )
    })
});

//endpoint de tipo POST para el recurso USUARIOS

ruta.post('/', (req, res) => {
    let body = req.body;

    const {error, value} =  logic.Schema.validate({nombre: body.nombre, email: body.email});
    if(!error){
        let resultado =  logic.crearUsuario(body);

        resultado.then( user => {
            res.json({
                valor: user
            })
        }).catch(err => {
            res.status(400).json({
                err
            })
        });
    }else{
        res.status(400).json({
            error
        })
    }
});

//endopoint de tipo PUT para actualizar los datos del usuario 

ruta.put('/:email', (req , res) => {
    const {error, value } = logic.Schema.validate({nombre: req.body.nombre});
    if(!error){
        let resultado =  logic.actualizarUsuario(req.params.email, req.body);
        resultado.then(valor => {
            res.json({
                valor
            })
        }).catch(err => {
            res.status(400).json({
                err
            })
        });

    }else{
        res.status(400).json({
            error
        })
    }

});
  
//Endpoint de tipo DELETE  para el recurso Usuarios

ruta.delete('/:email',(req, res) => {
    let resultado =  logic.desactivarUsuario(req.params.email);
    resultado.then(valor => {
        res.json({
            usuario: valor

        })
    }).catch(err => {
        res.status(400).json({
            err
        })
    });


});


module.exports = ruta;  