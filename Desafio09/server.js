const express = require("express")
const {Router} = express
const {Server:HttpServer} = require("http")
const {Server:IOServer} = require("socket.io")
const contenedor = require('./main.js')
const messageContenedor = require('./mainMessages.js')
const {optionsSQL, optionsDB} = require('./options/databaseconn.js') 
const ClienteDB = require ('./dbmain.js')
const ClienteSQL = require ('./sqlmain.js')
///Imports para este Desafio
const {generarMensaje, generarProducto} = require("./util/mock.js")
const {normMensajes, desnormMensajes, print} = require("./util/normalizar.js")
const {mensajesparausar}= require("./mensajesnor.js")

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

app.get('/productos-test', (req, res)=>{
    res.json(generarProducto(5))
})
app.get('/mensajes-test', (req,res)=>{
    const mensajes = mensajesparausar
    //Mensaje Normalizado
    res.json(normMensajes(mensajes))
    //Mensaje no normalizado
    console.log(mensajesparausar)
    console.log("Longitud del Objeto Original: " + JSON.stringify(mensajes).length)
    console.log("Longitud normalizada es: " + JSON.stringify(normMensajes(mensajes)).length)
    console.log("La longitud desnormalizada es: " + JSON.stringify(desnormMensajes(mensajes)).length)
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