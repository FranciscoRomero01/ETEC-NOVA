// Selectores
const listaProductos = document.querySelector("#listaProducto");
const tableCarrito = document.querySelector('#lista-carrito tbody');
const formBuscador = document.querySelector('#formulario');

// Oyentes

$("#listaProducto").click(agregarProducto);
$("#samsung").click(selecionarSamsung);
$("#motorola").click(selecionarMotorola);
$("#lg").click(selecionarLG);
$("#todos").click(selecionarTodos);
$("#mostrarMenorMayor").click(mostrarMenorMayor);
$("#mostrarMayorMenor").click(mostrarMayorMenor);
$("#mostrarPorMarca").click(mostrarPorMarca);
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

function selecionarSamsung(e) {
    e.preventDefault();

    //Mostrar solo samsung

    const mostrarSamsung = productos.filter(productos => productos.id < 6);

    console.log(mostrarSamsung);
    compraProductos(mostrarSamsung);
}

function selecionarMotorola(e) {
    e.preventDefault()

    //Mostrar solo motorola

    const mostrarMotorola = productos.filter(productos => productos.id > 5 && productos.id < 11);

    console.log(mostrarMotorola);
    compraProductos(mostrarMotorola);
}

function selecionarLG(e) {
    e.preventDefault()

    //Mostrar solo Lg

    const mostrarLg = productos.filter(productos => productos.id > 10 && productos.id < 16);

    console.log(mostrarLg);
    compraProductos(mostrarLg);
}

function selecionarTodos(e) {
    e.preventDefault();

    // Mostrar todos

    const mostrarTodos = productos.filter(productos => productos.id < 16);

    compraProductos(mostrarTodos);
}

function mostrarMenorMayor(e) {
    e.preventDefault();

    productos.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) {
          return -1;
        }
        return 0;
    });

    compraProductos(productos);
}

function mostrarMayorMenor(e) {
    e.preventDefault();

    productos.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) {
          return -1;
        }
        return 0;
    });

    compraProductos(productos);
}

function mostrarPorMarca(e) {
    e.preventDefault();

    productos.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
    });

    compraProductos(productos);
}

// Carrito

$("#vaciar-carrito").click(vaciarCarrito);
tableCarrito.addEventListener('click', eliminarProducto);

function eliminarProducto(e) {
	e.preventDefault();
	if (e.target.nodeName === "IMG") {
		// Borrar el producto del arreglo carrito
		const id = e.target.closest('a').dataset.id;

		const carritoFiltrado = carrito.filter(producto => producto.id !== id);
		carrito = [...carritoFiltrado];

		// Actualizaciones
		actualizarCarritoHTML();
		actualizarStorage();
	}
}

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
                <img class="imagen" src="${imagen}">
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
            <li>
                <a><img id="borrarProducto" class="borrar-producto" data-id="${id}" src="https://img.icons8.com/ios-glyphs/20/000000/trash--v1.png"/></a>
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

// Confirmar compra

$('#confirmarCompra').click(confirmarCompra);

function confirmarCompra(e) {
    e.preventDefault()

    alert("Compra confirmada!");
}

// Animaciones

$('#titulo').delay(500)
            .slideDown(1000);


$('#mostrarMayorMenor').slideToggle(1);
$('#mostrarMenorMayor').slideToggle(1);
$('#ocultarOrdenadores').slideToggle(1);

$('#mostrarOrdenadores').click(mostrarOrdenadores);
            
function mostrarOrdenadores(){
    $('#mostrarMayorMenor').slideToggle(500);
    $('#mostrarMenorMayor').slideToggle(500);

    $('#mostrarOrdenadores').fadeOut(1);
    $('#ocultarOrdenadores').fadeIn();
}

$('#ocultarOrdenadores').click(ocultarOrdenadores);

function ocultarOrdenadores(){
    $('#mostrarMayorMenor').slideToggle(500);
    $('#mostrarMenorMayor').slideToggle(500);
    $('#ocultarOrdenadores').slideToggle(1);

    $('#mostrarOrdenadores').fadeIn();
}

// Usuario

console.log(localStorage.usuario);