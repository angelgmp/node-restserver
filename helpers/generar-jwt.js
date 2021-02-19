const jwt = require('jsonwebtoken');

//Genero una promesa manualmente
const generarJWT = ( uid = '') => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'

        // (err, token )... Es el callback: si sucede un error, se dispara ese error
        //si todo sale bien, tenemos el token
        }, ( err, token ) => {

            if( err ) {
                console.log(err);
                reject( 'No se pudo generar el token')
            } else {
                resolve( token );
            }
        })
    })
}

module.exports = {
    generarJWT
}