const knex = require("knex")

class ClienteDB {
    constructor(options){
        this.knex = knex(options)
    }
    crearTabla(){
        return this.knex.schema.dropTableIfExists('mensajes')
            .finally(()=>{
                return this.knex.schema.createTable("mensajes", table=>{
                    table.increments('id').primary()
                    table.string('author', 50).notNullable
                    table.text('message').notNullable
                    table.string('horaMensaje',30).notNullable
                })
            })
    }
    insertarMsgS(mensajes){
        return this.knex('mensajes').insert(mensajes)
    }
    /*actualizarStockPorID(stock, id){
        return this.knex('mensajes').where('id', id).update({stock: stock})
    }*/
    listarMsgs(){
        return this.knex('mensajes').select('*')
    }
    borrarMsgPorID(id){
        return this.knex.from('mensajes').where('id',id).del()
    }
    close(){
        this.knex.destroy()
    }
}
module.exports = ClienteDB