const express = require("express")
const {Router} = express
const {Server:HttpServer} = require("http")
const {Server:IOServer} = require("socket.io")
const contenedor = require('./main.js')


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
    productos.push(req.body)
    res.redirect('/')
})
routerProductos.get('/productos', async(req, res)=>{
    res.render('productos', {productos})
})

//io socket on
io.on('connection', (socket)=>{
    console.log("user connected " + socket.id)
    console.log('un cliente se ha conectado!')
    socket.emit('messages', messages)
    socket.on('new-message', data =>{
        messages.push(data)
        io.sockets.emit('messages', messages)
    })
})

// Carga de router
app.use("/", routerProductos)

//Levantar Server
const PORT = 8080
httpServer.listen(PORT, ()=> console.log("El server iniciando en " + PORT))