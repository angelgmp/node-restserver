const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario | Password no son correctos - correo'
            });
        }

        //Verificar si el usuario está activo
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario | Password no son correctos - estado: false'
            });
        }

        //Verificar el password
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario | Password no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo salió mal con el login'
        });
    }

}

//Para la autenticación de Google
const googleSignIn = async( req, res = response ) => {

    const{ id_token } = req.body;

    try { 
        /* const googleUser = await googleVerify( id_token );
        console.log( googleUser ); */

        //Desestructuramos los que necesitamos
        const{ correo, nombre, img } = await googleVerify( id_token );

        //Verifico si el correo ya existe en la bd
        let usuario = await Usuario.findOne({ correo });

        //Si el usuario no existo, lo creo
        if ( !usuario ) {

            //Toda esta data es la que se manda para crear al usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario está bloqueado en mi bd
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Habla con el administrador, usuario bloqueado'
            })
        }

        //Genero el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            /* msg: 'Todo ok! google SingIn',
            id_token,
            googleUser */
            usuario,
            token
        });
        
    } catch (error) {
        
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }

}


module.exports = {
    login,
    googleSignIn
}