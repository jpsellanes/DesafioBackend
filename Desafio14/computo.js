
function calculo(num){
    let arrayRepetido = {}
    let arrayOrdenado = {}
    let listAux = []
    for (i = 0; i<num+1; i++){
        let rndNumber = Math.floor(Math.random()*1000)
        listAux.push(rndNumber)
    }
    listAux.forEach(function(x){arrayOrdenado[x] = (arrayOrdenado[x]||0)+1})
    for(let num in arrayOrdenado){
        if(arrayOrdenado[num]>1)
        arrayRepetido[num] = arrayOrdenado[num]
    }
    return {...arrayOrdenado, "------------------": "-------------", arrayRepetido}
}


process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', msg => {
    console.log(`worker #${process.pid} iniciando su tarea`)
    process.send(calculo(msg))
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})

process.send('listo')

