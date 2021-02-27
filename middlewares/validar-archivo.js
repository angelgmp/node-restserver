
//Los middlewares se disparan con la req, res y next (next es un callback)
const validarArchivoSubir = ( req, res = response, next ) => {

    //Validamos que haya algún archivo que subir
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        //return res.status(400).send('No files were uploaded.');
        return res.status(400).json({
            msg: 'No hay archivotes que subir -desde middlewares/validar-archivo.js, validarArchivoSubir'
        });
    }

    //Si todo sale bien, quiere decir que llegó a este punto, entonces, llamo a next
    next();
}


module.exports = {
    validarArchivoSubir
}