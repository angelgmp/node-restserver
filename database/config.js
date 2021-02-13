//Aquí se podrían poner diferentes conexiones a diferentes bd
//Por ejemplo a producciòn, desarrollo, otras bd, etc

const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        //Estos objetos los pide mongoose
        //en un futuro quiza ya no sean necesarios, pero ahorita, sí
        await mongoose.connect( process.env.CADENA_CONEXION_MONGO_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos online!!');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar con la bd');
    }
    
}


module.exports = {
    dbConnection
}