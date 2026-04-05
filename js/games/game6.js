/**
 * Juego 6: Loot Box Simulator - RENDERIZADO PREMIUM
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Configuración de Rarezas
    const rarities = [
        { tipo: 'legendario', chance: 5, icono: '💎', label: 'LEGENDARIO' },
        { tipo: 'epico', chance: 25, icono: '🔥', label: 'ÉPICO' },
        { tipo: 'raro', chance: 75, icono: '⭐', label: 'RARO' },
        { tipo: 'comun', chance: 155, icono: '📦', label: 'COMÚN' }
    ];

    // 2. Estado del Juego
    let fichas = 1000;
    let resultadosGlobales = [];
    let isOpening = false;

    // 3. Selección de Elementos
    const cardsContainer = document.getElementById('cards-container');
    const balanceEl = document.getElementById('balance-display');
    const btnBuy1 = document.getElementById('btn-buy-1');
    const btnBuy10 = document.getElementById('btn-buy-10');

    // 4. Lógica de Compra
    async function buyPacks(numPacks, cost) {
        if (isOpening || fichas < cost) return;

        isOpening = true;
        fichas -= cost;
        updateUI();
        setButtonsDisabled(true);

        for (let p = 0; p < numPacks; p++) {
            let nuevoPack = [];
            for (let c = 0; c < 10; c++) {
                nuevoPack.push(generarCarta());
            }
            resultadosGlobales.unshift(nuevoPack);
        }

        renderizarTodo();
        isOpening = false;
        setButtonsDisabled(false);
    }

    function generarCarta() {
        const roll = Math.random() * 155;
        const res = rarities.find(r => roll < r.chance);
        return { ...res };
    }

    // 5. RENDERIZADO PREMIUM
    function renderizarTodo() {
        cardsContainer.innerHTML = "";
        let globalCardCount = 0;

        resultadosGlobales.forEach((pack, i) => {
            const packDiv = document.createElement("div");
            packDiv.className = "pack";

            const title = document.createElement("h3");
            title.textContent = "Sobre Abierto #" + (resultadosGlobales.length - i);

            const cardsGrid = document.createElement("div");
            cardsGrid.className = "cards-grid";

            pack.forEach((carta, cardIndex) => {
                const card = document.createElement("div");
                // Clase base + clase de rareza (comun, raro, epico, legendario)
                card.className = `card ${carta.tipo}`;
                
                // Retraso de animación global para secuencia una por una
                card.style.animationDelay = `${globalCardCount * 0.02}s`;
                globalCardCount++;

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-icon">${carta.icono}</div>
                        <div class="card-label">${carta.label}</div>
                    </div>
                `;

                cardsGrid.appendChild(card);
            });

            packDiv.appendChild(title);
            packDiv.appendChild(cardsGrid);
            cardsContainer.appendChild(packDiv);
        });
    }

    function updateUI() {
        balanceEl.textContent = `${fichas} FICHAS`;
        if (fichas < 10) {
            btnBuy1.disabled = true;
            btnBuy10.disabled = true;
            balanceEl.style.color = '#ff4d4d';
        }
    }

    function setButtonsDisabled(disabled) {
        btnBuy1.disabled = disabled;
        btnBuy10.disabled = disabled;
        btnBuy1.style.opacity = disabled ? 0.5 : 1;
        btnBuy10.style.opacity = disabled ? 0.5 : 1;
    }

    btnBuy1.onclick = () => buyPacks(1, 10);
    btnBuy10.onclick = () => buyPacks(10, 90);

    updateUI();
});
