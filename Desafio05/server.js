const express = require("express")
//const bodyParser = require('body-parser')
const {Router} = express
const contenedor = require('./main.js')
const Newcontenedor = new contenedor('productos.json')
const app = express()

//APP
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')


//Router
const routerProductos = new Router()
routerProductos.get('/', async(req, res)=>{
    productos = await Newcontenedor.getAll()
    res.render('inicio', {productos})
})
routerProductos.post('/productos', async(req, res)=>{
    await Newcontenedor.save(req.body)
    productos.push(req.body)
    res.redirect('/')
})
routerProductos.get('/productos', async(req, res)=>{
    res.render('productos', {productos})
})


// Carga de router
app.use("/", routerProductos)


//Levantar Server
const PORT = 8080
const server = app.listen(PORT, ()=>{
    console.log(`servidor escuchando ${server.address().port}`)
})
server.on("error", error => console.log("error" + error))