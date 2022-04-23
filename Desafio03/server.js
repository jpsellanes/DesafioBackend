const express = require('express')
const contenedor = require('./main.js')

const PORT = 8080

const app = express()

const Newcontenedor = new contenedor('productos.json')

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
})

//app.use(contenedor.getAll())

app.get('/productos', async(req, res)=>{
    //res.send("PRODUCTOS")  
    //Newcontenedor.getAll()
    //JSON.stringify(Newcontenedor.getAll())
    //Newcontenedor.getAll()
    //console.log(Newcontenedor.getAll())
    res.send(await Newcontenedor.getAll() )
})

app.get('/productoRandom', (req, res)=>{
    res.send("PRODUCTOS RANDOM")
})
