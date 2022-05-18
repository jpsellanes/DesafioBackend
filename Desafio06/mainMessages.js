const fs = require('fs')

module.exports = class messageContenedor {
    constructor(filename){
        this.filename = filename;
    }

    async save(obj){
    //Funcion Save, guarda un nuevo objecto en el archivo
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            //Leer antes de cambiar, tengo que tranformarlos a algo que me sea mas facil modificar
            const contenidoViejo = JSON.parse(data) //json.parse(data)
            contenidoViejo.push(obj)
            //let contenidoNuevo = contenidoViejo
            // Se guarda el File
            return await fs.promises.writeFile('./'+ this.filename , JSON.stringify(contenidoViejo, null, 2))
        }
        catch(err){
            console.log("ERROR with Save ->" + err)
        }
    }
}