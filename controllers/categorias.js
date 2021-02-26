const { response } = require('express');
const { Categoria } = require('../models');


//obtenerCategorias, paginado, total, populate
//El populate es un obj propio de Mongoose
//lo usamos para ver la inf del usuario, no solo su _id
const obtenerCategorias = async(req = request, res = response) => {

    //Desestructuramos lo que viene en la url
    //por defecto, es decir, si no viene ese limite, será de 3
    const { limite = 3, desde = 0 } = req.query;

    //Se utiliza para regresar solo los registros activos y para el conteo de registros
    const query = { estado: true };

    //Desestructuramos el arreglo, para obtener cada elemento del arreglo
    //total y categorias
    //total es el resultado de la primer promesa, categorias es el resultado de la segunda
    //independientemente de la que sea que termine primero
    const [ total, categorias ] = await Promise.all([
        //Total de registros que estàn activos
        Categoria.countDocuments( query ),

        Categoria.find( query )
            //Del usuario me interesa el nombre, no solo el _id de mongo
            .populate('usuario', 'nombre')

            //Desde qué registro traeremos los registros
            .skip(Number( desde ))

            //Tenemos que castearlo a número, porque la función "limit" espera un número
            //y lo que viene en la url ?limite=5 es un string
            .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    });
}

//obtenerCategoria, populate, ver el obj de la categoría
const obtenerCategoria = async(req, res = response ) => {
    const { id } = req.params;

    //const categoria = await Categoria.findById( id );

    //Usamos populate para decir que el nombre del usuario es lo que me interesa, no solo  el _id de mongo
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');
    res.json( categoria );
}

//actualizarCategoria, solo recibe el nombre de la categoría por el que se quiere cambiar
const actualizarCategoria = async(req, res = response ) => {

    const { id } = req.params;

    //Por si en el request mandan el estado y el usuario, lo quito y solo me quedo con la data
    const { estado, usuario, ...data } = req.body;

    //Aunque data es una constante, no estoy cambiando el valor de la constante
    //lo que cambia es el valor de la propiedad nombre, en JavaScript, eso se vale
    data.nombre  = data.nombre.toUpperCase();

    //_id del usuario dueño del token
    data.usuario = req.usuario._id;

    //Mando el id de la categoría, la data es lo que quiero actualizar
    //y las opciones, es este caso, new:true es para que mande el documento que se actualizó
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json( categoria );
}

//borrarCategoria, poner estado: false
const borrarCategoria = async( req, res = response ) => {

    //Hasta este punto el id ya debe venir validado
    const { id } = req.params;

    //Borrado lógico. Mando el id de la categoría que quiero eliminar, la data, en este caso solo cambio el estado a false
    //y las opciones: new true es para regrese el documento actualizado
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.json( categoriaBorrada );
}


const crearCategoria = async( req, res = response ) => {

    //Quiero grabar el nombre en la bd todo en mayúsculas
    const nombre = req.body.nombre.toUpperCase();

    //Verifico si ya existe la categoría en la bd
    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoría ${ categoriaDB.nombre } ya existe -Desde controllers/categorias.js`
        });
    }

    //Preparar la data que quiero guardar en la bd
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    //Guardando la categoría en bd
    await categoria.save();

    //Cuando se crea algo, el estatus es 201
    res.status(201).json( categoria );
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}