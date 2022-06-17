const admin = require("firebase-admin");
const serviceAccount = require("../db/backend-2747c-firebase-adminsdk-rdfbs-31eb704f25.json");

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const {json} = require('express')
const db = admin.firestore()

module.exports = class cartDB {
    constructor(){
        this.collection = db.collection('carrito')
    }

    async getAllcarts(){
        try{
            const carts = await this.collection.get()
            const data = []
            carts.forEach((doc)=> data.push(doc.data()))
            return data
        }
        catch(err){
            console.log("error en getallcarts "+err)
        }
    }
    async addCart(obj){
        try{
            const carts = await this.collection.add(obj)
            return carts
        }
        catch(err){
            console.log("Error Add cart: " +err)
        }
    }
    async getCartById(id){
        try{
            const cart = await this.collection.doc(id).get()
            return cart.data()
        }
        catch(err){
            console.log("error getCartById "+err)
        }
    }

    async updateCartById(id, cartContent){
        try{
            const selectedCart = await this.collection.doc(id).set(cartContent)
            return selectedCart
        }
        catch(err){
            console.log("error " + err)
        }
    }

    async deleteCartById(id){
        try{
            const carts = await this.collection.doc(id).delete()
            return carts
        }
        catch(err){
            console.log("error deleteCartById "+err)
        }
    }
    
}