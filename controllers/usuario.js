const { request, response } = require( 'express' );
const bcryptjs = require('bcryptjs');

//La U mayúscula es para que me permita crear instancias de usuario
//por estándar, no es obligatorio
const Usuario = require( '../models/usuario');
const usuario = require('../models/usuario');
//const { validationResult } = require('express-validator');


/* const usuarioGet = (req = request, res = response) => {
    //Para cachar los parámetros enviados como "query params"
    //así cachamos todo
    //const queryParams = req.query;

    //Si desestructuramos es mejor, ya que cachamos solo lo que nos interesa
    //Si por ejemplo, el color no viene, puedo darle un valor por defecto
    const {color = 'ninguno', key, pato, pagina = 1, limite} = req.query;

    res.json( {
        msg: 'get API - controlador',
        color,
        key,
        pato,
        pagina,
        limite
  });
} */

const usuariosGet = async(req = request, res = response) => {

    //Desestructuramos lo que viene en la url
    //por defecto, es decir, si no viene ese limite, será de 3
    const { limite = 3, desde = 0 } = req.query;

    //Se utiliza para regresar solo los registros activos y para el conteo de registros
    const query = { estado: true };

    //find() regresa todos los registros
    //const usuarios = await Usuario.find()

    //Asi, find regresa solo los que estèn ativos
    //const usuarios = await Usuario.find( { estado: true } )
    //const usuarios = await Usuario.find( query )
    /* 
        //Desde qué registro traeremos los registros
        .skip(Number( desde ))

        //Tenemos que castearlo a número, porque la función "limit" espera un número
        //y lo que viene en la url ?limite=5 es un string
        .limit(Number(limite));

        //Obtenemos el total de registros
        //lo mismo de find() de arriba, countDocuments() regresa todos. 
        //countDocuments({estado:true}) regresa solo los que estèn activos
        //const total = await Usuario.countDocuments( { estado: true } );
        const total = await Usuario.countDocuments( query );
 */
        //Así regresa los valores de las promesas
        //const resp = await Promise.all([

        //Desestructuramos el arreglo, para obtener cada elemento del arreglo
        //total y usuarios
        //total es el resultado de la primer promesa, usuarios es el resultado de la segunda
        //independientemente de la que sea que termine primero
        const [ total, usuarios ] = await Promise.all([
            //Total de registros que estàn activos
            Usuario.countDocuments( query ),

            Usuario.find( query )
            //Desde qué registro traeremos los registros
            .skip(Number( desde ))

            //Tenemos que castearlo a número, porque la función "limit" espera un número
            //y lo que viene en la url ?limite=5 es un string
            .limit(Number(limite))
        ])

    res.json({
        total,
        usuarios
        /* resp */
        /* total,
        usuarios */
    });
}

const usuarioPost = async(req, res = response) => {
    //const body = req.body;

    //La anterior funciona, pero si desesctructuramos el body
    //podemos usar solo lo que necesitamos (en caso de que el front mande cosas de más)
    //const { nombre, edad } = req.body;

    /* const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    } */

    //Vamos a tomar solo los datos que nos interesan del body
    //para eso lo desestructuramos
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol });

    //Verificar si el correo existe
    //correo: correo, es que va a buscar la coincidencia del correo
    //q recibimos, con alguno q estè en la bd
    //const existeEmail = await Usuario.findOne( { correo: correo });

    //La línea anterior funciona, pero con eso de que es redundate
    //en JavaScript poner correo: correo, lo dejamos solamente como correo y funciona
    //esta función la pasamos a db-validaciones.js
    /* const existeEmail = await Usuario.findOne( { correo });
    if( existeEmail ) {
        //regresamos 400, porque es un bad request
        return res.status(400).json( {
            msg: 'Ese correo ya está registrado'
        });
    } */

    //Encriptar contraseña
    //por defecto genSaltSync tiene valor de 10, pero si no se pone, por defecto lo hace con 10
    //var salt = bcrypt.genSaltSync(10);
    var salt = bcryptjs.genSaltSync();

    //el password ya està desestructurado arriba
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar el usuario en la bd
    await usuario.save();

    res.json( {
        msg: 'post API - controlador',
        usuario
  });
}

const usuarioPut = async(req, res = response) => {
    //desestructuramos para cachar todos lo parámetros que vengan en "params"
    //para cuando tenemos varios parámetros
    //const { id, altura } = req.params;

    //para cachar lo que viene en la url
    const { id } = req.params;

    //Desestructuramos lo que no necesito
    //como lo que hicimos con toJSON del post
    //quitamos el _id, porque si lo manda el front choca con el objeto de mongo y da un error
    const { _id, password, google, correo, ...resto } = req.body;

    //Validar contra bd

    //Si el password viene, debo actualizar en la bd
    if( password ) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    //Actualizar usuario
    const usuario =  await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );

    /* res.json( {
        msg: 'put API - controlador',
        usuario
        //altura
    }); */

}

const usuarioDelete = async(req, res = response) => {

    const { id } = req.params

    //const uid = req.uid;

    //Borrado físico
    //const usuario = await Usuario.findByIdAndDelete( id );

    //Borrado lógico, cambiamos el estado a false
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });
    
    //const usuarioAutenticado = req.usuario;

    res.json( {
        //usuario, uid
        //usuario, usuarioAutenticado
        usuario
  });
}

const usuarioPatch = (req, res = response) => {
    res.json( {
        msg: 'patch API - controlador'
  });
}




module.exports = {
    usuariosGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete,
    usuarioPatch
}