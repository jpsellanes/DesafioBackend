const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")

const {Router} = express
const contenedor = require('./main.js')
const Newcontenedor = new contenedor('productos.json')
const app = express()
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
//APP
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(
    session({
        store: MongoStore.create({
            mongoUrl:'mongodb+srv://coderhouse:coderhouse@cluster0.wbfib.mongodb.net/?retryWrites=true&w=majority',
            mongoOptions: advancedOptions,
            ttl: 600,
        }),
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie:{
            maxAge: 60000
        }
    })
)


//Router
const routerProductos = new Router()
routerProductos.get('/main', async(req, res)=>{
    username = req.session.nombre
    productos = await Newcontenedor.getAll()
    res.render('inicio', {productos, username})
    if(req.session.nombre == null){
        res.redirect('/')
    }
})
routerProductos.post('/productos', async(req, res)=>{
    await Newcontenedor.save(req.body)
    productos.push(req.body)
    res.redirect('/main')
    if(req.session.nombre == null){
        res.redirect('/')
    }  
})
routerProductos.get('/productos', async(req, res)=>{
    res.render('productos', {productos})
    if(req.session.nombre == null){
        res.redirect('/')
    }
    
})

///Login
routerProductos.get('/', async(req, res)=>{
    res.render("login")
})

routerProductos.post('/',async(req, res)=>{
    const username = req.body.username
    req.session.nombre = username
    console.log(req.body.username)
    console.log("logging in!")
    res.redirect("main")
})

routerProductos.get('/logout', async(req,res)=>{
    //const username = req.session.nombre
    req.session.destroy(err=>{
        if(err){
            res.json({error: "Log Out", descripcion: err})
        } else {
            //res.send("Hasta luego" + username + "!")
            res.redirect('/')
        }
    })
})

// Carga de router
app.use("/", routerProductos)

//Levantar Server
const PORT = 8080
const server = app.listen(PORT, ()=>{
    console.log(`servidor escuchando ${server.address().port}`)
})
server.on("error", error => console.log("error" + error))

