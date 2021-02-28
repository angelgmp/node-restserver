const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2;
//configuramos la cuenta de claudinary
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');
const { subirArchivo } = require('../helpers');

//Para las validaciones cuando se actualicen las imágenes
const { Usuario, Producto } = require('../models');

const cargarArchivo = async( req, res = response ) => {

    console.log(req.files);
  /* 
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
      //return res.status(400).send('No files were uploaded.');

      return res.status(400).json({msg: 'No hay archivos que subir.'});
    }
 */
  /*   if (!req.files.archivo || Object.keys(req.files).length === 0) {
        return res.status(400).json({'No hay archivotes que subir.'});
    } */
  
    //Para subir imágenes
    //No le pasamos el argumento de extensionesValidas porque usaré por defecto las definidas
    //en la función subirArchivo ['png', 'jpg', 'jpeg', 'gif']
    //Tampoco le pasamos el nombre de la carpeta, por defecto, lo toma como una cadena vacía
    //como lo pusimos en la función
    // const pathCompleto = await subirArchivo( req.files );

    try {
        //Ahora lo que quiero subir son archivos txt y md
        //Si no lo ponemos en un try catch, la app revienta
        //const nombreDelFile = await subirArchivo( req.files, ['txt', 'md'] );

        //Ahora con la configuración en el "server.js" de la opcion "createParentPath" en true
        //se crea la capeta "textos"
        //const nombreDelFile = await subirArchivo( req.files, ['txt', 'md'], 'textos' );

        //Para ocupar todos los argumentos por defecto de las extensiones permitidas se usa "undefine"
        //y para indicarle que guarde los archivos en la carpeta img
        const nombreDelFile = await subirArchivo( req.files, undefined, 'imgs' );

        res.json({ nombreDelFile })
        
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

//Es asinc porque se necesitan hacer grabaciones a bd, y eso ya es asíncrono
const actualizarImagen = async ( req, res = response ) => {

    console.log(`La imagen a actualizar: ${ req.files.archivo.name }`)

    const { id, coleccion } = req.params;

    console.log('colec:', coleccion);

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            console.log(`El usuario es: ${ modelo }`);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id ${ id }`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            console.log(`El producto es: ${ modelo }`);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${ id }, ZOQUETEEE!!`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Esta no está validada'});
    }

    //Limpiar imágenes previas
    if( modelo.img ) {
        //Hay que borrar la imagen del servidor
        //Me encuento en controllers/uploads
        //entonces tengo que irme a una carpeta atrás
        //y necesito saber si estoy borrando una imagen de la carpeta usuarios o productos, para eso es el parámetro coleccion
        //además, necesito especificar el nombre de la imagen a borrar, eso está en modelo.img
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

        //Si existe el archivo, lo borro
        if(fs.existsSync( pathImagen )) {
            //con esto se borra
            fs.unlinkSync( pathImagen );
        }
    }


    //Se almacena en la carpeta que tenga el nombre de la coleccion (productos, usuarios)
    const nombreDelFile = await subirArchivo( req.files, undefined, coleccion );

    modelo.img = nombreDelFile;
    modelo.save();

    //res.json({ id, coleccion });
    res.json({ modelo });
}

//Para obtener la imagen
const mostrarImagen = async ( req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
     
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id ${ id }`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            console.log(`El producto es: ${ modelo }`);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${ id }, ZOQUETEEE2!!`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Esta no está validada'});
    }

    //Limpiar imágenes previas
    if( modelo.img ) {
        //Hay que borrar la imagen del servidor
        //Me encuento en controllers/uploads
        //entonces tengo que irme a una carpeta atrás
        //y necesito saber si estoy borrando una imagen de la carpeta usuarios o productos, para eso es el parámetro coleccion
        //además, necesito especificar el nombre de la imagen a borrar, eso está en modelo.img
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

        //Si existe el archivo, envío la imagen
        if(fs.existsSync( pathImagen )) {
            //con esto se borra
            return res.sendFile( pathImagen );
        }
    }

    //Debido a que estamos en JS moderno, por eso del scope, no importa que se llame igual que la de arriba (pathImagen), es diferente
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );
}

/************************************************************/
//Es asinc porque se necesitan hacer grabaciones a bd, y eso ya es asíncrono
const actualizarImagenCloudinary = async ( req, res = response ) => {

    console.log('pato');

    console.log(`La imagen a actualizar: ${ req.files.archivo.name }`)

    const { id, coleccion } = req.params;

    console.log('colec:', coleccion);

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            console.log(`El usuario es: ${ modelo }`);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id ${ id }`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            console.log(`El producto es: ${ modelo }`);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${ id }, ZOQUETEEE!!`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Esta no está validada'});
    }

    //Borrar imágenes previas
    if( modelo.img ) {
 
        //De toda la url, obtengo la parte que tiene el nombre de la imagen
        //en la url tengo, por ejemplo: https://res.cloudinary.com/dynwd07jq/image/upload/v1614541708/vwnsw4gwyjjsghc4fm5p.jpg
        //ese v1614... es lo que me interesa 
        const nombreArr = modelo.img.split('/');
        
        //Ahora de esa parte, le quito la extensión y me quedo con el nombre
        const nombre = nombreArr[ nombreArr.length -1 ];

        //Ahora necesito el nombre del archivo sin la extensión, le pondré public_id
        const [ public_id ] = nombre.split('.');
        console.log('public_id: ', public_id);
 
        //Borramos la imagen de cloudinary
        //No necesitamos esperar a que se borre, por eso no tiene await
        cloudinary.uploader.destroy( public_id );
    } 
    console.log('Temp:', req.files.archivo );
    
    //El tempFilePath es lo que se le manda a cloudinary
    const { tempFilePath } = req.files.archivo;
    //Esto es de cloudinary, esto es una promesa
    //Esto regresa todo el objeto, entre otras cosas, la ssecure_url
    //const resp = await cloudinary.uploader.upload( tempFilePath )

    //Solo me interesa el secure_url, de todo lo que regresa cloudinary
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;

    //Lo guardo en la bd
    await modelo.save();

    //res.json({ resp });

    res.json({ modelo });
     
}
/*************************************************************************** */


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}