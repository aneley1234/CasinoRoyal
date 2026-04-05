/**
 * Juego 3: La carta que nunca sale - ESTRUCTURA DE CARTAS CORREGIDA
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Configuración del Mazo Real (20 cartas únicas)
    const valores = ["A", "K", "Q", "J", "10"];
    const palosData = [
        { simbolo: "♠", clase: "suit-black" },
        { simbolo: "♥", clase: "suit-red" },
        { simbolo: "♦", clase: "suit-red" },
        { simbolo: "♣", clase: "suit-black" }
    ];
    
    const mazo = [];
    valores.forEach(valor => {
        palosData.forEach(palo => {
            mazo.push({
                valor: valor,
                palo: palo.simbolo,
                nombre: valor + palo.simbolo,
                suitClass: palo.clase
            });
        });
    });

    // 2. Estado del Juego
    let state = {
        fichas: 1000,
        selectedCardNombre: null,
        frequencies: {},
        isAnimating: false,
        totalDraws: 0
    };

    // Inicializar frecuencias usando el nombre único
    mazo.forEach(c => state.frequencies[c.nombre] = 0);

    // 3. Selección de Elementos
    const grid = document.getElementById('selection-grid');
    const frequencyList = document.getElementById('frequency-list');
    const drawSlot = document.getElementById('draw-card-slot');
    const balanceEl = document.getElementById('balance');
    const resultText = document.getElementById('result-text');
    const historyBox = document.getElementById('history');

    // 4. Renderizado Inicial
    function init() {
        renderSelectionGrid();
        renderFrequencies();
        updateUI();
    }

    function renderSelectionGrid() {
        grid.innerHTML = '';
        mazo.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.nombre = card.nombre;
            cardEl.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front">
                        <div class="${card.suitClass}">${card.valor}</div>
                        <div style="font-size: 2rem;" class="${card.suitClass}">${card.palo}</div>
                        <div class="${card.suitClass}" style="transform: rotate(180deg)">${card.valor}</div>
                    </div>
                </div>
            `;
            cardEl.onclick = () => selectCard(card.nombre);
            grid.appendChild(cardEl);
        });
    }

    function selectCard(nombre) {
        if (state.isAnimating) return;
        state.selectedCardNombre = nombre;
        document.querySelectorAll('.card').forEach(c => {
            c.classList.toggle('selected', c.dataset.nombre === nombre);
        });
        console.log("Carta seleccionada:", nombre);
    }

    // 5. Lógica de Robo
    async function draw(times = 1) {
        if (state.isAnimating) return;
        if (!state.selectedCardNombre) {
            alert("Por favor, selecciona una carta primero.");
            return;
        }

        state.isAnimating = true;
        setButtonsDisabled(true);

        for (let i = 0; i < times; i++) {
            const randomIndex = Math.floor(Math.random() * mazo.length);
            const drawnCard = mazo[randomIndex];
            
            // Actualizar lógica
            state.frequencies[drawnCard.nombre]++;
            state.totalDraws++;
            
            const isHit = drawnCard.nombre === state.selectedCardNombre;
            state.fichas += isHit ? 10 : -10;

            // Visual
            await animateDraw(drawnCard, isHit);
            
            if (times > 1) {
                await new Promise(r => setTimeout(r, 100));
            }
        }

        state.isAnimating = false;
        setButtonsDisabled(false);
        renderFrequencies();
        updateUI();
    }

    function animateDraw(card, isHit) {
        return new Promise(resolve => {
            drawSlot.innerHTML = '';
            const cardEl = document.createElement('div');
            cardEl.className = 'card anim-draw';
            cardEl.style.width = '100%';
            cardEl.style.height = '100%';
            cardEl.innerHTML = `
                <div class="card-face card-front">
                    <div class="${card.suitClass}">${card.valor}</div>
                    <div style="font-size: 2.5rem;" class="${card.suitClass}">${card.palo}</div>
                    <div class="${card.suitClass}" style="transform: rotate(180deg)">${card.valor}</div>
                </div>
            `;
            drawSlot.appendChild(cardEl);

            resultText.textContent = isHit ? "¡ACIERTO! +10" : "Sigue intentando...";
            resultText.style.color = isHit ? "#00ff00" : "#ff4d4d";

            if (isHit) {
                const log = document.createElement('p');
                log.textContent = `Acierto con ${card.nombre} en el tiro ${state.totalDraws}`;
                historyBox.prepend(log);
            }

            setTimeout(resolve, 600);
        });
    }

    function renderFrequencies() {
        frequencyList.innerHTML = '';
        // Ordenar para resaltar las "frías"
        const sorted = [...mazo].sort((a, b) => state.frequencies[a.nombre] - state.frequencies[b.nombre]);
        
        sorted.slice(0, 5).forEach(card => {
            const count = state.frequencies[card.nombre];
            const div = document.createElement('div');
            div.className = 'stat-row';
            div.innerHTML = `
                <span class="cold-card">${card.nombre} (FRÍA)</span>
                <span>Visto: ${count} veces</span>
            `;
            frequencyList.appendChild(div);
        });
    }

    function updateUI() {
        balanceEl.textContent = state.fichas;
    }

    function setButtonsDisabled(disabled) {
        const btn1 = document.getElementById('btn-draw-1');
        const btn2 = document.getElementById('btn-draw-20');
        if(btn1) {
            btn1.disabled = disabled;
            btn1.style.opacity = disabled ? 0.5 : 1;
        }
        if(btn2) {
            btn2.disabled = disabled;
            btn2.style.opacity = disabled ? 0.5 : 1;
        }
    }

    // Eventos
    document.getElementById('btn-draw-1').onclick = () => draw(1);
    document.getElementById('btn-draw-20').onclick = () => draw(20);

    init();
});
