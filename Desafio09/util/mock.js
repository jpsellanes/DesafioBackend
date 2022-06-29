const {faker} = require("@faker-js/faker")
//import {faker} from '@faker-js/faker';
faker.locale = "es";

function generarProducto( cantidad ){
    let productos = []
    for (let i = 0; i < cantidad; i++){
        let producto = {
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            id: faker.random.numeric(),
        }
        productos.push(producto)
    }
    return productos
}

function generarMensaje ( cantidad){
    let mensajes = []
    for (let i=0; i< cantidad; i++){
        let mensaje = {
            author:{
                name: faker.name.firstName(),
                lastname: faker.name.lastName(),
                pfp: faker.image.avatar(),
                pDescription: faker.lorem.sentence(),
            },
            messageText: faker.lorem.sentence(),
        }
        mensajes.push(mensaje)
    }
    return mensajes
}

module.exports={ generarMensaje, generarProducto}
