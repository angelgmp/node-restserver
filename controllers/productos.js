const { response } = require('express');
const { Producto } = require('../models');


//obtenerProductos, paginado, total, populate
//El populate es un obj propio de Mongoose
//lo usamos para ver la inf del usuario, no solo su _id
const obtenerProductos = async(req = request, res = response) => {

    //Desestructuramos lo que viene en la url
    //por defecto, es decir, si no viene ese limite, será de 3
    const { limite = 3, desde = 0 } = req.query;

    //Se utiliza para regresar solo los registros activos y para el conteo de registros
    const query = { estado: true };

    //Desestructuramos el arreglo, para obtener cada elemento del arreglo
    //total y productos
    //total es el resultado de la primer promesa, productos es el resultado de la segunda
    //independientemente de la que sea que termine primero
    const [ total, productos ] = await Promise.all([
        //Total de registros que estàn activos
        Producto.countDocuments( query ),

        Producto.find( query )
            //Del usuario me interesa el nombre, no solo el _id de mongo
            .populate('usuario', 'nombre')

            //De la categoría me interesa el nombre, no solo el _id de mongo
            .populate('categoria', 'nombre')

            //Desde qué registro traeremos los registros
            .skip(Number( desde ))

            //Tenemos que castearlo a número, porque la función "limit" espera un número
            //y lo que viene en la url ?limite=5 es un string
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    });
}

//obtenerProducto, populate, ver el obj del producto
const obtenerProducto = async( req, res = response ) => {
    const { id } = req.params;

    //Usamos populate para decir que el nombre del usuario y de la categoría es lo que me interesa, no solo  el _id de mongo
    const producto = await Producto.findById( id ).populate('usuario', 'nombre')
                                                  .populate('categoria', 'nombre');

    res.json( producto );
}

const actualizarProducto = async(req, res = response ) => {

    const { id } = req.params;

    //Por si en el request mandan el estado y el usuario, lo quito y solo me quedo con la data
    const { estado, usuario, ...data } = req.body;

    //Si viene el nombre, lo ponemos en mayúsculas
    //Aunque data es una constante, no estoy cambiando el valor de la constante
    //lo que cambia es el valor de la propiedad nombre, en JavaScript, eso se vale
    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    //_id del usuario dueño del token
    data.usuario = req.usuario._id;

    //Mando el id de la categoría, la data es lo que quiero actualizar
    //y las opciones, es este caso, new:true es para que mande el documento que se actualizó
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json( producto );
}

//Producto, poner estado: false
const borrarProducto = async( req, res = response ) => {

    //Hasta este punto el id ya debe venir validado
    const { id } = req.params;

    //Borrado lógico. Mando el id de la categoría que quiero eliminar, la data, en este caso solo cambio el estado a false
    //y las opciones: new true es para regrese el documento actualizado
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.json( productoBorrado );
}


const crearProducto = async( req, res = response ) => {

    console.log('Desde controllers/producto.js, crearProducto')
    //Sacamos del body todo lo que no queremos
    const { estado, usuario, ...body } = req.body;

    console.log('El body', body);

    //Verifico si ya existe la categoría en la bd
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe -Desde controllers/productos.js`
        });
    }

    //Preparar la data que quiero guardar en la bd
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    console.log('Desde controller/productos.js, crearProducto')
    console.log(producto);
    
    //Guardando la producto en bd
    await producto.save();

    //Cuando se crea algo, el estatus es 201
    res.status(201).json( producto );
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}