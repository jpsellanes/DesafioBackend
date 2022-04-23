//const http = require('http')
/*
//El server pide un request y da un response.
const   server = http.createServer((req, res) =>{
    res.end(getMensaje())
})
const PORT = 8080;
const connectedServer = server.listen(PORT, ()=>{
    console.log("Servidor corriendo en el " + PORT)
})
const getMensaje = ()=>{
    const hora = new Date().getHours()
    if (hora >= 6 && hora <=12){
        return "Buenos Dias"
    }
    if (hora >=13 && hora <=19){
        return "Buenas Tardes"
    }
    return "Noches"
}*/

/*
const express = require('express')

const PORT = 8000

const app = express()

const server = app.listen(PORT, ()=>{
    console.log("Servidor HTTP escuchando en el puerto"+ PORT)
})*/

/*
const express = require('express')

const PORT = 8000

const app = express()

const server = app.listen(PORT, ()=>{
    console.log("Servidor HTTP escuchando en el puerto"+ PORT)
})
app.get('/', (req, res)=>{
    res.send({mensaje: "HOLA HOLA"})
})

let cantVisitas = 0

app.get('/visitas', (req, res)=>{
    cantVisitas++
    res.send("la cantidad de visitas es de " + cantVisitas)
})

app.get('/fyh', (req, res)=>{
    res.send({fechaYhora: new Date().toLocaleString()})
})*/


