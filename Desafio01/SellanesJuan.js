class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName() {
        return console.log("Su Nombre es " + this.nombre + " " + this.apellido);
        
    }

    addMascota(a) {
        this.mascotas.push(a);
    }

    countMascotas() {
        return console.log(this.mascotas.length);
    }
    addBook(book, autor) {
        this.libros.push({nombre: book, autor: autor})
    }
    getBookNames() {
        for(var i = 0; i< this.libros.length; i++) {
            console.log(this.libros[i]["nombre"]);
        }
    }
}

let p1 = new Usuario("juan", "Sellanes", [{nombre: "a", autor: "b"}] , ["lola"])
p1.getFullName()
p1.addMascota("kito")
p1.countMascotas()
p1.addBook("Aerodynamics", "VonKarman")
p1.addBook("Aerodynamics2", "Plotkin")
console.table(p1.libros)
console.log(p1.libros)
console.log(p1.libros[1]["nombre"])
p1.getBookNames()
