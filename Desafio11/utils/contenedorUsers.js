const mongoose = require('mongoose')
const models = require('./schemaUser')

mongoose.connect('mongodb+srv://coderhouse:coderhouse@cluster0.wbfib.mongodb.net/?retryWrites=true&w=majority')

class userContenedor {
    constructor(){
        this.collection = models
    }
    async saveUser({username, password}){
        const newUser ={
            username: username,
            password: password,
        }
        return await this.collection.insertMany(newUser)
    }
    async getUser(){
        return await this.collection.find()
    }
}

module.exports = userContenedor