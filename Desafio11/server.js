const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
//--------
const passport = require("passport")
const {Strategy: LocalStrategy} = require("passport-local")
//--------

const {Router} = express
const contenedor = require('./main.js')
const Newcontenedor = new contenedor('productos.json')
const app = express()
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
//const userContenedor = require('./utils/contenedorUsers')
//const newUserContenedor = new userContenedor
////PassPort
const usuarios = []//newUserContenedor.getUser()

passport.use('register', new LocalStrategy({
    passReqToCallback: true}, (req, username, password, done)=>{
        const usuario = usuarios.find(usuario => usuario.username == username)
        if(usuario){
            return done('Usuario ya registrado')
        }
        const user = {
            username,
            password,
        }
        usuarios.push(user)
        return done(null, user)
    }
    ))
//----------------
// Passport Login

passport.use('login', new LocalStrategy((username, password, done)=>{
    const user = usuarios.find(usuario => usuario.username == username)
    if(!user){
        return done(null, false)
    }
    if(user.password != password){
        return done(null, false)
    }
    return done(null, user)
}))

//Serializar, y deserializar
passport.serializeUser(function(user, done){
    done(null, user.username)
})
passport.deserializeUser(function(username, done){
    const usuario = usuarios.find(usuario => usuario.username == username)
    done(null, usuario)
})


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
/// Middleware de Passport
app.use(passport.initialize())
app.use(passport.session())


function isAuth(req, res, next){
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
}

//Router

const routerProductos = new Router()
routerProductos.get('/main', isAuth ,async(req, res)=>{
    const username = req.session.nombre
    productos = await Newcontenedor.getAll()
    res.render('inicio', {productos, username})
})
routerProductos.post('/productos',isAuth, async(req, res)=>{
    await Newcontenedor.save(req.body)
    productos.push(req.body)
    res.redirect('/main')
})
routerProductos.get('/productos',isAuth ,async(req, res)=>{
    productos = await Newcontenedor.getAll()
    res.render('productos', {productos}) 
})

///Registro
app.get('/register', (req, res)=>{
    res.render("register")
})
app.post('/register',passport.authenticate('register',{failureMessage: "Auth Error", successRedirect:'/login'}))


///Login
routerProductos.get('/login', async(req, res)=>{
    res.render("login")
})

routerProductos.post('/login', async(req, res, next)=>{
    const username = req.body.username
    req.session.nombre = username
    console.log(req.session.nombre)
    next()
},passport.authenticate('login', {failureMessage: "Problem Loggin In", successRedirect: '/main'}))

routerProductos.get('/logout', async(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            res.json({error: "Log Out", descripcion: err})
        } else {
            res.redirect('/login')
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

