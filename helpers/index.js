
const dbValidaciones = require('./db-validaciones');
const generarJWT     = require('./generar-jwt');
const googleVerifica = require('./google-verify');
const subirArchivo   = require('./subir-archivo');


//Exporto todo esto, pero esparciendo todo su contenido,
//si alguno exporta una variable o una función, etc. tendré todo su contenido
module.exports = {
    ...dbValidaciones,
    ...generarJWT,
    ...googleVerifica,
    ...subirArchivo
}

