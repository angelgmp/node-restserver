
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne( { rol });

    if( !existeRol ) {
      throw new Error(`El rol ${ rol } no existe en la BD` );
    }
}

const emailExiste = async( correo = '' ) => {

    const existeEmail = await Usuario.findOne( { correo });
    if( existeEmail ) {
        throw new Error(`El correo ${ correo } ya está registrado`);
    }
}

//Podría dejarse como id='', funcionaría igual
const existeUsuarioXId = async( id ) => {

    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ) {
        throw new Error(`El id: ${ id } NO existe`);
    }
}


//Lo exportamos como un objeto
module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioXId
}