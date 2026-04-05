/**
 * Game 1: La falacia del jugador - LÓGICA ASINCRÓNICA MEJORADA
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Juego 1: Sistema de lanzamientos asincrónicos listo");

    // 1. Selección de elementos
    const coin = document.getElementById("coin");
    const btnHeads = document.getElementById("select-heads");
    const btnTails = document.getElementById("select-tails");
    const btnFlip1 = document.getElementById("btn-flip-1");
    const btnFlip20 = document.getElementById("btn-flip-20");
    
    const displayHeads = document.getElementById("count-heads");
    const displayTails = document.getElementById("count-tails");
    const displayHits = document.getElementById("user-hits");
    const historyBox = document.getElementById("history");
    const conclusion = document.getElementById("conclusion");
    const messageDisplay = document.getElementById("message-display");

    // 2. Estado del juego
    let headsCount = 0;
    let tailsCount = 0;
    let userHits = 0;
    let userSelection = "cara"; // Por defecto 'cara'
    let isRunning = false;

    const winMessages = [
        "¿Lo ves? Sabías que ahora tocaba.",
        "La racha cambió… justo como pensabas."
    ];

    const lossMessages = [
        "Imposible… ya llevaba muchas iguales.",
        "Después de tantas… esta debió ser diferente."
    ];

    // 3. Función Delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 4. Control de Interfaz
    function deshabilitarBotones(desactivar) {
        isRunning = desactivar;
        btnHeads.disabled = desactivar;
        btnTails.disabled = desactivar;
        btnFlip1.disabled = desactivar;
        btnFlip20.disabled = desactivar;

        // Estilo visual de bloqueo
        const btns = [btnHeads, btnTails, btnFlip1, btnFlip20];
        btns.forEach(btn => {
            btn.style.opacity = desactivar ? "0.5" : "1";
            btn.style.cursor = desactivar ? "not-allowed" : "pointer";
        });
    }

    // 5. Lanzamiento Único Asincrónico
    async function lanzarUnaVezConAnimacion() {
        return new Promise(resolve => {
            const resultado = Math.random() < 0.5 ? "cara" : "cruz";
            console.log("Simulando: " + resultado);

            // Reiniciar animación
            coin.classList.remove("animate-heads", "animate-tails");
            void coin.offsetWidth; // Force reflow

            // Usamos las clases existentes pero ajustamos la duración vía JS para que sea ágil (800ms)
            const animClass = resultado === "cara" ? "animate-heads" : "animate-tails";
            coin.style.animationDuration = "800ms"; 
            coin.classList.add(animClass);

            setTimeout(() => {
                actualizarEstado(resultado);
                resolve();
            }, 800); // Duración de la animación solicitada
        });
    }

    // 6. Lanzamientos Múltiples Asincrónicos
    async function lanzarMultiples(veces) {
        for (let i = 0; i < veces; i++) {
            await lanzarUnaVezConAnimacion();
            await delay(800); // Tiempo entre lanzamientos solicitado
        }
    }

    // 7. Lógica de Negocio
    function actualizarEstado(resultado) {
        if (resultado === "cara") headsCount++;
        else tailsCount++;

        if (resultado === userSelection) {
            userHits++;
            const randomWin = winMessages[Math.floor(Math.random() * winMessages.length)];
            messageDisplay.textContent = randomWin;
            messageDisplay.style.color = "var(--gold)";
        } else {
            const randomLoss = lossMessages[Math.floor(Math.random() * lossMessages.length)];
            messageDisplay.textContent = randomLoss;
            messageDisplay.style.color = "#ff4d4d";
        }

        // Actualizar UI
        displayHeads.textContent = headsCount;
        displayTails.textContent = tailsCount;
        displayHits.textContent = userHits;

        // Historial
        const item = document.createElement("span");
        item.className = `history-item h-${resultado}`;
        item.textContent = resultado === "cara" ? "C" : "X";
        historyBox.prepend(item);
    }

    // 8. Event Listeners
    btnHeads.addEventListener("click", () => {
        if (isRunning) return;
        userSelection = "cara";
        btnHeads.classList.add("active");
        btnTails.classList.remove("active");
    });

    btnTails.addEventListener("click", () => {
        if (isRunning) return;
        userSelection = "cruz";
        btnTails.classList.add("active");
        btnHeads.classList.remove("active");
    });

    btnFlip1.addEventListener("click", async () => {
        if (isRunning) return;
        deshabilitarBotones(true);
        await lanzarUnaVezConAnimacion();
        deshabilitarBotones(false);
        conclusion.style.display = "block";
    });

    btnFlip20.addEventListener("click", async () => {
        if (isRunning) return;
        
        console.log("Iniciando secuencia de 20 lanzamientos...");
        deshabilitarBotones(true);
        await lanzarMultiples(20);
        deshabilitarBotones(false);
        
        conclusion.style.display = "block";
    });
});
