// desestructuramos lo que viene de express
// sacamos una funcion que se llama Router
const { Router } = require( 'express' );
const { usuarioGet,
        usuarioPost,
        usuarioPut,
        usuarioDelete,
        usuarioPatch 
} = require('../controllers/usuario');

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
router.post('/', usuarioPost);

//para cachar el valor que quiero que venga despues de la ruta (parametros de segmento)
router.put('/:id/:altura', usuarioPut);
router.delete('/', usuarioDelete);
router.patch('/', usuarioPatch);




module.exports = router;