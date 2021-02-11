const { request, response } = require( 'express' );


const usuarioGet = (req = request, res = response) => {
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
}

const usuarioPost = (req, res = response) => {
    //const body = req.body;

    //La anterior funciona, pero si desesctructuramos el body
    //podemos usar solo lo que necesitamos (en caso de que el front mande cosas de más)
    const { nombre, edad } = req.body;
    res.json( {
        msg: 'post API - controlador',
        nombre,
        edad
  });
}

const usuarioPut = (req, res = response) => {
    //desestructuramos para cachar todos lo parámetros que vengan en "params"
    const { id, altura } = req.params;

    res.json( {
        msg: 'put API - controlador',
        id,
        altura
  });
}

const usuarioDelete = (req, res = response) => {
    res.json( {
        msg: 'delete API - controlador'
  });
}

const usuarioPatch = (req, res = response) => {
    res.json( {
        msg: 'patch API - controlador'
  });
}




module.exports = {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete,
    usuarioPatch
}