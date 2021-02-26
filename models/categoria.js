
const { Schema, model } = require('mongoose');


const CategoriaSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    //usuario que creó esa categoria
    usuario: {
        type: Schema.Types.ObjectId,

        //Este Usuario de abajo, es como lo pusimos en el archivo models/usuario.js, en la parte del exports
        //(module.exports = model( 'Usuario', UsuarioSchema))
        ref: 'Usuario',
        required: true
    }
});

//Para no mostrar el __v que pone mongo y el estado, ya q ue siempre que regresaremos categorías con estado: true
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Categoria', CategoriaSchema )