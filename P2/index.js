console.log("Ejecutando JS...");

//-- Variables
var secretcode = document.getElementsByClassName("clave");
var botones = document.getElementsByClassName("digito");
var cronometroD = document.getElementById("cronometro");
var start = true;
var guess = 0;

//-- Elementos de la gui
const gui = {
    display : cronometroD,
    start : document.getElementById("start"),
    stop : document.getElementById("stop"),
    reset : document.getElementById("reset")
    
}

//-- Definir un objeto cronómetro
const crono = new Crono(gui.display);

//---- Configurar las funciones de retrollamada

//-- Arrancar el cronometro
gui.start.onclick = () => {
    console.log("Start!!");
    crono.start();
}
  
//-- Detener el cronómetro
gui.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
    start = true;
}

//-- Reiniciar el cronómetro
gui.reset.onclick = () => {
    console.log("Reset!");
    crono.reset();
    //-- Recarga la página para volver a empezar
    window.location.reload(); 
}

//-- Generar números secretos y almacenarlos en un array
const secretkey = Array.from({length: 4}, () => String(getRandomInt(10)));

//-- Mostrar el contenido del array de números secretos en la consola
console.log(secretkey)

//-- Evaluar la entrada del usuario
function evaluar(valor) {
    let pos = 0;
    for (let i = 0; i < secretkey.length; i++) {
        if (secretkey[i] === valor && secretcode[pos].innerHTML !== valor) {
            secretcode[pos].innerHTML = valor;
            secretcode[pos].style.color = "yellow";
            guess++;
        }
        pos++;
    }
    
    if (guess === 4) {
        crono.stop();
        cronometroD.style.color = "black";
        document.body.style.backgroundImage = 'url("starsgreen.png")';
        document.getElementById("mensajeEnhorabuena").style.display = "block";

    }
}

//-- Manejar las pulsaciones de los botones
for (let boton of botones) {
    boton.onclick = (ev) => {
        if (start) {
            console.log(start);
            crono.start();
            start = false;
            console.log(start);
            cronometroD.style.color = "yellow";
        }
        evaluar(ev.target.value);
    }
}

//-- Función para generar números enteros aleatorios en un rango
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}