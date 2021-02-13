const { validationResult } = require('express-validator');


// next es una función que tengo que llamar si este middleware pasa
const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req);

    if( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    //quiere decir, si llega a este punto, sigue con el siguiente middleware
    //Si ya no hay otro middleware, entonces seguiría con el controlador
    next();
}


module.exports = {
    validarCampos
}
