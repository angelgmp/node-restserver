const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorioW']
       
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorioZ'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoriaY']
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Para eso de no regresar la contraseña
//puedo sobreescribir el método de mongoose toJSON
//tiene que ser una función normal, porque voy a usar el objeto this
//y una funciòn de flecha mantiene a lo que apunta el this fuera de la misma
UsuarioSchema.methods.toJSON = function() {

    //desestructuramos lo que viene de la instancia toObject
    //es decir, de este modelo y queremos quitar para no regresarlo
    //entonces, quito __v y password
    //Usamos el operador rest para regresar todo los demás
    const { __v, password, _id, ...todoLoDemasDelUsuario } = this.toObject();
    todoLoDemasDelUsuario.uid = _id;
    return todoLoDemasDelUsuario;
}

//mongoose dice que hay que exportar el model
//Usuario es el nombre de la coleccion y también pide el Schema, en este caso, usuarioScheam
module.exports = model( 'Usuario', UsuarioSchema)

