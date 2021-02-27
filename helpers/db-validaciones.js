
const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');
const { body } = require('express-validator');

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

/** Para las categorías */
const existeCategoriaXId = async( id ) => {

    const existeCategoria = await Categoria.findById( id );
    if( !existeCategoria ) {
        throw new Error(`El id: ${ id } NO existe -Desde db-validaciones.js`);
    }
}

/** Para los productos */
const existeProductoXId = async( id ) => {

    const existeProducto = await Producto.findById( id );
    if( !existeProducto ) {
        throw new Error(`El id: ${ id } NO existe -Desde db-validaciones.js`);
    }
}

const productoExiste = async( nombre = '' ) => {

    const existeProducto = await Producto.findOne( { nombre: nombre.toUpperCase() });

    console.log('===============================');
    console.log('Desde db-validaciones.js');
    console.log(existeProducto);

    if( existeProducto ) {
        throw new Error(`El producto ${ nombre } ya está registrado`);
    }
}

/**
 * Para validar las colecciones permitidas
 * para eso de actualizar imágenes
 */
//Los argumentos coleccion y colecciones son opcionales, por eso el = y '' y []
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    //Validando que la colección esté incluida en las colecciones
    const incluida = colecciones.includes( coleccion );
    if( !incluida ) {
        throw new Error( `La colección ${ coleccion } no es permitida, solo se permite: ${ colecciones }`);
    }

    //Si todo sale bien, regresa true
    return true;
}


 


//Lo exportamos como un objeto
module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioXId,
    existeCategoriaXId,
    existeProductoXId,
    productoExiste,
    coleccionesPermitidas
}