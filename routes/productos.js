const { Router } = require( 'express' );
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');

const { existeCategoriaXId, existeProductoXId, productoExiste } = require('../helpers/db-validaciones');

const router = Router();

/*
    {{url}}/apii/producgos
*/
//Obtener todas los productos -es público
router.get('/', obtenerProductos );

//Obtener 1 producto por id -es público
router.get('/:id', [
    check('id', 'No es un id válido de Mongo -desde routes/productos.js').isMongoId(),
    check('id').custom( existeProductoXId ),
    validarCampos,
], obtenerProducto);

//Crear producto -es privado -cualquier persona con un token válido
//Por si necesitamos utilizar varios middleware, se colocan entre []
//validarJWT, valida que haya token en la petición, etc
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio -desde check').not().isEmpty(),
    check('categoria', 'No es un id válido de Mongo -desde routes/productos.js').isMongoId(),
    check('categoria').custom( existeCategoriaXId ),
    check('nombre').custom( productoExiste ),
    validarCampos
 ], crearProducto);

//Actualizar 1 producto por id -es privado - cualquira con token válido
router.put('/:id', [
    validarJWT,
    check('categoria', 'No es un id válido de Mongo -desde routes/productos.js').isMongoId(),
    check('id').custom( existeProductoXId ),
    validarCampos
], actualizarProducto);

//Borrar 1 categoría por id -es privado -Solo admin lo puede hacer
//Entre los corchetes van los middlewares
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un id válido de Mongo -desde routes/categoria.js').isMongoId(),
    check('id').custom( existeProductoXId ),
    validarCampos
], borrarProducto);


module.exports = router;