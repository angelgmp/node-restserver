
const { Schema, model } = require('mongoose');


const ProductoSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },

    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    //usuario que crea el producto
    usuario: {
        //Relación con la colección Usuario
        type: Schema.Types.ObjectId,

        //Este Usuario de abajo, es como lo pusimos en el archivo models/usuario.js, en la parte del exports
        //(module.exports = model( 'Usuario', UsuarioSchema))
        ref: 'Usuario',
        required: true
    },

    precio: {
        type: Number,
        default: 0
    },

    categoria: {
        //Relación con la colección Categoria
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },

    descripcion: { type: String },

    disponible: { type: Boolean, default: true },

    img: {
        type: String,
    }

});

//Para no mostrar el __v que pone mongo y el estado, ya q ue siempre que regresaremos categorías con estado: true
ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Producto', ProductoSchema )