console.log("Ejecutando JS...");

const selectors = {
    gridContainer: document.querySelector('.grid-container'),
    tablero: document.querySelector('.tablero'),
    movimientos: document.querySelector('.movimientos'),
    timer: document.querySelector('.timer'),
    comenzar: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

// Reiniciar
const reiniciar = document.getElementById("reseat");

reiniciar.onclick = function() {
    location.reload();
};

let nivel = document.getElementById("nivel");
let dimension;

function generateGame() {
    let valorSeleccionado = parseInt(nivel.value);
    let dimensions = valorSeleccionado;

    if (dimensions % 2 !== 0) {
        throw new Error("Las dimensiones del tablero deben ser un número par.");
    }

    //-- Creamos un array con los emojis que vamos a utilizar 
    const emojis = ['⚽', '🏀', '🏐', '🏈', '🎾', '🏓', '🎳', '⛸️', '🎱', '🏊', '🏇', '🥊','🏉','🏋️','🚴','🏄','🎣','🏒'];
   
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2);

    const items = shuffle([...picks, ...picks]);
    
    const cards = `
        <div class="tablero" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `;
    
    const parser = new DOMParser().parseFromString(cards, 'text/html');

    selectors.tablero.replaceWith(parser.querySelector('.tablero'));
}

function pickRandom(array, items) {
    const clonedArray = [...array];
    const randomPicks = [];

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
}

function shuffle(array) {
    const clonedArray = [...array];

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const original = clonedArray[index];

        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
}

function attachEventListeners() {
    document.addEventListener('click', function(event) {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
}

function startGame() {
    state.gameStarted = true;
    selectors.comenzar.classList.add('disabled');
    state.loop = setInterval(function() {
        state.totalTime++;

        selectors.movimientos.innerText = `Movimientos: ${state.totalFlips}`;
        selectors.timer.innerText = `Tiempo: ${state.totalTime} sec`;
    }, 1000);
}

function flipCard(card) {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    }


    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(function() {
            selectors.gridContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    ¡Has ganado!<br />
                    con <span class="highlight">${state.totalFlips}</span> movimientos<br />
                    en un tiempo de <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `;
            clearInterval(state.loop);
        }, 1000);
    }
}

function flipBackCards() {
    document.querySelectorAll('.card:not(.matched)').forEach(function(card) {
        card.classList.remove('flipped');
    });
    state.flippedCards = 0;
}

nivel.addEventListener("change", function() {
    let valorSeleccionado = parseInt(nivel.value);
    let dimensions;

    if (dimension == 4) {

        if (valorSeleccionado == 2) {
            valorSeleccionado = dimensions;
            console.log("El nivel seleccionado es el facil");
        } else if (valorSeleccionado == 4) {
            valorSeleccionado = dimensions;
            console.log("El nivel seleccionado es el medio");
        } else if (valorSeleccionado == 6) {
            valorSeleccionado = dimensions;
            console.log("El nivel seleccionado es el dificil");
        }
    }
    generateGame(dimensions);
});

attachEventListeners();