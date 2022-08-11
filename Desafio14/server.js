const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
//--------
const passport = require("passport")
const {Strategy: LocalStrategy} = require("passport-local")
//------desafio 14 --------
const compression = require('compression')
const logger = require('./utils/logger.js')
//------desafio 13 --------
const cluster = require("cluster")
const os = require("os")
/// DESAFIO 12 ------
//Fork
const {fork} = require('child_process')
const path = require('path')
// ENV y CONFIG
const parseArgs = require('minimist')
const dotenv = require('dotenv').config()
//const yargs = parseArgs(process.argv.slice(2))
const options = {
    alias: {p:'puerto', m: 'modo'},
    default:{puerto:8080, modo:'fork'}
}

const {puerto} = parseArgs(process.argv.slice(2),options)
const {modo} = parseArgs(process.argv.slice(3),options)
const debug = process.env.DEBUG == "true" ? true : false

console.log({modo, puerto, debug})
/// DESAFIO 13 SERVIDORES CLUSTER Y FORK
if((modo =='cluster') && cluster.isPrimary){
    const numCPUs = os.cpus().length
    for(let i =0; i<numCPUs; i++){
        cluster.fork()
    }
    cluster.on('exit', worker=>{logger.info('Worker '+ process.pid + ' ended')
    cluster.fork()
    })
} else {
//
const {Router} = express
const contenedor = require('./main.js')
const Newcontenedor = new contenedor('productos.json')
const app = express()
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const userContenedor = require('./utils/contenedorUsers')
const newUserContenedor = new userContenedor


////PassPort
const usuarios = newUserContenedor.getUser()

passport.use('register', new LocalStrategy({
    passReqToCallback: true}, async(req, username, password, done)=>{
        const usuarios = await newUserContenedor.getUser()
        const usuario = usuarios.filter(usuario => {return usuario.username == username})
        //const usuario = usuarios.find(usuario => usuario.username == username)
        if(usuario.length != 0){
            return done('Usuario ya registrado')
        }
        const user = {
            username,
            password,
        }
        usuarios.push(user)
        newUserContenedor.saveUser(user)
        return done(null, user)
    }
    ))
//----------------
// Passport Login

passport.use('login', new LocalStrategy(async(username, password, done)=>{
    const usuarios = await newUserContenedor.getUser()
    const user = usuarios.filter(usuario => {return usuario.username == username})
    ///console.log(user[0].password)
    if(!user){
        logger.error("User Not Found")
        return done(null, false)
    }
    if(user[0].password != password){
        logger.error("Wrong Password")
        return done(null, false)
    }
    return done(null, user)
}))

//Serializar, y deserializar
passport.serializeUser(function(user, done){
    done(null, user[0].username)
})
passport.deserializeUser(async function(username, done){
    const usuarios = await newUserContenedor.getUser()
    const usuario = usuarios.filter(usuario => usuario.username == username)
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
    logger.info(req.session.nombre)
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

// Info desafio 12
// DESAFIO 12 /INFO 

const args = process.argv
const pid = process.pid
const processPlatform = process.platform
const nodeVersion = process.version
const pMemory = process.memoryUsage.rss()
const pPath = process.execPath
/////Project folder?

routerProductos.get('/info', async(req, res)=>{
    const datos = { pid, args, processPlatform, nodeVersion, pMemory, pPath}
    logger.info(datos)
    res.send(datos)
})

routerProductos.get('/infobloq', async(req, res)=>{
    const datos = { pid, args, processPlatform, nodeVersion, pMemory, pPath}
    console.log(datos)
    res.send(datos)
})

routerProductos.get('/infozip', compression(),(req, res)=>{
    const datos = { pid, args, processPlatform, nodeVersion, pMemory, pPath}
    logger.info(datos)
    res.send(datos)

})

// Randoms
routerProductos.get('/randoms', (req, res)=>{
    const numToCalc = req.query.cant || 1000000;
    const computo = fork(path.resolve(process.cwd(), 'computo.js'))
    computo.on('message', resultado =>{
        if(resultado === 'listo'){
            //computo.send('start')
            computo.send(numToCalc)
        } else {
            res.json({resultado})
        }
    })

})

routerProductos.get('/randomszip', compression(),(req, res)=>{
    const numToCalc = req.query.cant || 1000000;
    const computo = fork(path.resolve(process.cwd(), 'computo.js'))
    computo.on('message', resultado =>{
        if(resultado === 'listo'){
            //computo.send('start')
            computo.send(numToCalc)
        } else {
            res.json({resultado})
        }
    })

})


// Carga de router
app.use("/", routerProductos)

//Levantar Server
const server = app.listen(puerto, ()=>{
    logger.info(`servidor escuchando ${server.address().port}`)
})
server.on("error", error => console.log("error" + error))

}
