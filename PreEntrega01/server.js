const express = require("express")
const {Router} = express
const contenedor = require('./main.js')
const Newcontenedor = new contenedor('productos.json')

const cartContenedor = require('./mainCart.js')
const NewCart = new cartContenedor('carrito.json')

const app = express()

//APP
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')


//Router
const routerProductos = new Router()
const routerCart = new Router()


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
routerProductos.put('/productos/id', async(req, res)=>{
    let productId = req.query.id
    await Newcontenedor.updateById(productId, req.body)
    res.send(await Newcontenedor.getById(productId))
    //res.render('productos', {productos})
})
routerProductos.get('/productos/id', async(req, res)=>{
    let productId = req.query.id
    res.send(await Newcontenedor.getById(productId))
})
routerProductos.delete('/productos/id', async(req, res)=>{
    let productId = req.query.id
    await Newcontenedor.deleteById(productId)
    res.send(await Newcontenedor.getAll())
})

////////////CARRITO
routerCart.get('/carrito', async(req,res)=>{
    res.send(await NewCart.getAll())
})
routerCart.post('/carrito', async(req,res)=>{
    await NewCart.save(req.body)
    res.send(await NewCart.getAll())
})
routerCart.delete('/carrito/id', async(req,res)=>{
    let carritoID = req.query.id
    NewCart.deleteById(carritoID)
    res.send(await NewCart.getAll())
})
routerCart.delete('/carrito/:id/productos/:id_prod', async(req,res)=>{
    let carritoID = req.params.id
    let productID = req.params.id_prod
    console.log("carritoID"+ carritoID +"prodID"+productID)
    NewCart.deleteProductById(carritoID, productID)
    res.send(await NewCart.getAll())
})

routerCart.get('/carrito/:id/productos', async(req,res)=>{
    let carritoID = req.params.id
    res.send(await NewCart.getById(carritoID))
})
routerCart.post('/carrito/:id/productos/:prodID', async(req,res)=>{
    let carritoID = req.params.id
    let prodID = req.params.prodID
    prodToPush = await Newcontenedor.getById(prodID)
    console.log("prodToPush"+JSON.stringify(prodToPush))
    res.send(await NewCart.postProductById(carritoID, prodID, prodToPush))
    //res.send(await NewCart.getAll())
})

///:id/productos/:id_prod

// Carga de router
app.use("/", routerProductos)
app.use("/", routerCart)


//Levantar Server
const PORT = 8080
const server = app.listen(PORT, ()=>{
    console.log(`servidor escuchando ${server.address().port}`)
})
server.on("error", error => console.log("error" + error))



/*
El router base '/api/productos' implementará cuatro funcionalidades:
****GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
****POST: '/' - Para incorporar productos al listado (disponible para administradores)
----PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)
****DELETE: '/:id' - Borra un producto por su id (disponible para administradores)

El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:
****POST: '/' - Crea un carrito y devuelve su id.
****DELETE: '/:id' - Vacía un carrito y lo elimina.
****GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
****DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
*/