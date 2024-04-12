// Elementos de la gui
const gui = {
  display: document.getElementById("cronometro"),
  rangeV: document.getElementById("range_v"),
  rangeVdisp: document.getElementById("range_vdisp"),
  rangeAng: document.getElementById("range_ang"),
  rangeAngdisp: document.getElementById("range_angdisp"),
  btnDisparar: document.getElementById("btnDisparar"),
  btnIniciar: document.getElementById("btnIniciar")
};

// Definir un objeto cronómetr
const crono = new Crono(gui.display);

// Declarar variables y objetos
const canvas = document.getElementById("tiro");
const ctx = canvas.getContext("2d");
const piscina = document.getElementById("piscina");
const piscina_pelota = document.getElementById("piscina_pelota");
const pelota = document.getElementById("pelota");

// Dimensiones canvas
const canvasWidth = 700;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Coordenadas iniciales del proyectil
let xop = 0;
let yop = 50;
let xp;
let yp;

// Coordenadas iniciales del objetivo
const xomin = canvasWidth - (canvasWidth - 200);
const xomax = canvasWidth - 25;
let xo = getRandomInt(xomin, xomax);
let yo = 370;

// Declaración de velocidad y ángulo
let velp, angp;

// Gravedad terrestre y tiempo
const gravity = 9.8;
let time = 0;

// Variable controlar el uso de botones
let block = false;

// Variables colisión y victoria
let collision = false;
let victory;

// Pintar el objetivo
function drawTarget(x, y, img) {
  const radius = 25;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.drawImage(img, x - 25, y - 25);
  ctx.closePath();
}

// Pintar el proyectil
function drawProjectile(x, y, lx, ly) {
  ctx.beginPath();
  ctx.rect(x, y, lx, ly);
  ctx.drawImage(pelota, x, y);
  ctx.closePath();
}

// Calcular la trayectoria del proyectil
function calculateProjectilePath() {
  xp = xop + velp * Math.cos(angp * Math.PI / 180) * time;
  yp = yop + velp * Math.sin(angp * Math.PI / 180) * time - 0.5 * gravity * time * time;
  time += 0.1;
}

// Carga de imágenes
pelota.onload = () => {
  ctx.drawImage(pelota, xop, canvasHeight - yop);
};

piscina.onload = () => {
  ctx.drawImage(piscina, xo - 25, yo - 25);
};

// Dibujar objetivo
drawTarget(xo, yo, piscina);

// Dibujar proyectil en la posición inicial
drawProjectile(xop, canvasHeight - yop, 50, 50);

// Función principal de actualización
function launch() {
  if (xp + 50 > canvasWidth || xp < 0 || yp > canvasHeight || yp - 50 < 0) {
    collision = true;
    victory = false;
  }

  if (!block) {
    velp = Number(gui.rangeV.value);
    angp = Number(gui.rangeAng.value);
    block = true;
  }

  // Comprobar colisión
  const px = xp + 25;
  const py = (canvasHeight - yp) + 25;
  const distance = Math.sqrt((xo - px) * (xo - px) + (yo - py) * (yo - py));
  if (distance < 25) {
    collision = true;
    victory = true;
  }

  // Actualizar posición de los elementos
  calculateProjectilePath();
  // Borrar el canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // Pintar los elementos en el canvas
  drawTarget(xo, yo, piscina);
  drawProjectile(xp, canvasHeight - yp, 50, 50, "red");

  if (!collision) {
    // Repetir
    requestAnimationFrame(launch);
  }
  if (collision && !victory) {
    crono.stop();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "50px Arial";
    ctx.fillStyle = 'red';
    ctx.fillText("VUELVE A INTENTARLO", 70, 230);
  }
  if (collision && victory) {
    crono.stop();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawTarget(xo, yo, piscina_pelota);
    ctx.font = "110px Arial";
    ctx.fillStyle = 'green';
    ctx.fillText("GANASTE", 80, 230);
  }
}

// Retrollamada del botón de disparo
gui.btnDisparar.onclick = function() {
  if (!block) {
    launch();
    crono.start();
  }
  block = true;
}

// Retrollamada del botón de inicio
gui.btnIniciar.onclick = function() {
  location.reload();
}

// Generar número aleatorio para la posición del objetivo
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Mostrar valor de la interfaz de velocidad
gui.rangeV.oninput = function() {
  gui.rangeVdisp.innerHTML = gui.rangeV.value;
}

// Mostrar valor de la interfaz de ángulo
gui.rangeAng.oninput = function() {
  gui.rangeAngdisp.innerHTML = gui.rangeAng.value;
}