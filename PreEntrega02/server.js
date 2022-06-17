const express = require("express")
const {Router} = express
const contenedor = require('./main.js')
const Newcontenedor = new contenedor('productos.json')

const cartContenedor = require('./mainCart.js')
const NewCart = new cartContenedor('carrito.json')

const contenedorCartDB = require('./contenedores/cartDB.js')
const newCartDB = new contenedorCartDB()

const productosDBconte = require('./contenedores/productsDB.js')
const newProdDB = new productosDBconte()

const app = express()

//Login
const loggedAsAdmin = true;

//APP
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')

//Router
const routerProductos = new Router()
const routerCart = new Router()


routerProductos.get('/', async(req, res)=>{
    prodDB = await newProdDB.showAll()
    res.send(prodDB)
})
routerProductos.post('/productos', async(req, res)=>{
    if(loggedAsAdmin == true){
        await newProdDB.save(req.body)
        res.send("Producto "+ JSON.stringify(req.body) +" enviado")
    }else{
        res.status(401).send('No Autorizado')
    }
})

routerProductos.put('/productos/:id', async(req, res)=>{
    if(loggedAsAdmin == true){
        let productId = req.params.id
        await newProdDB.updateById(productId, req.body) ///Funciona con el Product ID
        res.send(await newProdDB.showAll())
    }else{
        res.status(401).send('No Autorizado')
    }
})
routerProductos.get('/productos/:id', async(req, res)=>{
    let productId = req.params.id
    res.send(await newProdDB.showById(productId)) //funciona con el ID propio de mongoDB
})
routerProductos.delete('/productos/:id', async(req, res)=>{
    if(loggedAsAdmin == true){
        let productId = req.params.id
        await newProdDB.deleteById(productId)
        res.send(await newProdDB.showAll())
    }else{
        res.status(401).send('No Autorizado')
    }
    
})

////////////CARRITO
routerCart.get('/carrito', async(req,res)=>{
    res.send(await newCartDB.getAllcarts())
})
routerCart.post('/carrito', async(req,res)=>{
    await newCartDB.addCart(req.body)
    res.send(await newCartDB.getAllcarts())
})
routerCart.delete('/carrito/:id', async(req,res)=>{
    let carritoID = req.params.id
    newCartDB.deleteCartById(carritoID)
    res.send(await newCartDB.getAllcarts())
})

routerCart.get('/carrito/:id', async(req,res)=>{
    let carritoID = req.params.id
    res.send(await newCartDB.getCartById(carritoID))
})

// Carga de router
app.use("/", routerProductos)
app.use("/", routerCart)

//Levantar Server
const PORT = 8080
const server = app.listen(PORT, ()=>{
    console.log(`servidor escuchando ${server.address().port}`)
})
server.on("error", error => console.log("error" + error))
