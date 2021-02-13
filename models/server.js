const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/apii/usuarios';

        //Conectar a bd
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    //Aquí se podría llamar a diferentes conexiones, si se tuvieran
    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        //Cors
        this.app.use( cors() );

        //lectura y parseo del body
        this.app.use( express.json() );

        //Directorio público
        this.app.use( express.static( 'public' ) );
    }

    routes() {
        /* this.app.get('/apii', (req, res) => {
            res.json( {
                msg: 'get API'
          });
        });

        this.app.put('/apii', (req, res) => {
            res.json( {
                msg: 'put API'
          });
        });

        this.app.post('/apii', (req, res) => {
            res.json( {
                msg: 'post API'
          });
        });

        this.app.delete('/apii', (req, res) => {
            res.json( {
                msg: 'delete API'
          });
        });

        this.app.patch('/apii', (req, res) => {
            //Manda un estatus 501
            res.status(501).json( {
                msg: 'patch API'
          });
        }); */

        this.app.use(this.usuariosPath, require('../routes/usuario'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto', this.port );
        });
    }
}

module.exports = Server;
