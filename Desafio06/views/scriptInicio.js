//Primera Linea
const socket = io.connect();
//Enviar un mensaje de clienta al server
function addMessage(e){
    const message = {
        author: document.getElementById('username').value,
        message: document.getElementById('text').value,
    }

    socket.emit("new-message", message);
    return false
}
//Recibir
function render(data){
    const html = data.map((elem, index)=>{
        return(`
        <div>
            <strong>${elem.author}</strong>
            <strong>${elem.message}</strong>
        </div>`)
    }).join(" ")
    document.getElementById("messages").innerHTML = html
}

socket.on("messages", function(data){ render(data)})
