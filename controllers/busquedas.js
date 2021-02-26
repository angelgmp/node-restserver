const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    //Si es un id de mongo regresa true, si no, regresa false
    //Si es true, quiere decir que el front manda el id del usuario
    const esMongoId = ObjectId.isValid( termino );

    console.log('----------------------------');
    console.log('Desde buscarUsuarios')
    console.log('esMongoId:', esMongoId);

    if( esMongoId ) {
        const usuario = await Usuario.findById(termino);
        //res.json(usuario);
        return res.json({
            //ESto es un ternario. 
            //Si el usuario existe, regresa un arreglo con el usuario
            //en caso contrario, regresa un arreglo vacío
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    //Si no es mongoId, quiere decir que se buscará por el nombre o por el correo
    //Si lo que se quiere hacer es buscar por nombre

    //La expresión regular es para hacer la búsqueda más flexible, para que no sea case sensitive
    //y para que buscque coincidencias con solo parte de la cadena, ejm: si busco test, que traiga a test1, test2, etc
    // i es para que sea insensible a las mayúsculas y minúsculas
    const regex = new RegExp( termino, 'i' );

    //el find siempre regresará un arreglo vacío en caso de que no haya resultados
    //si encuentra varios, regresa un arreglo
    //const usuarios = await Usuario.find( { nombre: regex } );

    //Como vamos a buscar en el correo también, usamos el OR de mongo
    const usuarios = await Usuario.find( { 
       //$or: [{ nombre: regex }, { correo: regex }] 

       //Si lo que queremos es que además busque pero solo a los usuarios con estado: true
       //$or: [{ nombre: regex, estado: true }, { correo: regex, estado: true }] 

       //Esto es lo mismo
       $or: [{ nombre: regex }, { correo: regex }],
       $and: [{ estado: true }]
    });

    //Contando los resultados
    const total = await Usuario.countDocuments({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: total, usuarios
    });
}

/*----------------------------------------------*/
const buscarCategorias = async( termino = '', res = response ) => {

    //Si es un id de mongo regresa true, si no, regresa false
    //Si es true, quiere decir que el front manda el id de la categoría
    const esMongoId = ObjectId.isValid( termino );

    console.log('----------------------------');
    console.log('Desde buscarCategorias');
    console.log('esMongoId:', esMongoId);

    if( esMongoId ) {
        const categoria = await Categoria.findById(termino);
        
        return res.json({
            //ESto es un ternario. 
            //Si la categoría existe, regresa un arreglo con la categoría
            //en caso contrario, regresa un arreglo vacío
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    //Si no es mongoId, quiere decir que se buscará por el nombre de la categoría

    //La expresión regular es para hacer la búsqueda más flexible, para que NO sea case sensitive
    //y para que buscque coincidencias con solo parte de la cadena, ejm: si busco cafe, que traiga cafecito, cafesote, etc.
    // i es para que sea insensible a las mayúsculas y minúsculas
    const regex = new RegExp( termino, 'i' );

    //el find siempre regresará un arreglo vacío en caso de que no haya resultados
    //si encuentra varios, regresa un arreglo
    const categorias = await Categoria.find( { nombre: regex, estado: true } );

    //Contando los resultados
    const total = await Categoria.countDocuments({ nombre: regex });

    res.json({
        results: total, categorias
    });
}

/*----------------------------------------------*/
const buscarProductos = async( termino = '', res = response ) => {

    //Si es un id de mongo regresa true, si no, regresa false
    //Si es true, quiere decir que el front manda el id del producto
    const esMongoId = ObjectId.isValid( termino );

    console.log('----------------------------');
    console.log('Desde buscarProductos');
    console.log('esMongoId:', esMongoId);

    if( esMongoId ) {
        const producto = await Producto.findById(termino);
        
        return res.json({
            //ESto es un ternario. 
            //Si el producto existe, regresa un arreglo con el producto
            //en caso contrario, regresa un arreglo vacío
            results: ( producto ) ? [ producto ] : []
        });
    }

    //Si no es mongoId, quiere decir que se buscará por el nombre del producto

    //La expresión regular es para hacer la búsqueda más flexible, para que NO sea case sensitive
    //y para que buscque coincidencias con solo parte de la cadena, ejm: si busco oreo, que traiga oreo vainilla, oreo chocolate, etc.
    // i es para que sea insensible a las mayúsculas y minúsculas
    const regex = new RegExp( termino, 'i' );

    //el find siempre regresará un arreglo vacío en caso de que no haya resultados
    //si encuentra varios, regresa un arreglo
    //En este caso, a diferencia de buscarUsuario y buscarCategoría, no traeremos solo aquellos cuyo estado sea true, traerá todos
    const productos = await Producto.find( { nombre: regex } )
                                        .populate('categoria', 'nombre')
                                        .populate('usuario', 'nombre');

    //Contando los resultados
    const total = await Producto.countDocuments({ nombre: regex });

    res.json({
        results: total, productos
    });
}

/***********************************************************************/
const buscar = ( req, res = response ) => {

    //No importa el orden en el que desestructuremos, podría ser:
    //const { termino, coleccion } = req.params;
    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json( {
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;

        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Esta búsqueda no está implementada'
            })
            break;
    }
   
    
    /* res.json({
        coleccion, termino
    }) */
}





module.exports = {
    buscar
}