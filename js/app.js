//Selectores
const listaProductos = document.querySelector("#listaProducto");
const tableCarrito = document.querySelector('#lista-carrito tbody');
const btnVaciarCarrito = document.querySelector('#vaciar-carrito');

// Oyentes

document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    actualizarCarritoHTML();
    
    compraProductos(productos);
})

listaProductos.addEventListener('click', agregarProducto);
btnVaciarCarrito.addEventListener('click', vaciarCarrito);

function vaciarCarrito (e){
    e.preventDefault();

    // Vaciar carrito
    carrito = [];

    // Actualizaciones
    actualizarCarritoHTML();
    actualizarStorage();
}

function agregarProducto(e) {
	e.preventDefault();

    if(e.target.classList.contains("agregar-carrito")) {
        const productCard = e.target.parentElement.parentElement;
        
        const productoAgregado = {
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


        //Actualizo la tabla de carrito
        actualizarCarritoHTML();
    }
}

function actualizarCarritoHTML(){
    tableCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const column = document.createElement('ul');

        const {nombre, precio, cantidad, id } = producto
        column.innerHTML = `
            <li class="nombre">
                ${nombre}
            </li>
            <li>
                ${precio}
            </li>
            <li>
                ${cantidad}
            </li>
        `

        tableCarrito.append(column);
    })
}

function actualizarStorage () {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function compraProductos(productos) {
    listaProductos.innerHTML = ''

    productos.forEach(producto => {
        const html = `
			<div id="product">
                    <img src="${producto.imagen}" class="imagen-producto">
                    <div class="detalle">
                        <h4>${producto.nombre}</h4>
                        <p class="precio">${producto.precio}</p>
                        <a href="#" class="agregar-carrito" data-id="${producto.id}">Agregar al carrito</a>
                    </div>
			</div>
        `
        listaProductos.innerHTML += html
    });

    console.log(productos)
}