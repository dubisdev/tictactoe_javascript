export default class Partida {

    constructor(dificultad) {
        this.dificultad = dificultad;
        this.jugador = 2;
        this.terminada = false;
        this.cas_selec = new Array(9).fill(0);
    }

    getCombinaciones = () => [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    getDificultad = () => this.dificultad;

    getJugador = () => this.jugador;
    cambiarJugador() { this.jugador === 1 ? this.jugador = 2 : this.jugador = 1 }

    isTerminada = () => this.terminada;
    setTerminada(terminada) { this.terminada = terminada }

    getCasillasSeleccionadas = (casilla) => this.cas_selec[casilla];
    setCasillasSeleccionadas(valor, casilla) { this.cas_selec[casilla] = valor; }

    dosEnRaya(jugador) {
        const combinaciones = this.getCombinaciones();
        let casilla = -1;
        let cuantas_lleva = 0;

        for (let i = 0; i < combinaciones.length; i++) {
            cuantas_lleva = 0;
            for (let j = 0; j < 3; j++) if (this.cas_selec[combinaciones[i][j]] === jugador) cuantas_lleva++;
            if (cuantas_lleva === 2) for (let j = 0; j < 3; j++) if (this.cas_selec[combinaciones[i][j]] === 0) return combinaciones[i][j];
        }
        return casilla;
    }

    numCasSelec(jugador) {
        let contador = 0;
        for (let i = 0; i < this.cas_selec.length; i++) if (this.cas_selec[i] === jugador) contador++;
        return contador;
    }

    combinacionesConAspa() {

        const combinaciones = this.getCombinaciones();
        let combinaciones_aspa = new Array(8);
        let casilla0 = 0, casilla2 = 0, casilla6 = 0, casilla8 = 0;

        //comprobar que combinaciones tienen aspa
        for (let i = 0; i < combinaciones.length; i++) for (let j = 0; j < 3; j++) if (this.cas_selec[combinaciones[i][j]] === 1) combinaciones_aspa[i] = 1;

        //comprobar que casilla cortaría más combinaciones
        for (let i = 0; i < combinaciones.length; i++) {
            if (combinaciones_aspa[i] === 1) {
                for (let j = 0; j < 3; j++) {
                    if (combinaciones[i][j] === 0 && this.cas_selec[combinaciones[i][j]] === 0) casilla0++;
                    else if (combinaciones[i][j] === 2 && this.cas_selec[combinaciones[i][j]] === 0) casilla2++;
                    else if (combinaciones[i][j] === 6 && this.cas_selec[combinaciones[i][j]] === 0) casilla6++;
                    else if (combinaciones[i][j] === 8 && this.cas_selec[combinaciones[i][j]] === 0) casilla8++;
                }
            }
        }

        if (casilla0 === 2) return 0;
        else if (casilla2 === 2) return 2;
        else if (casilla6 === 2) return 6;
        else if (casilla8 === 2) return 8;
        return -1;
    }

    dosEnRayaGanar() {
        const combinaciones = this.getCombinaciones();
        let casilla = -1;
        let cuantas_lleva = 0;

        for (let i = 0; i < combinaciones.length; i++) {
            cuantas_lleva = 0;
            for (let j = 0; j < 3; j++) {
                if (this.cas_selec[combinaciones[i][j]] === 2) cuantas_lleva++;
                if (this.cas_selec[combinaciones[i][j]] === 1) cuantas_lleva--;
            }

            if (cuantas_lleva === 1) for (let j = 0; j < 3; j++) if (this.cas_selec[combinaciones[i][j]] === 0) return combinaciones[i][j];
        }
        return casilla;
    }

    marcarUnaEsquina() { for (let i = 0; i <= 8; i += 2) if (this.cas_selec[i] === 0) return i; }

    ia() {
        let casilla;

        switch (this.dificultad) {
            case 0: return Math.trunc((Math.random() * 10));

            case 1: {
                casilla = this.dosEnRaya(1);
                if (casilla != -1) return casilla;
                return Math.trunc((Math.random() * 10));
            }

            case 2: {
                //en el primer turno hay que ganar el centro o una esquina
                if (this.numCasSelec(1) === 0) {
                    //si el medio no está ocupado lo necesitamos :)
                    if (this.cas_selec[4] === 0) return 4;
                    return this.marcarUnaEsquina()
                }

                //si jugador empieza y en el medio --> primero una esquina y luego hacer la contra
                //si una contra ya existe, se buscan las opciones de ganar del otro y se evitan (dos en raya)
                if (this.numCasSelec(1) === 1 && this.numCasSelec(2) === 2) {
                    casilla = this.dosEnRaya(2);
                    if (casilla !== -1) return casilla;
                    return this.marcarUnaEsquina()
                }

                //si se ha jugado una vez --> si en el centro está la redonda --> marcar esquina

                if (this.numCasSelec(1) === 1) {
                    const pares = [[1, 7], [3, 5], [5, 3], [7, 1]]
                    for (let i = 0; i > pares.length; i++) if (this.cas_selec[pares[i][0]] === 1 && this.cas_selec[pares[i][1]] === 0) return pares[i][1];
                }

                //a partir de que la ia haya jugado dos turnos
                if (this.numCasSelec(1) >= 2) {
                    //si el medio es de la ia
                    if (this.cas_selec[4] === 1) {
                        const pares = [[0, 8], [2, 6], [1, 7], [3, 5]]
                        for (let i = 0; i < pares.length; i++) {
                            if (this.cas_selec[pares[i][0]] === 1 && this.cas_selec[pares[i][1]] === 0) return pares[i][1];
                            if (this.cas_selec[pares[i][0]] === 0 && this.cas_selec[pares[i][1]] === 1) return pares[i][0];
                        }
                    }

                    //si el medio no es de la ia queda comprobar las aristas exteriores
                    const aristas = [[0, 1, 2], [6, 7, 8], [0, 3, 6], [2, 5, 8]]
                    for (let i = 0; i < aristas.length; i++) {
                        if (this.cas_selec[aristas[i][0]] === 1 && this.cas_selec[aristas[i][1]] === 1 && this.cas_selec[aristas[i][2]] === 0) return aristas[i][2];
                        if (this.cas_selec[aristas[i][0]] === 1 && this.cas_selec[aristas[i][1]] === 0 && this.cas_selec[aristas[i][2]] === 1) return aristas[i][1];
                        if (this.cas_selec[aristas[i][0]] === 0 && this.cas_selec[aristas[i][1]] === 1 && this.cas_selec[aristas[i][2]] === 1) return aristas[i][0];
                    }
                }

                // si puede ganar
                casilla = this.dosEnRaya(1);
                if (casilla !== -1) return casilla;

                // si no puede ganar, intenta contrarestar al contrincante
                casilla = this.dosEnRaya(2);
                if (casilla !== -1) return casilla;

                //si el jugador pone un aspa en la casilla inferior derecha o izquierda
                //y si ya habia un circulo en el centro, el jugador pone un circulo en la casilla del centro de abajo
                if (this.cas_selec[4] === 2 && (this.cas_selec[6] === 1 || this.cas_selec[8] === 1) && this.cas_selec[7] === 0) return 7;

                //recorrer combinaciones para ver que combinacion tiene mas aspas para bloquear
                //posibles combinaciones ganadoras
                if (this.combinacionesConAspa() !== -1) return this.combinacionesConAspa();

                //generar numero aleatorio
                return Math.trunc((Math.random() * 10));
            }
        }
        return 0;
    }

    comprobarGanador() {
        const combin = this.getCombinaciones();
        for (let i = 0; i < 8; i++) {
            if (this.cas_selec[combin[i][0]] === 1 && this.cas_selec[combin[i][1]] === 1 && this.cas_selec[combin[i][2]] === 1) return [1, i];
            else if (this.cas_selec[combin[i][0]] === 2 && this.cas_selec[combin[i][1]] === 2 && this.cas_selec[combin[i][2]] === 2) return [2, i];
        }
        
        let contador = 0;
        for (let i = 0; i < 9; i++) if (this.cas_selec[i] != 0) contador++;
        if (contador === 9) return [3, 3];
        return [0, 0];
    }
}
