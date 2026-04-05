/**
 * Juego 5: ¿La suerte mejora con más intentos?
 * Lógica: Probabilidad fija con animación de tómbola y efectos de Jackpot.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Estado del Juego
    let state = {
        fichas: 1000,
        attempts: 0,
        probIndividual: 0.05, // 5% (1 de 20)
        isAnimating: false
    };

    const tombola = document.getElementById('tombola');
    const attemptBtn = document.getElementById('attempt-btn');
    const balanceEl = document.getElementById('balance');
    const attemptsEl = document.getElementById('attempts');
    const resultMsg = document.getElementById('result-msg');
    const progressBar = document.getElementById('progress-bar');
    const cumulativeProbEl = document.getElementById('cumulative-prob');

    // 2. Inicializar Tómbola
    function initTombola() {
        tombola.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const ball = document.createElement('div');
            // La primera bola (index 0) es la especial (blanca brillante)
            ball.className = (i === 0) ? 'ball ball-special' : 'ball';
            randomizePosition(ball);
            tombola.appendChild(ball);
        }
    }

    function randomizePosition(ball) {
        const x = Math.random() * 220 + 20;
        const y = Math.random() * 220 + 20;
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;
        ball.classList.remove('selected-win', 'selected-loss');
    }

    // 3. Lógica de Intento
    async function startAttempt() {
        if (state.isAnimating || state.fichas < 10) return;

        state.isAnimating = true;
        state.fichas -= 10;
        state.attempts++;
        
        // UI Inicial
        attemptBtn.disabled = true;
        attemptBtn.textContent = "AGITANDO...";
        resultMsg.innerHTML = '<span style="color: #555; font-size: 0.9rem;">Mezclando tómbola...</span>';
        
        document.querySelectorAll('.ball').forEach(randomizePosition);
        tombola.classList.add('shaking');

        // Animación de movimiento
        const balls = document.querySelectorAll('.ball');
        let moveInt = setInterval(() => {
            balls.forEach(b => {
                const nx = Math.random() * 220 + 20;
                const ny = Math.random() * 220 + 20;
                b.style.left = `${nx}px`;
                b.style.top = `${ny}px`;
            });
        }, 100);

        // 4. Resultado
        setTimeout(() => {
            clearInterval(moveInt);
            tombola.classList.remove('shaking');
            
            const win = Math.random() < state.probIndividual;
            reveal(win);
        }, 2500);
    }

    function reveal(win) {
        const specialBall = document.querySelector('.ball-special');
        const normalBalls = document.querySelectorAll('.ball:not(.ball-special)');

        if (win) {
            state.fichas += 200;
            specialBall.classList.add('selected-win');
            createParticles();
            resultMsg.innerHTML = `
                <div class="jackpot-text">
                    <div>🎉 JACKPOT 🎉</div>
                    <div style="font-size: 1rem;">+200 FICHAS</div>
                </div>
            `;
        } else {
            const randomNormal = normalBalls[Math.floor(Math.random() * normalBalls.length)];
            randomNormal.classList.add('selected-loss');
            resultMsg.innerHTML = '<span style="color: #ff4d4d;">Inténtalo de nuevo</span>';
        }

        updateUI();
        state.isAnimating = false;
        attemptBtn.disabled = false;
        attemptBtn.textContent = "PROBAR SUERTE (10)";

        if (state.fichas < 10) {
            attemptBtn.disabled = true;
            attemptBtn.textContent = "SIN FICHAS";
        }
    }

    function createParticles() {
        for (let i = 0; i < 15; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = '50%';
            p.style.top = '50%';
            tombola.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;

            p.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], { duration: 1000, easing: 'ease-out' }).onfinish = () => p.remove();
        }
    }

    function updateUI() {
        balanceEl.textContent = state.fichas;
        attemptsEl.textContent = state.attempts;

        const q = 1 - state.probIndividual;
        const cumulativeProb = 1 - Math.pow(q, state.attempts);
        const percentage = (cumulativeProb * 100).toFixed(1);
        cumulativeProbEl.textContent = percentage + "%";
        progressBar.style.width = percentage + "%";
    }

    attemptBtn.onclick = startAttempt;
    initTombola();
    updateUI();
});
