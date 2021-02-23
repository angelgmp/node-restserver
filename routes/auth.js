const { Router } = require( 'express' );
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { login, googleSignIn } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

//Para la autenticación de Google
router.post('/google', [
    check('id_token', 'El id_token es de rigoleto').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;