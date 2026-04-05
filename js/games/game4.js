/**
 * Juego 4: Contagio en el Salón - LÓGICA DE SELECCIÓN PERSISTENTE
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Estado del Juego
    let state = {
        grid: [], // 0: sano, 1: infectado
        selectedCells: [], // Array de índices seleccionados por el usuario
        isRunning: false,
        speed: 800,
        prob: 0.3,
        contacts: 2,
        round: 0
    };

    const salon = document.getElementById('salon');
    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');
    const infectedCountEl = document.getElementById('infected-count');
    const probRange = document.getElementById('prob-range');
    const probVal = document.getElementById('prob-val');
    const contactRange = document.getElementById('contact-range');
    const contactVal = document.getElementById('contact-val');
    const logBox = document.getElementById('log');
    const predictionStatus = document.getElementById('prediction-status');

    // 2. Inicialización
    function init() {
        createGrid();
        setupEventListeners();
    }

    function createGrid() {
        salon.innerHTML = '';
        state.grid = new Array(64).fill(0);
        state.round = 0;
        state.selectedCells = []; // Solo se limpia en reset o evaluación
        
        const initialInfected = Math.floor(Math.random() * 64);
        state.grid[initialInfected] = 1;

        for (let i = 0; i < 64; i++) {
            const person = document.createElement('div');
            person.className = 'person';
            person.dataset.index = i;
            person.onclick = () => handleCellClick(i);
            salon.appendChild(person);
        }
        updateVisuals();
    }

    /**
     * Gestión del click con TOGGLE y persistencia
     */
    function handleCellClick(index) {
        // No permitir seleccionar infectados
        if (state.grid[index] === 1) return;

        const pos = state.selectedCells.indexOf(index);
        if (pos === -1) {
            state.selectedCells.push(index);
        } else {
            state.selectedCells.splice(pos, 1);
        }
        
        // NO limpiamos el array, solo actualizamos la vista
        updateVisuals();
        updateStatus();
    }

    // 3. Lógica de Simulación
    async function runSimulation() {
        state.isRunning = true;
        btnStart.disabled = true;
        btnStart.style.opacity = 0.5;

        while (state.isRunning && state.grid.includes(0)) {
            state.round++;
            
            // Avanzar contagio
            await nextRound();
            
            // EVALUAR: Comprobar si las celdas seleccionadas se infectaron en esta ronda
            evaluarSeleccion();
            
            await new Promise(r => setTimeout(r, state.speed));
        }

        stopSimulation();
    }

    function evaluarSeleccion() {
        if (state.selectedCells.length === 0) return;

        let infectadosEnEstaRonda = 0;
        const indicesAEvaluar = [...state.selectedCells];

        indicesAEvaluar.forEach(idx => {
            if (state.grid[idx] === 1) {
                infectadosEnEstaRonda++;
                addLog(`¡ACIERTO! La celda ${idx} ha sido contagiada.`);
            }
        });

        // LIMPIAR SELECCIÓN SOLO DESPUÉS DE EVALUAR LA RONDA
        state.selectedCells = [];
        updateVisuals();
        updateStatus();
    }

    async function nextRound() {
        let newInfections = [...state.grid];
        for (let i = 0; i < 64; i++) {
            if (state.grid[i] === 1) {
                const neighbors = getNeighbors(i);
                let attempts = 0;
                while (attempts < state.contacts && neighbors.length > 0) {
                    const neighborIndex = neighbors.splice(Math.floor(Math.random() * neighbors.length), 1)[0];
                    if (state.grid[neighborIndex] === 0) {
                        if (Math.random() < state.prob) {
                            newInfections[neighborIndex] = 1;
                        }
                    }
                    attempts++;
                }
            }
        }
        state.grid = newInfections;
        updateVisuals();
    }

    function getNeighbors(index) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const neighbors = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr; const nc = col + dc;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) neighbors.push(nr * 8 + nc);
            }
        }
        return neighbors;
    }

    // 4. UI y Utilidades
    function updateVisuals() {
        const people = document.querySelectorAll('.person');
        const count = state.grid.filter(x => x === 1).length;
        infectedCountEl.textContent = count;

        state.grid.forEach((status, i) => {
            const el = people[i];
            el.classList.toggle('infected', status === 1);
            
            // La clase "selected" depende de si el índice está en nuestro array de persistencia
            const isSelected = state.selectedCells.includes(i);
            el.classList.toggle('selected', isSelected && status === 0);
            
            if (status === 1) el.classList.remove('selected');
        });
    }

    function updateStatus() {
        if (state.selectedCells.length > 0) {
            predictionStatus.textContent = `${state.selectedCells.length} celdas seleccionadas`;
            predictionStatus.style.color = "var(--gold)";
        } else {
            predictionStatus.textContent = "Selecciona tus predicciones (celdas azules)";
            predictionStatus.style.color = "#555";
        }
    }

    function addLog(text) {
        const p = document.createElement('p');
        p.textContent = `[Ronda ${state.round}] ${text}`;
        logBox.prepend(p);
    }

    function stopSimulation() {
        state.isRunning = false;
        btnStart.disabled = false;
        btnStart.style.opacity = 1;
    }

    function setupEventListeners() {
        btnStart.onclick = () => runSimulation();
        btnReset.onclick = () => {
            state.isRunning = false;
            createGrid();
            addLog("Simulación reiniciada.");
        };
        probRange.oninput = (e) => { state.prob = e.target.value / 100; probVal.textContent = e.target.value; };
        contactRange.oninput = (e) => { state.contacts = parseInt(e.target.value); contactVal.textContent = e.target.value; };
        document.querySelectorAll('.btn-speed').forEach(btn => {
            btn.onclick = () => {
                state.speed = parseInt(btn.dataset.ms);
                document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('speed-label').textContent = btn.textContent;
            };
        });
    }

    init();
});
