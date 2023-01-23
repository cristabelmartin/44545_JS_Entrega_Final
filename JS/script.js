fetch("./JS/zapatos.json")
.then(response => response.json())
.then(zapatos => miPrograma(zapatos))

function miPrograma(zapatos){

  let contenedor = document.getElementById("contenedor")
  let carrito = []
  let contenedorCarrito = document.getElementById('carrito')
  let verCarrito = document.getElementById('verCarrito')

  renderizarZapatos(zapatos)

  let filtroOriginals = document.getElementById("originals")
  let filtroTerrex = document.getElementById("terrex")
  let filtroRunning = document.getElementById("running")
  let filtroMujer = document.getElementById("mujer")
  let filtroHombre = document.getElementById("hombre")
  let todos = document.getElementById("todos")

  filtroOriginals.addEventListener("click", renderizarZapatosFiltrados)
  filtroTerrex.addEventListener("click", renderizarZapatosFiltrados)
  filtroRunning.addEventListener("click", renderizarZapatosFiltrados)
  filtroMujer.addEventListener("click", renderizarZapatosFiltrados)
  filtroHombre.addEventListener("click", renderizarZapatosFiltrados)
  todos.addEventListener("click", renderizarZapatosFiltrados)

  function renderizarZapatosFiltrados(e) {
      contenedorCarrito.className = "ocultar"
      contenedor.className = "mostrar"
    if (e.target.id == "todos") {
      renderizarZapatos(zapatos)
    } else {
      renderizarZapatos(zapatos.filter((zapato) => zapato.categoria.toLowerCase() == e.target.id || zapato.genero.toLowerCase() == e.target.id))
    }
  }

  function renderizarZapatos(arrayDeZapatos) {
    contenedor.innerHTML = ""
    if (arrayDeZapatos.length > 0) {
      for (const zapato of arrayDeZapatos) {
        let tarjeta = document.createElement("div")
        tarjeta.className = "tarjeta"
        tarjeta.innerHTML = `
          <img src=${zapato.rutaImagen}>
          <h5>${zapato.nombre}</h5>
          <h5>$${zapato.precio}</h5>
          <button class=boton id=${zapato.id}>Agregar al carrito</button>
        `
        contenedor.appendChild(tarjeta)
      }
    } else {        
      let noHayZapatos = document.createElement('div')
      noHayZapatos.className = "no-hay-zapatos"
      noHayZapatos.innerHTML = `
      <h3>Lo sentimos, actualmente no tenemos productos para esta categoría</h3>
      `
      contenedor.appendChild(noHayZapatos)
    }

    let botones = document.getElementsByClassName("boton")
    for (const boton of botones) {
      boton.addEventListener("click", agregarAlCarrito)
    }
  }

  function agregarAlCarrito(e) {
    let zapatoBuscado = zapatos.find(zapato => zapato.id == e.target.id)
    // agregar el producto al array carrito
    carrito.push(zapatoBuscado)
    localStorage.setItem('carrito', JSON.stringify(carrito))
    Swal.fire(
      'Producto Agregado',
      'El producto se agregó a tu carrito, continúa comprando.',
      'success'
    )
    renderizarCarrito()
  }

  function renderizarCarrito() {
  contenedorCarrito.innerHTML = ''
      if (localStorage.getItem('carrito')) {
          carrito = JSON.parse(localStorage.getItem('carrito'))
      } else {
        carrito = []
      }

      if (carrito.length > 0) {
        carrito.forEach(producto => {
          let tarjeta = document.createElement('div')
          tarjeta.className = "tarjeta"
          tarjeta.innerHTML = `
          <img src=${producto.rutaImagen}>
          <p>${producto.nombre}</p>
          <p>$${producto.precio}</p>
          <button class=boton-quitardelcarrito id=${producto.id}>Quitar del carrito</button>
          `
          contenedorCarrito.appendChild(tarjeta)
        })
        // Agregar qun botón para comprar mis productos
        let totalAPagar = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0)
        let tarjeta1 = document.createElement('div')
          tarjeta1.className = "comprar"
          tarjeta1.innerHTML = `
          <p>Cantidad de productos: ${carrito.length}</p>
          <p>Total a pagar: $${totalAPagar}</p>
          <button class=boton-comprar id=botonComprar>Comprar</button>
          `
          contenedorCarrito.appendChild(tarjeta1)

          let comprarProducto = document.getElementById('botonComprar')
          comprarProducto.onclick = () => {
            comprarProductos()
          }
      } else { 
        //console.log("Entra al carrito vacío... " + carrito.length)       
        Swal.fire(
          'Carrito Vacío',
          'Agrega productos a tu carrito!',
          'info'
        )

        let carritoVacio = document.createElement('div')
        carritoVacio.className = "carritoVacio"
        carritoVacio.innerHTML = `
        <h3>El carrito está vacío...</h3>
        `
        contenedorCarrito.appendChild(carritoVacio)
      }

      let botones = document.getElementsByClassName("boton-quitardelcarrito")
      for (const boton of botones) {
        boton.addEventListener("click", quitarDelCarrito)
      }
  }

  function quitarDelCarrito(e) {
    let carritoIdZapatos = carrito.map(zapato => zapato.id)
    const indiceZapato = carritoIdZapatos.findIndex(zapato => zapato == e.target.id)
    if (indiceZapato > -1) {
      localStorage.removeItem('carrito');
      carrito.splice(indiceZapato, 1)
      localStorage.setItem('carrito', JSON.stringify(carrito))
      Swal.fire('Producto eliminado del carrito')
    }
    renderizarCarrito()
  }

  verCarrito.onclick = () => {
      contenedorCarrito.className = "mostrar"
      contenedor.className = "ocultar"
      renderizarCarrito()
  }

  function comprarProductos() {
    Swal.fire({
      position: 'bottom-end',
      icon: 'success',
      title: 'Gracias por su compra.',
      showConfirmButton: false,
      timer: 1500
    })
    localStorage.removeItem('carrito');
    renderizarCarrito()
  }
}