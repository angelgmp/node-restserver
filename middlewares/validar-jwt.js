const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

//Esto es un middleware, que no es más que una función
const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');
    console.log(token);

    if( !token ) {

        //El 401 es unhautorized
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
       /*  const payload = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        console.log(payload); */

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        //req.uid = uid;

        //Leer el usuario que corresponde al uid y ponerlo en el req
        const usuario = await Usuario.findById( uid );

        //Que el usuario que se quiere borrar exista en la bd
        if( !usuario ) {

            return res.status(401).json({
                msg: 'Token No válido - usuario no existe en bd'
            })
        }

        //Verifica si el uid tiene estado false
        if( !usuario.estado ) {

            return res.status(401).json({
                msg: 'Token No válido - usuario con estado: false'
            })
        }
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token NO válido'
        });
        
    }


}


//Esportamos como un objeto
module.exports = {
    validarJWT
}