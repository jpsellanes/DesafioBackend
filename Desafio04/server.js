const express = require("express")
const bodyParser = require('body-parser')
const {Router} = express
const contenedor = require('./main.js')
const Newcontenedor = new contenedor('productos.json')
const app = express()

//APP
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())

//Router
const routerProductos = new Router()
routerProductos.get('/productos', async(req, res)=>{
    res.send(await Newcontenedor.getAll())
})
routerProductos.post('/productos', async(req, res)=>{
    await Newcontenedor.save(req.body)
    res.send(await Newcontenedor.getAll())
})

const routerProductosID = new Router()
routerProductosID.get("/productos/id", async(req, res)=>{
    console.log("Get Product ID " + req.query.id)
    await Newcontenedor.getById(parseInt(req.query.id))
    res.send(await Newcontenedor.getById(parseInt(req.query.id)))
})

routerProductosID.put("/productos/id", async(req, res)=>{
    let productId = req.body.productoID
    console.log(productId + "Cuyo typeof es: " + typeof(productId))
    console.log(req.body.productoTitle)
    await Newcontenedor.updateById(productId, req.body)
    console.log("PUT await Newcontenedor.getById(id)")
})
routerProductosID.delete("/productos/id", async(req, res)=>{
    console.log("delete button pressed id " + parseInt(req.body.productoID))
    console.log("id borrar: " + req.body.productoID)
    await Newcontenedor.deleteById(req.body.productoID)
})

/*
------GET '/api/productos' -> devuelve todos los productos.------
------GET '/api/productos/:id' -> devuelve un producto según su id.
------POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
------PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
------DELETE '/api/productos/:id' -> elimina un producto según su id
*/


// Carga de router
app.use("/", routerProductos)
app.use("/", routerProductosID)

//Levantar Server
const PORT = 8080
const server = app.listen(PORT, ()=>{
    console.log(`servidor escuchando ${server.address().port}`)
})
server.on("error", error => console.log("error" + error))