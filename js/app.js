// Selectores
const listaProductos = document.querySelector("#listaProducto");
const tableCarrito = document.querySelector('#lista-carrito tbody');

// Oyentes

$("#listaProducto").click(agregarProducto);
$("#vaciar-carrito").click(vaciarCarrito);

// Productos

let productos;
let mensaje = [];

document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    actualizarCarritoHTML();
    
    $.ajax({
		url: 'js/productos.json',
		success: function (productosJSON, textStatus, xhr) {
			productos = productosJSON;
			compraProductos(productos);
		},
		error: function (xhr, textStatus, error) {
			console.log(xhr);
			console.log(textStatus);
			console.log(error);
		}
	});
})

function compraProductos() {
    listaProductos.innerHTML = ''

    productos.forEach(productos => {
        const html = `
			<div id="product">
                    <a href="#" id="agregarCarrito" data-id="${productos.id}"><img src="${productos.imagen}" class="imagen-producto"><button class="agregar-carrito">Agregar al carrito</button></a>
                    <div class="detalle">
                        <h4>${productos.nombre}</h4>
                        <p class="precio">${productos.precio}</p>
                    </div>
			</div>
        `
        listaProductos.innerHTML += html
    });

    console.log(productos);
}

function agregarProducto(e) {
	e.preventDefault();

    if(e.target.classList.contains("agregar-carrito")) {
        const productCard = e.target.parentElement.parentElement;
        
        const productoAgregado = {
            imagen: productCard.querySelector('img.imagen-producto').src,
            nombre: productCard.querySelector('h4').textContent,
            precio: productCard.querySelector('p').textContent,
            cantidad: 1,
            id: productCard.querySelector('a').dataset.id
        }

        const existe = carrito.some( producto => producto.id === productoAgregado.id);

        if(existe) {
            const nuevoCarrito = carrito.map( producto => {
                if(producto.id === productoAgregado.id) {
                    producto.cantidad++;
                }
                return producto;
            })
            carrito = [... nuevoCarrito];
        } else {
            carrito.push(productoAgregado); 
        }

        //Animacion de Carrito 
        /*$("#carrito").animate({height: "+=100px"});*/

        //Actualizo la tabla de carrito
        actualizarCarritoHTML();
    }
}

//Carrito

function vaciarCarrito (e){
    e.preventDefault();

    // Vaciar carrito
    carrito = [];

    // Actualizaciones
    actualizarCarritoHTML();
    actualizarStorage();
}

function actualizarCarritoHTML(){
    tableCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const column = document.createElement('ul');

        const {imagen, nombre, precio, cantidad, id,} = producto

        column.innerHTML = `
            <li>
                <img src="${imagen}">
            </li>
            <li class="nombre">
                ${nombre}
            </li>
            <li class="margin">
                ${precio}
            </li>
            <li>
                ${cantidad}
            </li>
            <li>
                ${precio}
            </li>
        `

        tableCarrito.append(column);
    })
}

function actualizarStorage () {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

$('#abrirCarrito').click(abrirCarrito);
$('#cerrarCarrito').click(cerrarCarrito);

function abrirCarrito(){
    document.querySelector("#carrito").style.height="50%";
}

function cerrarCarrito(e){
    e.preventDefault();
    
    document.querySelector("#carrito").style.height="0%";
}

// Animaciones

$('#titulo').delay(500)
            .slideDown(1000);

