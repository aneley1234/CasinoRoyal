/**
 * Juego 7: ¿Qué número saldrá?
 * Lógica: Independencia de eventos y desmitificación de patrones.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Estado del Juego
    let state = {
        fichas: 1000,
        selectedNumber: null,
        frequencies: { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0 },
        totalPlays: 0,
        isAnimating: false
    };

    const balanceEl = document.getElementById('balance');
    const resultEl = document.getElementById('current-result');
    const feedbackEl = document.getElementById('feedback-msg');
    const historyBox = document.getElementById('history');
    const chartContainer = document.getElementById('freq-chart');
    const btnPlay = document.getElementById('btn-play');

    // 2. Inicialización
    function init() {
        createChartBars();
        setupEventListeners();
    }

    function createChartBars() {
        chartContainer.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'chart-bar-wrapper';
            wrapper.innerHTML = `
                <div id="bar-${i}" class="chart-bar" style="height: 2px;"></div>
                <div class="chart-label">${i}</div>
            `;
            chartContainer.appendChild(wrapper);
        }
    }

    function setupEventListeners() {
        // Selección de número
        document.querySelectorAll('.btn-number').forEach(btn => {
            btn.onclick = () => {
                if (state.isAnimating) return;
                state.selectedNumber = parseInt(btn.dataset.num);
                document.querySelectorAll('.btn-number').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            };
        });

        // Botón Jugar
        btnPlay.onclick = () => play();
    }

    // 3. Lógica de Juego
    async function play() {
        if (state.isAnimating) return;
        if (!state.selectedNumber) {
            alert("Por favor, selecciona un número antes de jugar.");
            return;
        }
        if (state.fichas < 10) {
            alert("No tienes suficientes fichas.");
            return;
        }

        state.isAnimating = true;
        state.fichas -= 10;
        updateUI();

        // Animación de "sorteo"
        feedbackEl.textContent = "Sorteando...";
        let counter = 0;
        const interval = setInterval(() => {
            resultEl.textContent = Math.floor(Math.random() * 10) + 1;
            counter++;
        }, 80);

        setTimeout(() => {
            clearInterval(interval);
            const finalResult = Math.floor(Math.random() * 10) + 1;
            processResult(finalResult);
        }, 1500);
    }

    function processResult(res) {
        state.isAnimating = false;
        state.totalPlays++;
        state.frequencies[res]++;
        
        resultEl.textContent = res;
        const isHit = res === state.selectedNumber;
        
        if (isHit) {
            state.fichas += 100; // Premio x10
            feedbackEl.textContent = "¡ACIERTO! +100 FICHAS";
            feedbackEl.style.color = "#00ff00";
        } else {
            feedbackEl.textContent = "No hubo suerte.";
            feedbackEl.style.color = "#ff4d4d";
        }

        addHistory(res, isHit);
        updateChart();
        updateUI();
    }

    // 4. Utilidades UI
    function updateUI() {
        balanceEl.textContent = state.fichas;
    }

    function updateChart() {
        // Encontrar el valor máximo para escalar la gráfica
        const maxFreq = Math.max(...Object.values(state.frequencies), 1);
        
        for (let i = 1; i <= 10; i++) {
            const bar = document.getElementById(`bar-${i}`);
            const percentage = (state.frequencies[i] / maxFreq) * 100;
            bar.style.height = `${Math.max(percentage, 2)}%`;
            // Resaltar la más frecuente
            bar.style.opacity = state.frequencies[i] === maxFreq ? "1" : "0.5";
        }
    }

    function addHistory(res, isHit) {
        if (state.totalPlays === 1) historyBox.innerHTML = '';
        
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span>Tiro #${state.totalPlays}</span>
            <span>Salió: <b>${res}</b></span>
            <span class="${isHit ? 'hit' : ''}">${isHit ? '¡GANASTE!' : 'FALLO'}</span>
        `;
        historyBox.prepend(item);
    }

    init();
});
