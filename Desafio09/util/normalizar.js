const {generarMensaje, generarProducto} = require("./mock.js")
const {normalize, schema} = require("normalizr")
const util = require("util")

/***** Se definen los Schemas para mensajes y autor******/
const schAutor = new schema.Entity("autor")
const schMensaje = new schema.Entity("post", {author : schAutor})
const schMensajes = new schema.Entity("post", {mensajes: [schMensaje]}, {idAttribute:'id'}) 

/***** Se empieza con los esquemas *****/
const normMensajes = (mensaje) => normalize({id:'mensajes', mensajes: mensaje}, schMensajes)


//Funcion para printear objetos
function print (obj){
    console.log(util.inspect(obj, false, 12 , true));
}

module.exports = {normMensajes, print}