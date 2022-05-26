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
//app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')


//Router
const routerProductos = new Router()
app.get('/',(req, res)=>{
    //productos = await Newcontenedor.getAll()
    //res.render('inicio', {productos})
    res.render("inicio")
})

routerProductos.get('/productos', async function(req, res){
    res.json(await Newcontenedor.getAll())
})

//io socket on
io.on('connection', async(socket)=>{
    console.log("user connected " + socket.id)
    
    socket.emit('messages', messages)
    socket.on('new-message', data =>{
        messages.push(data)
        io.sockets.emit('messages', messages)
        NewmsgContenedor.save(data)
    })

    socket.emit("productos")
    socket.on("new-product", async(data)=>{
        await Newcontenedor.save(data)
        io.sockets.emit("productos")
    })
})

// Carga de router
app.use("/", routerProductos)

//Levantar Server
const PORT = 8080
httpServer.listen(PORT, ()=> console.log("El server iniciando en " + PORT))