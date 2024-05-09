// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');


let redAleatoria;

const nodeRadius = 40;
const numNodos = 5;
const nodeConnect = 2;
const nodeRandomDelay = 1000;

// Localizando elementos en el DOM
const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");


// Clase para representar un nodo en el grafo
class Nodo {

  constructor(id, x, y, delay) {
    this.id = id; // Identificador del nodo
    this.x = x; // Coordenada X del nodo
    this.y = y; // Coordenada Y del nodo
    this.delay = delay; // Retardo del nodo en milisegundos
    this.conexiones = []; // Array de conexiones a otros nodos
  }
  
  // Método para agregar una conexión desde este nodo a otro nodo con un peso dado
  conectar(nodo, peso) {
    this.conexiones.push({ nodo, peso });
  }
}
  
// Función para generar una red aleatoria con nodos en diferentes estados de congestión
function crearRedAleatoriaConCongestion(numNodos, numConexiones) {
  const nodos = [];
  let x = 0, y = 0, delay = 0;

   // Generamos los nodos
   for (let i = 0; i < numNodos; i++) {
    x = randomNumber(nodeRadius, canvas.width - nodeRadius); // Generar coordenada x aleatoria
    y = randomNumber(nodeRadius, canvas.height - nodeRadius); // Generar coordenada y aleatoria
    delay = generarRetardo(); // Retardo aleatorio para simular congestión
    nodos.push(new Nodo(i, x, y, delay)); // Generar un nuevo nodo y añadirlo a la lista de nodos de la red
  }

   // Conectamos los nodos
  for (let i = 0; i < numNodos; i++) {
    const nodoActual = nodos[i];
    for (let j = 0; j < numConexiones; j++) {
      let pickNode = i;
      while (pickNode === i) {
        pickNode = Math.floor(Math.random() * numNodos);
      }
      const nodoAleatorio = nodos[pickNode];
      const peso = Math.random() * 100; // Peso aleatorio para simular la distancia entre nodos
      nodoActual.conectar(nodoAleatorio, peso);
    }
  }

  return nodos;
}

// Función para generar un retardo aleatorio entre 0 y 1000 ms
function generarRetardo() {
  return Math.random() * nodeRandomDelay;
}

// Generar un número aleatorio dentro de un rango
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Dibujar la red en el canvas
function drawNet(nnodes, rutaMinima) {
  // Dibujamos las conexiones entre nodos
  nnodes.forEach(nodo => {
    nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
      ctx.beginPath();
      ctx.moveTo(nodo.x, nodo.y);
      ctx.lineTo(conexion.x, conexion.y);
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      pw = "N" + nodo.id + " pw " + peso.toFixed(2);
      const midX = Math.floor((nodo.x + conexion.x)/2);
      const midY = Math.floor((nodo.y + conexion.y)/2);
      ctx.fillText(pw, midX, midY); 
    });
  });

  let nodoDesc; // Descripción del nodo

  // Dibujamos los nodos
  nnodes.forEach(nodo => {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);

    // Si el nodo está en la ruta mínima, lo coloreamos de verde
     if (rutaMinima && rutaMinima.some(nodoRuta => nodoRuta.id === nodo.id)) {
      ctx.fillStyle = 'green';
    } else {
      ctx.fillStyle = 'blue';
    }

    ctx.fill();
    ctx.stroke();
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    nodoDesc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
    ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);
  });
}

// Función para calcular la ruta mínima desde el primer nodo al último
function calcularRutaMinimaYTiempoTotal(nodos) {
  const origen = nodos[0]; // Primer nodo
  const destino = nodos[nodos.length - 1]; // Último nodo
  const rutaMinima = dijkstraConRetardos(nodos, origen, destino);

  // Calcular el tiempo total de transmisión sumando los tiempos de retardo de los nodos en la ruta mínima
  const tiempoTotalMs = rutaMinima.reduce((total, nodo) => total + nodo.delay, 0);
  const tiempoTotalS = tiempoTotalMs / 1000; 

  return { rutaMinima, tiempoTotalS };
}

// Función para mostrar un mensaje en el elemento con id "mensaje"
function mostrarMensaje(mensaje) {
  const mensajeElemento = document.getElementById("mensaje");
  mensajeElemento.innerText = mensaje;
}

// Función de calback para generar la red de manera aleatoria
btnCNet.onclick = () => {
  // Generar red de nodos con congestión creada de manera aleatoria redAleatoria
  // Cada nodo tendrá un delay aleatorio para simular el envío de paquetes de datos
  redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);

  // Limpiamos el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar la red que hemos generado
  drawNet(redAleatoria);

  // Mostrar mensaje de éxito
  console.log("Red generada correctamente.");
  mostrarMensaje("Red generada correctamente.");

}

// Función de callback para calcular la ruta mínima y mostrar el tiempo total de transmisión
btnMinPath.onclick = () => {
// Verificar si la red ha sido generada
if (!redAleatoria) {
  // Mostrar mensaje de error si la red no ha sido generada
  console.log("La red no está generada. Por favor, genera primero la red.");
  mostrarMensaje("La red no está generada. Por favor, genera primero la red.");
  return;
}

// Calcular la ruta mínima y el tiempo total de transmisión
const { rutaMinima, tiempoTotalS } = calcularRutaMinimaYTiempoTotal(redAleatoria);

// Limpiar el canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Dibujar la red y resaltar la ruta mínima
drawNet(redAleatoria, rutaMinima);

// Mostrar la ruta mínima y el tiempo total de transmisión en la consola
console.log("Ruta mínima:", rutaMinima);
console.log("Tiempo total de transmisión:", tiempoTotalS);
mostrarMensaje("Ruta mínima: " + rutaMinima.map(function(nodo) {
  return "N" + nodo.id;
}).join(" -> "));
mostrarMensaje("Tiempo total de transmisión: " + tiempoTotalS.toFixed(2) + " segundos");
}