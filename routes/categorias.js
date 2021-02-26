const { Router } = require( 'express' );
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias');

const { existeCategoriaXId } = require('../helpers/db-validaciones');

const router = Router();

/*
    {{url}}/apii/categorias
*/
//Obtener todas las categorías -es público
router.get('/', obtenerCategorias );

//Obtener 1 categoría por id -es público
/* router.get('/:id', ( req, res ) => {
    res.json('get -id');
}); */

router.get('/:id', [
    check('id', 'No es un id válido de Mongo -desde routes/categorias.js').isMongoId(),
    check('id').custom( existeCategoriaXId ),
    validarCampos
], obtenerCategoria);

//Crear categoría -es privado -cualquier persona con un token válido
//Por si necesitamos utilizar varios middleware, se colocan entre []
//validarJWT, valida que haya token en la petición, etc
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio -desde check').not().isEmpty(),
    validarCampos
 ], crearCategoria);

//Actualizar 1 categoría por id -es privado - cualquira con token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio -desde check').not().isEmpty(),
    check('id').custom( existeCategoriaXId ),
    validarCampos
], actualizarCategoria);

//Borrar 1 categoría por id -es privado -Solo admin lo puede hacer
//Entre los corchetes van los middlewares
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un id válido de Mongo -desde routes/categoria.js').isMongoId(),
    check('id').custom( existeCategoriaXId ),
    validarCampos
], borrarCategoria);


module.exports = router;