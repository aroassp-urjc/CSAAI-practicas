// Variables
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let redAleatoria;

const nodeRadius = 40;
const numNodos = 5;
const nodeConnect = 2;
const nodeRandomDelay = 1000;

const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");

class Nodo {
  constructor(id, x, y, delay) {
    this.id = id;
    this.x = x; 
    this.y = y; 
    this.delay = delay; 
    this.conexiones = []; 
  }
  
  conectar(nodo, peso) {
    this.conexiones.push({ nodo, peso });
  }
}
  
function crearRedAleatoriaConCongestion(numNodos, numConexiones) {
  const nodos = [];
  let x = 0, y = 0, delay = 0;

   for (let i = 0; i < numNodos; i++) {
    x = randomNumber(nodeRadius, canvas.width - nodeRadius); 
    y = randomNumber(nodeRadius, canvas.height - nodeRadius); 
    delay = generarRetardo(); 
    nodos.push(new Nodo(i, x, y, delay)); 
  }

  for (let i = 0; i < numNodos; i++) {
    const nodoActual = nodos[i];
    for (let j = 0; j < numConexiones; j++) {
      let pickNode = i;
      while (pickNode === i) {
        pickNode = Math.floor(Math.random() * numNodos);
      }
      const nodoAleatorio = nodos[pickNode];
      const peso = Math.random() * 100; 
      nodoActual.conectar(nodoAleatorio, peso);
    }
  }
  return nodos;
}

function generarRetardo() {
  return Math.random() * nodeRandomDelay;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function drawNet(nnodes, rutaMinima) {
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

  let nodoDesc;

  nnodes.forEach(nodo => {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);

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

function calcularRutaMinimaYTiempoTotal(nodos) {
  const origen = nodos[0]; // Primer nodo
  const destino = nodos[nodos.length - 1]; 
  const rutaMinima = dijkstraConRetardos(nodos, origen, destino);

  const tiempoTotalMs = rutaMinima.reduce((total, nodo) => total + nodo.delay, 0);
  const tiempoTotalS = tiempoTotalMs / 1000; 

  return { rutaMinima, tiempoTotalS };
}

function mostrarMensaje(mensaje) {
  const mensajeElemento = document.getElementById("mensaje");
  mensajeElemento.innerText = mensaje;
}

btnCNet.onclick = () => {
  redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawNet(redAleatoria);

  console.log("Red generada correctamente.");
  mostrarMensaje("Red generada correctamente.");

}

btnMinPath.onclick = () => {
if (!redAleatoria) {
  console.log("La red no está generada. Por favor, genera primero la red.");
  mostrarMensaje("La red no está generada. Por favor, genera primero la red.");
  return;
}

const { rutaMinima, tiempoTotalS } = calcularRutaMinimaYTiempoTotal(redAleatoria);

ctx.clearRect(0, 0, canvas.width, canvas.height);

drawNet(redAleatoria, rutaMinima);

console.log("Ruta mínima:", rutaMinima);
console.log("Tiempo total de transmisión:", tiempoTotalS);
mostrarMensaje("Ruta mínima: " + rutaMinima.map(function(nodo) {
  return "N" + nodo.id;
}).join(" -> "));
mostrarMensaje("Tiempo total de transmisión: " + tiempoTotalS.toFixed(2) + " segundos");
}