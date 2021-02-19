
const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

//Operador spred (...)
//Con el operador resto (...) exporto todo lo que exportan
//los archivos de arriba (funciones, variables, etc)
//de las funciones
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}
