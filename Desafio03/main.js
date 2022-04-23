const fs = require('fs')

//Se declara la clase Contenedor
module.exports = class contenedor {
    constructor(filename){
        this.filename = filename;
    }

    save(obj){
    //Funcion Save, guarda un nuevo objecto en el archivo
        fs.promises.readFile('./'+ this.filename)
            .then(data =>{
                //Leer antes de cambiar, tengo que tranformarlos a algo que me sea mas facil modificar
                const contenidoViejo = JSON.parse(data)
                console.log(`Contenido Viejo: ${contenidoViejo}`)
                //Ahora se tienen disponibles los datos para modificar
                //Se evalua si hay duplicado
                console.log(obj.title)
                let found = false;
                for(var i = 0; i< contenidoViejo.length; i++){
                    if(contenidoViejo[i].title == obj.title){
                        found = true
                        break;
                    }
                }
                console.log(found)

                if(found == false){             //Item no existe
                    
                    obj.id = contenidoViejo.length + 1 //Se pone un ID provisorio
                    //Se busca el numero de ID maximo
                    let IdsArray = contenidoViejo.map(productos => productos.id)
                    console.log(IdsArray)
                    let maxID = Math.max(...IdsArray)
                    console.log(maxID)
                    //Check ID si esta repetido y corrige si es necesario, en caso de borrar varios productos
                    //Se pueden solapar los IDs, entonces se elige el IDmaximo + 1 como ID nuevo de ser necesario
                    if(maxID >= obj.id){
                        obj.id = maxID + 1;
                    }

                    contenidoViejo.push( obj )
                    let contenidoNuevo = contenidoViejo
                    console.log(`Contenido Nuevo: ${contenidoNuevo}`)
                    console.log("Product ID = " + obj.id)
                    // Se guarda el File
                    return fs.promises.writeFile('./'+ this.filename , JSON.stringify(contenidoNuevo, null, 2))

                } else if(found == true) {      //Item Repetido
                    console.log("This Product Already Exist")
                }
                
            })
            .catch(err=>{
                console.log("ERROR with Save ->" + err)
            })
    }

    getById(idNumber){
    //Trae el item segun su ID unico
        fs.promises.readFile('./'+ this.filename)
        .then(data =>{
            const contenidoParseado = JSON.parse(data);
            let prodPorId = contenidoParseado.find(productos => productos.id === idNumber);
            if(prodPorId !== undefined){
                console.log(prodPorId)
            } else {
                console.log("Product Not Found!")
            }
        })
        .catch(err=>{
            console.log("ERROR with GetById-> " + err)
        })
    }

    async getByIdRandom(){
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            const contenidoParseado = JSON.parse(data);
            let productoRand = contenidoParseado[Math.floor(Math.random()*contenidoParseado.length)]
            return productoRand
        } catch(err){
                console.log("ERROR with GetByIdRandom-> " + err)
            }
        }

    async getAll(){
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            const contParsed = JSON.parse(data);
            //console.log(contParsed)
            return contParsed
        } catch(err){
            console.log("ERROR -> " + err)
        }
    }

    deleteById(idNumber){
        fs.promises.readFile('./'+ this.filename)
        .then(data =>{
            const contParsed = JSON.parse(data);
            let prodPorId = contParsed.find(productos => productos.id === idNumber);
            if(prodPorId !== undefined){
                let prodListIndex = contParsed.findIndex(productos => productos.id === idNumber)
                contParsed.splice(prodListIndex,1)
                console.log(contParsed) //Guardar el archivo
                fs.promises.writeFile('./'+ this.filename, JSON.stringify(contParsed, null, 2))
            } else {
                console.log("Product Not Found!")
            }
        })
    }
    deleteAll(){
        fs.promises.unlink('./'+ this.filename)
        console.log("DATA DELETED")
    }

}

/****** Quitar comentario para Verificar****** */
//newContenedor.save({"title": "resaltador", "price": 340})
//newContenedor.getById(1)
//newContenedor.getById(234324)
//newContenedor.getAll()
//newContenedor.deleteById(2)
//newContenedor.deleteById(1)
//newContenedor.deleteAll()  ////CUIDADO BORRA EL PRODUCTOS.JSON  ////
