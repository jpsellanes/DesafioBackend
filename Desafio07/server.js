const express = require("express")
const {Router} = express
const {Server:HttpServer} = require("http")
const {Server:IOServer} = require("socket.io")
const contenedor = require('./main.js')
const messageContenedor = require('./mainMessages.js')
const {optionsSQL, optionsDB} = require('./options/databaseconn.js') 
const ClienteDB = require ('./dbmain.js')
const ClienteSQL = require ('./sqlmain.js')


const db = new ClienteDB(optionsDB)
const sql = new ClienteSQL(optionsSQL)
const NewmsgContenedor = new messageContenedor('mensajes.json')
const Newcontenedor = new contenedor('productos.json')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const messages = []

db.crearTabla();
sql.crearTabla();

//APP
app.use(express.static("public"))
//app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')


//Router
const routerProductos = new Router()
app.get('/',(req, res)=>{
    res.render("inicio")
})

routerProductos.get('/productos', async function(req, res){
    res.json(await Newcontenedor.getAll())
})

//io socket on
io.on('connection', async(socket)=>{
    console.log("user connected " + socket.id)
    socket.emit('messages', messages)
    socket.on('new-message', async(data) =>{
        messages.push(data)
        io.sockets.emit('messages', messages)
        NewmsgContenedor.save(data)
        await db.insertarMsgS(data)
        //console.log(data)
        console.log(await db.listarMsgs())
    })

    socket.emit("productos")
    socket.on("new-product", async(data)=>{
        await Newcontenedor.save(data)
        io.sockets.emit("productos")
        await sql.insertarProductos(data)
        console.log(await sql.listarProductos())
    })
})

// Carga de router
app.use("/", routerProductos)

//Levantar Server
const PORT = 8080
httpServer.listen(PORT, ()=> console.log("El server iniciando en " + PORT))