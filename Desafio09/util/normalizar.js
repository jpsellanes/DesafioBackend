const {generarMensaje, generarProducto} = require("./mock.js")
const {normalize, schema, denormalize} = require("normalizr")
const util = require("util")

/***** Se definen los Schemas para mensajes y autor******/
const schAutor = new schema.Entity("autor", {},{idAttribute: 'id'})
const schMensaje = new schema.Entity("mensaje", {author : schAutor})
const schMensajes = new schema.Entity("mensajes", {mensajes: [schMensaje], author: schAutor}) 

/***** Se empieza con los esquemas *****/
const normMensajes = (mensaje) => normalize(mensaje, schMensajes)
const desnormMensajes = (mensaje) => denormalize(mensaje.result, schMensajes, mensaje.entities)

//Funcion para printear objetos
function print (obj){
    console.log(util.inspect(obj, false, 12 , true));
}

module.exports = {normMensajes,desnormMensajes, print}