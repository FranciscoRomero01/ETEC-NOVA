// Selectores
const listaProductos = document.querySelector("#listaProducto");
const tableCarrito = document.querySelector('#lista-carrito tbody');
const formBuscador = document.querySelector('#formulario');

// Oyentes

$("#listaProducto").click(agregarProducto);
formBuscador.addEventListener('submit', buscarProductos);

// Productos

let productos;
let carrito = [];


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

function compraProductos(listadoProductos) {
    listaProductos.innerHTML = ''

    listadoProductos.forEach(productos => {
        const html = `
			<div id="product">
                    <a href="#" id="agregarCarrito" data-id="${productos.id}"><img src="${productos.imagen}" class="imagen-producto"><button class="agregar-carrito">Agregar al carrito</button></a>
                    <div class="detalle">
                        <h4>${productos.nombre}</h4>
                        <div>
                            <span class="precio">$</span><p class="precio">${productos.precio}</p>
                        </div>
                    </div>
			</div>
        `
        listaProductos.innerHTML += html
    });

    console.log(productos);
    totalCarrito();
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

        //Actualizaciones
        totalCarrito();
        actualizarCarritoHTML();
        actualizarStorage();
    }
}

function buscarProductos(e) {
	e.preventDefault();

	// Leer el texto del input
	const inputBuscador = document.querySelector('#buscador').value;
    const inputFiltrado = inputBuscador.toLowerCase().trim();
	
    const resultado = productos.filter( productos => productos.nombre.toLowerCase().includes(inputFiltrado));

	console.log(resultado);
    compraProductos(resultado);
	formBuscador.reset();
}

//Carrito

$("#vaciar-carrito").click(vaciarCarrito);

function vaciarCarrito (e){
    e.preventDefault();

    // Vaciar carrito
    carrito = [];

    // Actualizaciones
    totalCarrito();
    actualizarCarritoHTML();
    actualizarStorage();
}

function actualizarCarritoHTML(){
    tableCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const column = document.createElement('ul');

        const {imagen, nombre, precio, cantidad, id} = producto
        const total = Number(precio) * Number(cantidad) * 1000;

        column.innerHTML = `
            <li>
                <img src="${imagen}">
            </li>
            <li class="nombre">
                ${nombre}
            </li>
            <li class="margin">
                $${precio}
            </li>
            <li>
                ${cantidad}
            </li>
            <li>
                $${total}
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

// Calculando total del carrito

const total = document.querySelector('#totalCarrito');

function totalCarrito(){
    let tPrecio = 0;
    total.innerHTML = ''


    carrito.forEach((e) => {
      tPrecio =
        tPrecio + Number(e.cantidad) * Number(e.precio) * 1000;
    });
  
    const totalCompra = document.createElement('ul')

    totalCompra.innerHTML = `
        <li class="lista">Total</li>
        <li id="totalCompra" class="lista"> $${tPrecio}</li>
    `
    total.append(totalCompra)

    console.log("Total del Carrito es: ", tPrecio);
    return tPrecio;
};

// Animaciones

$('#titulo').delay(500)
            .slideDown(1000);

