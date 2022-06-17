//Se va a emplear mongo para los productos
const mongoose = require("mongoose") ;
const { title } = require("process");
const models = require('../models/schemaProducts.js')

mongo()

async function mongo(){
    //////Se hace la parte de la conexion a mongoDB Atlas ////////
    try{
        const URL = "mongodb+srv://coderhouse:coderhouse@cluster0.wbfib.mongodb.net/?retryWrites=true&w=majority"
        let conexion = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Conexion Atlas MongoDB OK!")
    } catch(err){
        console.log("Connection Erro>: " + err)
    }
}

module.exports = class ContenedorproductosDB{
    constructor(){
        this.model = models.productos
    }
    async showAll(){
        try{
            const items = await this.model.find()
            return items
        }
        catch(err){
            console.log("show all error " + err)
        }
    }
    async showById(id){
        try{
            const item = await this.model.findById(id)
            return item
        }
        catch(err){
            console.log("show by Id error :" + err)
        }
    }
    async deleteById(id){
        try{
            const deleteById = await this.model.findByIdAndDelete(id)
        }
        catch(err){
            console.log("error deletebyId " + err)
        }
    }

    async updateById(productID, {title,price,id}){
        try{
            const updatedById = await this.model.findOneAndUpdate({id: productID},{title: title, price: price, id:id})
            return updatedById
        }
        catch(err){
            console.log("updatebyId error: "+err)
        }
    }
    async save(product){
        try{
            const newProduct = {
                title: product.title,
                price: product.price,
                id: product.id
            }
            const saveNewProduct = await this.model.insertMany(newProduct)
            return saveNewProduct
        }
        catch(err){
            console.log("Error SaveMongo " + err)
        }
    }
}








