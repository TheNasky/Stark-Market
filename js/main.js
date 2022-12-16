fetch("./js/productos.json")
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        programa(data)
    })


function programa(data){

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias= document.querySelectorAll(".boton-categoria");
const tituloPrincipal= document.querySelector("#titulo-principal");
let botonesAgregar= document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

function cargarProductos(productosElejidos) {
    contenedorProductos.innerHTML= "";
    productosElejidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
        
    })
    actualizarBotonesAgregar()
}
cargarProductos(data);



botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        
        botonesCategorias.forEach(boton =>{ boton.classList.remove("active")})
        e.currentTarget.classList.add("active");

        if(e.currentTarget.id !="Todos"){
            const productosBoton = data.filter(producto => producto.categoria.id=== e.currentTarget.id);
            cargarProductos(productosBoton);
            tituloPrincipal.innerText= productosBoton[0].categoria.nombre
        }else{
            cargarProductos(data);
            tituloPrincipal.innerText= "Todos Los Productos";
        }
        
    })
})

function actualizarBotonesAgregar(){
    botonesAgregar= document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton =>{
        boton.addEventListener("click", agregarAlCarrito);
    })
}

let productosCarrito
const productosCarritoLS = localStorage.getItem("productos-en-carrito")
if(productosCarritoLS){
    productosCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"))
}else{
    productosCarrito= [];
}
actualizarNumerito()


function agregarAlCarrito(e){
    const idBoton = e.currentTarget.id;
    const productoAgregado=data.find(producto => producto.id===idBoton);

    if(productosCarrito.some(producto => producto.id===idBoton)){
        const index = productosCarrito.findIndex(producto => producto.id===idBoton);
        productosCarrito[index].cantidad++;
    }else{
        productoAgregado.cantidad = 1
        productosCarrito.push(productoAgregado);
    }
    actualizarNumerito()
    let titulo = data.find(producto => producto.id===idBoton)
    Toastify({

        text: `Agregaste "${titulo.titulo}" al carrito`,
        duration: 3000,
        style: {
            background: "linear-gradient(90deg, rgba(27,78,209,1) 0%, rgba(27,136,237,1) 95%, rgba(27,148,237,1) 100%)",

          },
        className:"tosti",
        offset: {
            y: 1 // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        }).showToast();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosCarrito));
}   

function actualizarNumerito(){
     let cantidadProductos = 0
     productosCarrito.forEach(producto => cantidadProductos=cantidadProductos + producto.cantidad)
     numerito.innerHTML=cantidadProductos;
     
}
}