const express = require("express")
const {Router} = express
const {Server:HttpServer} = require("http")
const {Server:IOServer} = require("socket.io")
const contenedor = require('./main.js')
const messageContenedor = require('./mainMessages.js')

const NewmsgContenedor = new messageContenedor('mensajes.json')
const Newcontenedor = new contenedor('productos.json')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const messages = []

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
    productos = await Newcontenedor.getAll()
    productos.push(req.body)
    //res.redirect('/')
})
routerProductos.get('/productos', async(req, res)=>{
    productos = await Newcontenedor.getAll()
    res.render('productos', {productos})
})

//io socket on
io.on('connection', async(socket)=>{
    console.log("user connected " + socket.id)
    socket.emit('messages', messages)
    socket.on('new-message', data =>{
        messages.push(data)
        console.log(typeof(data))
        io.sockets.emit('messages', messages)
        console.log("aca estaria andnado el chat")
        NewmsgContenedor.save(data)
    })
    const productos = await Newcontenedor.getAll()
    socket.emit("productos", productos)
    socket.on("new-product", productosNuevos =>{
        //let productosNuevos =  await Newcontenedor.getAll()
        socket.emit("productos", productosNuevos)
        io.sockets.emit("productos", productosNuevos)
        console.log("aca estaria andando el new-product")
    })
})

// Carga de router
app.use("/", routerProductos)

//Levantar Server
const PORT = 8080
httpServer.listen(PORT, ()=> console.log("El server iniciando en " + PORT))