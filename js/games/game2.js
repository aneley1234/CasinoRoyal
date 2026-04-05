/**
 * Game 2: Ruleta del Casino - SINCRONIZACIÓN VISUAL Y LÓGICA TOTAL
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. DATA MAESTRA (Única fuente de verdad)
    const ruleta = [
        { numero: 0, color: "verde" },
        { numero: 32, color: "rojo" },
        { numero: 15, color: "negro" },
        { numero: 19, color: "rojo" },
        { numero: 4, color: "negro" },
        { numero: 21, color: "rojo" },
        { numero: 2, color: "negro" },
        { numero: 25, color: "rojo" },
        { numero: 17, color: "negro" },
        { numero: 34, color: "rojo" },
        { numero: 6, color: "negro" },
        { numero: 27, color: "rojo" },
        { numero: 13, color: "negro" },
        { numero: 36, color: "rojo" },
        { numero: 11, color: "negro" },
        { numero: 30, color: "rojo" },
        { numero: 8, color: "negro" },
        { numero: 23, color: "rojo" },
        { numero: 10, color: "negro" },
        { numero: 5, color: "rojo" },
        { numero: 24, color: "negro" },
        { numero: 16, color: "rojo" },
        { numero: 33, color: "negro" },
        { numero: 1, color: "rojo" },
        { numero: 20, color: "negro" },
        { numero: 14, color: "rojo" },
        { numero: 31, color: "negro" },
        { numero: 9, color: "rojo" },
        { numero: 22, color: "negro" },
        { numero: 18, color: "rojo" },
        { numero: 29, color: "negro" },
        { numero: 7, color: "rojo" },
        { numero: 28, color: "negro" },
        { numero: 12, color: "rojo" },
        { numero: 35, color: "negro" },
        { numero: 3, color: "rojo" },
        { numero: 26, color: "negro" }
    ];

    // 2. Estado Global
    let fichas = 100;
    const dineroInicial = 100;
    let apuestaAmount = 10;
    let apuestaColor = null;
    let isSpinning = false;
    let currentRotation = 0;

    // 3. Selección de Elementos
    const wheelContainer = document.getElementById('wheel-container');
    const balanceEl = document.getElementById('balance');
    const spinBtn = document.getElementById('spin-btn');
    const historyList = document.getElementById('history');
    const resultOverlay = document.getElementById('result-display');
    const resultMain = document.getElementById('result-main');
    const resultStatus = document.getElementById('result-status');
    const finalStats = document.getElementById('final-stats');
    const betAmountDisplay = document.getElementById('bet-amount-display');

    // 4. GENERAR RULETA VISUAL (SVG)
    function createWheelVisual() {
        const size = 420;
        const center = size / 2;
        const radius = center - 10;
        const degPerSeg = 360 / ruleta.length;

        let svgHtml = `<svg id="wheel-svg" viewBox="0 0 ${size} ${size}">`;
        
        ruleta.forEach((item, i) => {
            const startAngle = i * degPerSeg;
            const endAngle = (i + 1) * degPerSeg;
            const midAngle = startAngle + (degPerSeg / 2);
            
            const colorHex = item.color === 'verde' ? '#004d00' : (item.color === 'rojo' ? '#8b0000' : '#111');
            
            const x1 = center + radius * Math.sin(startAngle * Math.PI / 180);
            const y1 = center - radius * Math.cos(startAngle * Math.PI / 180);
            const x2 = center + radius * Math.sin(endAngle * Math.PI / 180);
            const y2 = center - radius * Math.cos(endAngle * Math.PI / 180);

            svgHtml += `
                <path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z" fill="${colorHex}" stroke="#d4af37" stroke-width="0.5"/>
                <g transform="rotate(${midAngle}, ${center}, ${center})">
                    <text x="${center}" y="35" fill="white" font-size="14" font-family="Cinzel" text-anchor="middle">${item.numero}</text>
                </g>
            `;
        });

        svgHtml += `<circle cx="${center}" cy="${center}" r="40" fill="#2a1a0a" stroke="#d4af37" stroke-width="2"/></svg>`;
        wheelContainer.innerHTML = svgHtml;
    }

    createWheelVisual();

    // 5. EVENTOS DE APUESTA
    document.getElementById('bet-rojo').onclick = () => selectBet("rojo", 'bet-rojo');
    document.getElementById('bet-verde').onclick = () => selectBet("verde", 'bet-verde');
    document.getElementById('bet-negro').onclick = () => selectBet("negro", 'bet-negro');

    function selectBet(color, id) {
        if (isSpinning) return;
        apuestaColor = color;
        document.querySelectorAll('.btn-bet').forEach(b => b.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    // 5.1 Controles de cantidad de apuesta
    document.getElementById('btn-plus').onclick = () => {
        if (isSpinning) return;
        if (apuestaAmount < 100) {
            apuestaAmount += 10;
            updateBetDisplay();
        }
    };

    document.getElementById('btn-minus').onclick = () => {
        if (isSpinning) return;
        if (apuestaAmount > 10) {
            apuestaAmount -= 10;
            updateBetDisplay();
        }
    };

    function updateBetDisplay() {
        betAmountDisplay.textContent = apuestaAmount;
        spinBtn.textContent = `GIRAR RULETA (${apuestaAmount})`;
    }

    // 6. LÓGICA DE GIRO
    spinBtn.onclick = () => {
        if (isSpinning) return;
        if (!apuestaColor) {
            alert("Selecciona un color (Rojo, Verde o Negro)");
            return;
        }

        isSpinning = true;
        spinBtn.disabled = true;
        spinBtn.style.opacity = "0.5";
        resultOverlay.style.display = 'none';

        const total = ruleta.length;
        const index = Math.floor(Math.random() * total);
        const gradosPorSegmento = 360 / total;

        const giroHaciaNumero = index * gradosPorSegmento;
        const vueltasExtra = 360 * 5; 
        const baseRotation = Math.ceil(currentRotation / 360) * 360;
        
        const anguloFinal =
    baseRotation +
    vueltasExtra -
    (index * gradosPorSegmento) -
    (gradosPorSegmento / 2) -
    2;
        currentRotation = anguloFinal;

        const wheelSvg = document.getElementById('wheel-svg');
        wheelSvg.style.transform = `rotate(${anguloFinal}deg)`;

        const resultado = ruleta[index];

        setTimeout(() => {
            procesarResultado(resultado.numero, resultado.color);
        }, 4000);
    };

    function procesarResultado(num, col) {
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.style.opacity = "1";

        const gano = (apuestaColor === col);
        
        let cambio = 0;
        if (gano) {
            cambio = apuestaAmount;
            fichas += cambio;
            mostrarMensaje(`Ganaste +${cambio}`, true, num, col);
        } else {
            cambio = -apuestaAmount;
            fichas += cambio;
            mostrarMensaje(`Perdiste ${cambio}`, false, num, col);
        }

        actualizarUI(num, col, cambio);
    }

    function mostrarMensaje(texto, gano, num, col) {
        resultOverlay.style.display = 'block';
        resultMain.textContent = `Cayó en ${num} ${col.toUpperCase()}`;
        resultStatus.textContent = texto;
        resultStatus.className = gano ? 'txt-win' : 'txt-lose';

        setTimeout(() => {
            resultOverlay.style.display = 'none';
        }, 3000);
    }

    function actualizarUI(num, col, cambio) {
        balanceEl.textContent = fichas;
        finalStats.textContent = `Dinero Inicial: ${dineroInicial} | Dinero Final: ${fichas}`;

        const li = document.createElement('li');
        li.className = 'history-item';
        // Formato solicitado: "Número 29 rojo | +20 fichas" (mostrando el retorno total o el cambio)
        // El usuario pidió: "+20" para una apuesta de 10 si gana.
        const displayCambio = cambio > 0 ? `+${apuestaAmount * 2}` : `-${apuestaAmount}`;
        
        li.innerHTML = `
            <span>Número ${num} ${col}</span>
            <span class="${cambio > 0 ? 'txt-win' : 'txt-lose'}">${displayCambio} fichas</span>
        `;
        
        if (historyList.children[0] && historyList.children[0].style.color === 'rgb(85, 85, 85)') {
            historyList.innerHTML = '';
        }
        historyList.prepend(li);
    }
});
