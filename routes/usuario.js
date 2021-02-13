// desestructuramos lo que viene de express
// sacamos una funcion que se llama Router
const { Router } = require( 'express' );

const { check } = require('express-validator');

const { usuarioGet,
        usuarioPost,
        usuarioPut,
        usuarioDelete,
        usuarioPatch 
} = require('../controllers/usuario');

const { validarCampos } = require('../middlewares/validar-campos');

const { esRoleValido, emailExiste, existeUsuarioXId } = require('../helpers/db-validaciones');

//Llamamos esa función que sacamos
const router = Router();

/* 
router.get('/', (req, res) => {
    res.json( {
        msg: 'get API'
  });
});

router.put('/', (req, res) => {
    res.json( {
        msg: 'put API'
  });
});

router.post('/', (req, res) => {
    res.json( {
        msg: 'post API'
  });
});

router.delete('/', (req, res) => {
    res.json( {
        msg: 'delete API'
  });
});

router.patch('/', (req, res) => {
    //Manda un estatus 501
    res.status(501).json( {
        msg: 'patch API'
  });
}); */

//No se est´ejecutando usuarioGet, solo se está pasando la referencia
//cuando se llame router.get, req y resp pasan a usuarioGet
router.get('/', usuarioGet);

//Definomos un middleware para que primero realice las validaciones
//y si todo està bien, entonces ahora si llamamos a la ruta
//si el middleware falla, ya no siquiera se llama a la ruta
//El middleware se pone como segundo argumento
router.post('/', [
  check('nombre', 'El nombre es obligatoriosX').not().isEmpty(),
  check('password', 'El password es obligatoriosX y más de 6 letras').isLength( {min: 6} ),
  check('correo', 'El correo no es válido').isEmail(),

  check('correo').custom( emailExiste ),
  
  //Así sería la validación si los valores ADMIN_ROLE, etc estuvieran en duro, como aquí
  //check('rol', 'No es un rol válido').isIn( ['ADMIN_ROLE', 'USER_ROLE']),

  //Así queda si la validación es consultando la BD
  //El custom recibe como argumento el valor que estoy evaluando
  //le asignamos por defecto un valor de string vacío
  /* check( 'rol' ).custom( async( rol = '' ) => {
    const existeRol = await Role.findOne( { rol });

    if( !existeRol ) {
      throw new Error(`El rol ${ rol } no existe en la BD` );
    } 
  }),
  */

  //Así, funciona, pero por eso que cuando se tiene un callback o funcón o algo así
  //que recibe un argumento, que es el mismo que se le pasa a la función
  //puede obviarse
  //check( 'rol' ).custom( (rol) => esRoleValido(rol) ),
  check( 'rol' ).custom( esRoleValido ),


  //check( 'rol' ).custom( esRoleValido ),

  //Si todas las validaciones check pasan, validarCampos verifica los errores, si pasa, sigue con el controlador
  validarCampos
], usuarioPost); 

//para cachar el valor que quiero que venga despues de la ruta (parametros de segmento)
//así es para cuando mando varios parámetros en la url
//router.put('/:id/:altura', usuarioPut);

//Verificamos que el id sea uno válido de mongoDb
router.put('/:id', [
  check('id', 'No es un Id válido').isMongoId(),

  //validamos que el id de la url exista en la bd
  check('id').custom( existeUsuarioXId ),

  check( 'rol' ).custom( esRoleValido ),
  validarCampos
], usuarioPut);

router.delete('/:id', [
  check('id', 'No es un Id válido').isMongoId(),
  check('id').custom( existeUsuarioXId ),
  validarCampos
], usuarioDelete);

router.patch('/', usuarioPatch);




module.exports = router;