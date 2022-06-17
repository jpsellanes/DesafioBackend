const mongoose = require('mongoose')

const productCollection = 'productos'

const productSchema = new mongoose.Schema({
    title:{type: String, required:true},
    price:{type: Number, required:true},
    id:{type: Number, required:true},
})

const productos = mongoose.model(productCollection, productSchema)
module.exports = {productos}

