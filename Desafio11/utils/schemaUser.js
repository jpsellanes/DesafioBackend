const mongoose = require('mongoose')

const prodCollection = 'users'

const prodSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
})

const usersSchema = mongoose.model(prodCollection, prodSchema)

module.exports = usersSchema