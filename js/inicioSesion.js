const registrado = document.querySelector('#registrarse');
$('#registrarse').submit(usuarioRegistrado);

let usuario = [];

function usuariosLS() {
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

function usuarioRegistrado(e) {
    e.preventDefault();

    const nombre = document.querySelector('.nombre').value 
    const mail = document.querySelector('.correo').value
    const contraseña = document.querySelector('.contraseña').value
    const id = 1;

    const usuarios = {
        nombre : nombre,
        mail : mail,
        contraseña : contraseña,
        id: 1
    }

    usuario.push(usuarios);

    console.log(nombre, mail, contraseña, id);
    usuariosLS();
    registrado.remove();
    
    $('#registrado').prepend(
        `
        <div id="saludo">
            <h1> Bienvenido ${nombre} </h1>
        </div>
        `
    );
}


if (localStorage.usuario){
    registrado.remove();

    let nombre = localStorage.getItem("usuario");

    $('#registrado').prepend(
        `
        <div id="saludo">
            <h1> Bienvenido ${nombre}</h1>
            <a id="#eliminarCuenta" href="#">Eliminar cuenta</a>
        </div>
        `
    );

    console.log(localStorage.usuario);
}

$('#eliminarCuenta').click(eliminarCuenta);

function eliminarCuenta(e) {
    e.preventDefault();

    localStorage.removeItem(usuario);
};

populateSessionStorage();


function populateSessionStorage() {
    sessionStorage.setItem('bgcolor', 'red');
    sessionStorage.setItem('font', 'Helvetica');
    sessionStorage.setItem('image', 'myCat.png');
  
    sessionStorage.removeItem('image');
}