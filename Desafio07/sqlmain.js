const knex = require("knex")

class ClienteSQL {
    constructor(options){
        this.knex = knex(options)
    }
    crearTabla(){
        return this.knex.schema.dropTableIfExists('articulos')
            .finally(()=>{
                return this.knex.schema.createTable("articulos", table=>{
                    table.increments('id').primary()
                    table.string('title', 50).notNullable
                    table.string('thumbnail',50).notNullable
                    table.float('price').notNullable
                    //table.integer('idproduct')
                })
            })
    }
    insertarProductos(articulos){
        return this.knex('articulos').insert(articulos)
    }
    /*actualizarStockPorID(stock, id){
        return this.knex('mensajes').where('id', id).update({stock: stock})
    }*/
    listarProductos(){
        return this.knex('articulos').select('*')
    }
    borrarProductosPorID(id){
        return this.knex.from('articulos').where('id',id).del()
    }
    close(){
        this.knex.destroy()
    }
}
module.exports = ClienteSQL