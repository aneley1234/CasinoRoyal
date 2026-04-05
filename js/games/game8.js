/**
 * Juego 8: La Ilusión de la Precisión
 * Tragamonedas que demuestra la independencia de los eventos aleatorios.
 */

document.addEventListener('DOMContentLoaded', () => {
    const symbols = ["7️⃣", "⭐", "💎", "🍒", "🔔"];
    const rewards = {
        "7️⃣": 500,
        "💎": 250,
        "⭐": 150,
        "🍒": 100,
        "🔔": 60
    };

    let balance = 1000;
    const cost = 10;
    let isSpinning = false;

    // DOM Elements
    const balanceEl = document.getElementById('balance');
    const spinBtn = document.getElementById('btn-spin');
    const statusText = document.getElementById('status-text');
    const machineContainer = document.getElementById('machine-container');
    const winOverlay = document.getElementById('win-overlay');
    const overlayPrize = document.getElementById('overlay-prize');
    const reelEls = [
        document.getElementById('reel-1'),
        document.getElementById('reel-2'),
        document.getElementById('reel-3')
    ];

    const symbolClasses = {
        "7️⃣": "win-7",
        "💎": "win-diamond",
        "⭐": "win-star",
        "🍒": "win-cherry",
        "🔔": "win-bell"
    };

    if (!balanceEl || !spinBtn || !statusText || !machineContainer || !winOverlay || !overlayPrize || reelEls.some(el => !el)) {
        console.error("Error: No se pudieron encontrar los elementos del DOM del Juego 8.");
        return;
    }

    // Overlay Close Logic
    winOverlay.addEventListener('click', () => {
        winOverlay.classList.remove('active');
    });

    // Inicializar UI
    balanceEl.textContent = balance;

    spinBtn.addEventListener('click', async () => {
        if (isSpinning || balance < cost) return;

        // Reset visual state
        machineContainer.className = "slot-machine";
        statusText.className = "status-display";
        statusText.textContent = "";

        isSpinning = true;
        balance -= cost;
        updateUI();
        
        spinBtn.disabled = true;
        statusText.textContent = "GIRANDO...";

        // Generate final result
        const result = [
            getRandomSymbol(),
            getRandomSymbol(),
            getRandomSymbol()
        ];

        // Perform animation
        await animateReels(result);

        // Process result
        const isWin = result[0] === result[1] && result[1] === result[2];
        const isNearMiss = !isWin && (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]);

        if (isWin) {
            const prize = rewards[result[0]];
            balance += prize;
            
            // Trigger Overlay
            overlayPrize.textContent = `+${prize} FICHAS`;
            winOverlay.classList.add('active');
            
            // Auto close after 3s
            setTimeout(() => {
                winOverlay.classList.remove('active');
            }, 3000);

            statusText.textContent = `¡WIN!`;
            statusText.className = "status-display status-win";
            
            // Add symbol specific win class
            const winClass = symbolClasses[result[0]];
            if (winClass) machineContainer.classList.add(winClass);
            
        } else if (isNearMiss) {
    const nearMessages = [
        "CASI. Intenta otra vez",
        "ESO ESTUVO CERCA",
        "POR POCO",
        "A NADA",
        "FALTÓ UNA"
    ];

    const randomIndex = Math.floor(Math.random() * nearMessages.length);
    statusText.textContent = nearMessages[randomIndex];

    statusText.className = "status-display status-near";
} else {
    statusText.textContent = "Esta vez no... pero casi.";
    statusText.className = "status-display status-lose";
}

        isSpinning = false;
        spinBtn.disabled = false;
        updateUI();
    });

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function updateUI() {
        if (balanceEl) balanceEl.textContent = balance;
    }

    async function animateReels(finalResult) {
        const spinTime = 2000; // Total spin time
        const intervalTime = 100;
        let elapsed = 0;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                elapsed += intervalTime;
                
                reelEls.forEach((el, index) => {
                    // Stagger the stopping of reels
                    if (elapsed < (index + 1) * (spinTime / 3)) {
                        el.textContent = getRandomSymbol();
                    } else {
                        el.textContent = finalResult[index];
                    }
                });

                if (elapsed >= spinTime) {
                    clearInterval(interval);
                    resolve();
                }
            }, intervalTime);
        });
    }
});
