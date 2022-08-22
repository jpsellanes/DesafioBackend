const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
//--------
const passport = require("passport")
const {Strategy: LocalStrategy} = require("passport-local")
//--------
const logger = require('./utils/logger.js')
const winston = require('winston')
const cluster = require("cluster")
const os = require("os")
const nodemailer = require('nodemailer')
const twilio = require('twilio')
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'charlene29@ethereal.email',
        pass: 'vrFnebhPq858Q5UnKx'
    }
});

const accountSid ="ACb26d2fe444fa2660b849a944145a8cd5";
const authToken = "5a429a51be96ea3b5806d9561528d70f";
const client = twilio(accountSid, authToken);

//Fork
const {fork} = require('child_process')
const path = require('path')
// ENV y CONFIG
const parseArgs = require('minimist')
const dotenv = require('dotenv').config()

const options = {
    alias: {p:'puerto', m: 'modo'},
    default:{puerto:8080, modo:'fork'}
}

const {puerto} = parseArgs(process.argv.slice(2),options)
const {modo} = parseArgs(process.argv.slice(3),options)
const debug = process.env.DEBUG == "true" ? true : false

console.log({modo, puerto, debug})
/// -----
if((modo =='cluster') && cluster.isPrimary){
    const numCPUs = os.cpus().length
    for(let i =0; i<numCPUs; i++){
        cluster.fork()
    }
    cluster.on('exit', worker=>{logger.info('Worker '+ process.pid + ' ended')
    cluster.fork()
    })
} else {



//---------
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
        logger.info(usuario)
        if(usuario.length != 0){
            return done('Usuario ya registrado')
        }
        const user = {
            username,
            password,
        }
        usuarios.push(user)
        newUserContenedor.saveUser(user)
        let texttosend = "The user " + username + " Has just registered";
        await transporter.sendMail({
            from: 'charlene29@ethereal.email',
            to:'charlene29@ethereal.email',
            subject:'New User Registered',
            text: texttosend,
        })
        await client.messages 
        .create({ 
            body: texttosend, 
            from: 'whatsapp:+14155238886',       
            to: 'whatsapp:+5491126805708' 
        }) 
        .then(message => logger.info(message.sid)) 
        .done();
        return done(null, user)
    }
    ))
//----------------
// Passport Login

passport.use('login', new LocalStrategy(async(username, password, done)=>{
    const usuarios = await newUserContenedor.getUser()
    const user = usuarios.filter(usuario => {return usuario.username == username})
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
routerProductos.get('/wsp', async(req, res)=>{
    client.messages 
      .create({ 
         body: 'Por favor, Apruebeme', 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+5491126805708' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
})

routerProductos.get('/mail', async(req, res)=>{
    await transporter.sendMail({
        from: 'charlene29@ethereal.email',
        to:'sellanes_juan_pablo@hotmail.com',
        subject:'New User Registered',
        text: "Este es un mail de prueba",
    })
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

const server = app.listen(process.env.PORT || 8080, ()=>{
    logger.info("Ok Corriendo")
})
server.on("error", error => logger.error("error" + error))
}
