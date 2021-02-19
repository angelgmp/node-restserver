const { response } = require("express")


//los middlewares reciben req y resp
//también el callback next, que tengo que llamar si todo sale bien
const esAdminRol = ( req, res = response, next ) => {

    //Verificación para validar por si quiero ejecutar 
    //el middleware esAdminRol, antes de validar el JsonWebToken
    if( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    console.log('El rol es: ', rol);

    if( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto, bruto!!!`
        })
    }

    next();
}

//En vez de poner todos los roles
//const tieneRol = ( ro1, rol2, rol3, etc ) => {
//Utilizamos el operador resto (...)
//El operador resto lo transforma en un arreglo
//Esta función regresa una función, con req, res, next
const tieneRol = ( ...roles ) => {

    return( req, res = response, next ) => {
        
        //Verificación para validar por si quiero ejecutar 
        //el middleware tieneRol, antes de validar el JsonWebToken
        if( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        //Validamos que el rol que queremos está incluido
        //en los parámetros que nos mandan
        if ( !roles.includes( req.usuario.rol )) {
            return res.status(401).json({
                msg: `Esta función requiere unos de estos roles ${ roles }`
            })
        }
        console.log('Desde tieneRol:', roles);
        console.log('Desde tieneRol, req.usuario.rol:', req.usuario.rol);
        next();
    }
}

module.exports = {
    esAdminRol,
    tieneRol
}