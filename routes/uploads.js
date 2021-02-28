const { Router } = require( 'express' );
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');

const { coleccionesPermitidas } = require('../helpers');

const router = Router();

//Una ruta es un EndPoint
router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),

    //En la función, la c es de la colección
    //Si necesitara más colecciones permitidas, solo necesito agregarlas aquí
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
//], actualizarImagen);
], actualizarImagenCloudinary);

//Para obtener la imagen
router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),

    //En la función, la c es de la colección
    //Si necesitara más colecciones permitidas, solo necesito agregarlas aquí
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);


module.exports = router;
