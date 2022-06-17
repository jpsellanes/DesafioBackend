const fs = require('fs')

//Se declara la clase Contenedor
module.exports = class cartContenedor {
    constructor(filename){
        this.filename = filename;
    }

    async save(obj){
    //Funcion Save, guarda un nuevo objecto en el archivo
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            const contenidoViejo = JSON.parse(data)
            //Se evalua si hay duplicado
            let found = false;
            for(var i = 0; i< contenidoViejo.length; i++){
                if(contenidoViejo[i].cartID == obj.title){
                    found = true
                    break;
                }
            }
            if(found == false){//Item no existe
                obj.cartID = contenidoViejo.length + 1 //Se pone un ID provisorio
                //Se busca el numero de ID maximo
                let IdsArray = contenidoViejo.map(a => a.id)
                let maxID = Math.max(...IdsArray)
                //Check ID si esta repetido y corrige si es necesario, en caso de borrar varios productos
                //Se pueden solapar los IDs, entonces se elige el IDmaximo + 1 como ID nuevo de ser necesario
                if(maxID >= obj.cartID){
                    obj.cartID = maxID + 1;
                }
                const today = new Date()
                let todayTime = today.getFullYear() +"-"+ today.getMonth() +"-"+ today.getDate() +"-"+ today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds()
                //console.log(JSON.stringify(todayTime))
                obj.cartTime = todayTime 
                contenidoViejo.push( obj )
                let contenidoNuevo = contenidoViejo
                //console.log(`Contenido Nuevo: ${contenidoNuevo}`)
                //console.log("Product ID = " + obj.id)
                // Se guarda el File
                return await fs.promises.writeFile('./'+ this.filename , JSON.stringify(contenidoNuevo, null, 2))

            } else if(found == true) {      //Item Repetido
                console.log("This Product Already Exist")
            }
        }
        catch(err){
            console.log("ERROR with Save ->" + err)
        }
    }

    async updateById(idNumber, newData){
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            const contenidoParseado = JSON.parse(data);
            console.log("la neuva dataes "+newData)
            console.log("la nueva data typeofs" + typeof(newData))
            let prodIndex = contenidoParseado.findIndex(productos => productos.id == idNumber);
            if(prodIndex != undefined){
                console.log("nueva data pa update " + newData + "el index sera " + prodIndex)
                contenidoParseado[prodIndex].title = newData.productoTitle
                contenidoParseado[prodIndex].price = newData.productoPrice
                console.log("El producto actualizado se debe ver asi " + contenidoParseado[prodIndex])
                return await fs.promises.writeFile('./'+ this.filename , JSON.stringify(contenidoParseado, null, 2))
            } else {
                console.log("Product Not Found for Update!")
                return "Producto No Encontrado para Update"
            }
        }catch(err){
            console.log("Error with UpdateByID " + err)
        }
    }

    async getById(idNumber){
    //Trae el item segun su ID unico
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            const contParsed = JSON.parse(data);
            let cartIndexById = contParsed.findIndex(a => a.cartID == idNumber);
            let cartByIndex = contParsed.find(a => a.cartID == idNumber);
            if(cartByIndex != undefined){
                return contParsed[cartIndexById].cartContent
            } else {
                console.log("Cart Not Found!")
                return "Producto No Encontrado"
            }
        } catch(err){
            console.log("ERROR with GetById-> " + err)
        }
    }
    async postProductById(carritoID, prodID, prodToPush){
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            const contParsed = JSON.parse(data);
            let cartIndexById = Array.from(contParsed).findIndex(a=>a.cartID == carritoID)
            let cartByIndex = Array.from(contParsed).find(a =>a.cartID == carritoID)
            if(cartByIndex != undefined){
                let prodIsHere = Array.from(contParsed[cartIndexById].cartContent).find(a=>a.id == prodID)
                if(prodIsHere == undefined){
                    let newContParse = contParsed[cartIndexById].cartContent.push(prodToPush)
                    await fs.promises.writeFile('./'+ this.filename , JSON.stringify(contParsed, null, 2))
                    return contParsed
                }else{
                    console.log("Product Already on Cart do x")
                    return "Product Already on Cart do x"
                }
            }else{
                console.log("CartNoEncontrado")
                return "CartNoEncontrado"
            }
        }catch(err){
            console.log("Error at updateProductByID: " + err)
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

    async deleteById(idNumber){
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            const contParsed = JSON.parse(data);
            let prodPorId = contParsed.find(a => a.cartID == idNumber);
            if(prodPorId != undefined){
                let prodListIndex = contParsed.findIndex(a => a.cartID == idNumber)
                contParsed.splice(prodListIndex,1)
                //console.log(contParsed) //Guardar el archivo
                await fs.promises.writeFile('./'+ this.filename, JSON.stringify(contParsed, null, 2)) //ojo este await
            } else {
                console.log("Product Not Found!")
            }
        } catch(err){
            console.log("ERROR at Delete by ID" + err)
        }
    }

    async deleteProductById(idDelCart, productID){
        try{
            let data = await fs.promises.readFile('./'+ this.filename)
            const contParsed = JSON.parse(data);
            let cartPorId = contParsed.find(a => a.cartID == idDelCart); //Se encuentra el Cart
            if(cartPorId != undefined){
                let cartIndex = contParsed.findIndex(a => a.cartID == idDelCart)
                //Encontrado el Cart index, hay que buscar el product
                let cartProductPorId = contParsed[cartIndex].cartContent.find(a =>a.id == productID)
                if(cartProductPorId != undefined){
                    let cartContentIndex = contParsed[cartIndex].cartContent.findIndex(a =>a.id == productID);
                    contParsed[cartIndex].cartContent.splice(cartContentIndex,1)
                    await fs.promises.writeFile('./'+ this.filename, JSON.stringify(contParsed, null, 2)) //ojo este await
                } else {
                    console.log("Producto No encontrado")
                }
                } else {
                console.log("Cart Not Found!")
            }
        } catch(err){
            console.log("ERROR at Delete P by ID" + err)
        }
    }
    async nuevaHora(){
        try{
            const today = new Date()
            let todayTime = today.getFullYear() +"-"+ today.getMonth() +"-"+ today.getDate() +"-"+ today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds()
        return todayTime
        }catch(err){
            console.log("Problema con nuevaHora"+ err)
        }
    }

}