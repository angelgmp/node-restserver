//Importamos el path de node
const path = require('path');

//Para crear identificadores únicos
//Estamos usando la función v4 y lo estamos renombrando a uuidv4
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise(( resolve, reject ) => {

        //Desestructuro y obtengo el archivo que viene en la req.files
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');

        //Para sacar la extensión del archivo
        const extension = nombreCortado[nombreCortado.length - 1];
        console.log('Extensión:', extension);

        if (!extensionesValidas.includes( extension )) {
                return reject( `La extensión ${ extension } no es permitida, sólo se permite: ${ extensionesValidas}`);
        }

        //Aún cuando se suban archivos con el mismo nombre, se van a renombrar con el identificador único
        const nombreFile = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreFile);

        //El __dirname llega hasta controllers, porque este archivo está en controllers
        //uno todos los elementos del path que necesito
        //const uploadPath = path.join( __dirname, '../uploads/', archivo.name);
    
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {

        //Esto es un callback, en el que si tenemos un error, mandaremos un 500
        if (err)
            reject(err); 
    
        //resolve ( uploadPath );
        resolve ( nombreFile )
        
        });
    });

    
}


module.exports = {
    subirArchivo
}