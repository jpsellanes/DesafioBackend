const socket = io.connect()

function nuevaHora(){
    const today = new Date()
    let todayTime = today.getFullYear() +"-"+ today.getMonth() +"-"+ today.getDate() +"-"+ today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds()
    return todayTime
}
horaDelMensaje="";

function addMessage(e){
    horaDelMensaje = nuevaHora()
    const message = {
        author: document.getElementById('username').value,
        message: document.getElementById('text').value, 
        horaMensaje: nuevaHora()
    }
    socket.emit("new-message", message);
    return false
}
//Recibir
function render(data){
    const html = data.map((elem, index)=>{
        return(`
        <div>
            <strong style="color:blue">${elem.author}</strong>>
            <p style="color:brown">${elem.horaMensaje}</p>
            <p style="font-style:italic; color:green">${elem.message}</p>
            <hr>
        </div>`)
    }).join(" ")
    document.getElementById("messages").innerHTML = html
}

function addProduct(e){
    const producto = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
    }
    e.querySelector("#title").value=""
    e.querySelector("#price").value=""
    e.querySelector("#thumbnail").value=""
    e.querySelector("#title").focus();

    socket.emit("new-product", producto);
    return false

}

async function showProductList(){
    await fetch("http://localhost:8080/productos")
    .then((res) => res.json())
    .then((data)=>{
        const html = data.map((elem, index)=>{
            return(`
            <div>
                <tr>${elem.title}</tr>
                <tr>${elem.price}</tr>
                <tr>${elem.thumbnail}</tr>
            </div>
            `)
            }).join(" ")
            document.getElementById("listaProductos").innerHTML = html
    })
}


socket.on("productos", function(){showProductList()})
socket.on("messages", function(data){ render(data)})