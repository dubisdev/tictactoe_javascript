import Partida from "./Partida.js"

//cosas con acceso global de la partida
let layout = []
let partida;

let nivel;
let primeraPartida = true;


//elementos del DOM y sus eventos
const game_ui = document.getElementById("game_ui")
const pregame_ui = document.getElementById("pregame_ui")

const start_button = document.getElementById("start_game_button")
start_button.addEventListener("click", () => {
    game_ui.style.display = "block"
    pregame_ui.style.display = "none"
    nuevaPartida()
})

document.getElementById("menu").addEventListener("click", () => {
    game_ui.style.display = "none"
    pregame_ui.style.display = "block"
})

document.getElementById("new_game").addEventListener("click", nuevaPartida)


//hacer que el juego funcione cuando el jugador juegue
const elJugadorJuega = new CustomEvent("juega");

function nuevaPartida() {
    //generamos el array de posiciones
    layout = []
    for (var i = 0; i <= 8; i++) {
        layout.push(document.getElementById(`box` + i))
    }

    //elegimos el nivel del juego
    nivel = +document.getElementById("levelSelector").value

    //creamos el objeto partida
    partida = new Partida(nivel)

    //limpiamos el tablero
    limpiarTablero(layout, nivel)

}

function limpiarTablero(layout, nivel) {
    //limpiar el tablero e iniciar la máquina en el medio
    layout.forEach(elem => {
        elem.innerText = "";

        if(primeraPartida) {
            elem.addEventListener("click", () => {
                if (elem.innerText !== "") return;
                marcarCasilla(+elem.id.slice(-1))
                elem.dispatchEvent(elJugadorJuega)
            })

            elem.addEventListener("juega", (e) => {

                //comprobamos si es el fin del juego
                if (!partida.isTerminada() && partida.getJugador() === 1) {

                    while (true) {
                        let casilla_ia = partida.ia();

                        if (partida.getCasillasSeleccionadas(casilla_ia) === 0) {
                            marcarCasilla(casilla_ia)
                            break;
                        }
                    }

                }

                if (partida.isTerminada()) {
                    alert("Se acabó la partida ;)")
                }

            })

        } 


    })

    primeraPartida = false;


}


function marcarCasilla(casilla) {

    if (partida.getJugador() === 1 && partida.getCasillasSeleccionadas(casilla) === 0) {
        layout[casilla].innerText = "X"
        partida.setCasillasSeleccionadas(partida.getJugador(), casilla);
        partida.cambiarJugador();
    }
    else if (partida.getJugador() === 2 && partida.getCasillasSeleccionadas(casilla) === 0) {
        layout[casilla].innerText = "O"
        partida.setCasillasSeleccionadas(partida.getJugador(), casilla);
        partida.cambiarJugador();
    }

    //comprobar si alguien ha ganado
    if (partida.comprobarGanador()[0] === 1) {
        partida.setTerminada(true);
        //mostrar mensaje por pantalla
    }
    else if (partida.comprobarGanador()[0] === 2) {
        partida.setTerminada(true);

        //mostrar mensaje por pantalla

    } else if (partida.comprobarGanador()[0] === 3) {
        partida.setTerminada(true);

        //mostrar mensaje por pantalla

    }

}