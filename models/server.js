const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        /* 
        this.usuariosPath = '/apii/usuarios';
        this.authPath = '/apii/auth';
 */
        //Ponerlos en orden alfabético
        this.paths = {
            auth:       '/apii/auth',
            busquedas:  '/apii/busquedas',
            categorias: '/apii/categorias',
            productos:  '/apii/productos',
            uploads:    '/apii/uploads',
            usuarios:   '/apii/usuarios',
        }
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

        //Para manejar los uploads
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            //Para que cree las carpetas si no están creadas, en donde se almacenarán los archivos
            createParentPath: true
        }));
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

        /* 
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuario'));
     */

     //Haciendo la importación de los routes
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.busquedas, require('../routes/busquedas'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    this.app.use(this.paths.uploads, require('../routes/uploads'));
  
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto', this.port );
        });
    }
}

module.exports = Server;
