var ms = 0, s = 0, m = 0
var timer;

var display = document.querySelector(".timer-Display")
var laps = document.querySelector(".laps")


function start() {
    if (!timer) {
        timer = setInterval(run, 10)
    }
}

function run() {
    display.innerHTML = getTimer();
    animateTimer();
    ms++;
    if (ms == 100) {
        ms = 0;
        s++;
    }
    if (s == 60) {
        s = 0;
        m++;
    }
    // Surprise at 10 seconds
    if (m === 0 && s === 10 && ms === 0) {
        launchConfetti();
        playSurpriseSound();
    }
}

function getTimer() {
    return (m < 10 ? "0" + m : m) + " : " + (s < 10 ? "0" + s : s) + " : " + (ms < 10 ? "0" + ms : ms);
}



function pause() {
    stopTimer()
}

function stopTimer() {
    clearInterval(timer)
    timer = false
}




function reset() {
    stopTimer()
    ms = 0
    s = 0
    m = 0
    display.innerHTML = getTimer()
}




function restart() {
    if (timer) {
        reset()
        start()
    }

}


// lap = taking screenshot of current time...
function lap() {
    if (timer) {
        var Li = document.createElement("li")
        Li.innerHTML = getTimer()
        laps.appendChild(Li)
    }
}

function resetLap() {
    laps.innerHTML = ""
}

// --- Confetti and Surprise Sound ---
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    let confetti = [];
    let colors = ['#eef602', '#f7b42c', '#d3da82', '#fff700', '#ffecb3', '#ff9800'];
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: Math.random() * 8 + 4,
            d: Math.random() * 40 + 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngle: 0,
            tiltAngleIncremental: (Math.random() * 0.07) + 0.05
        });
    }
    let angle = 0;
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < confetti.length; i++) {
            let c = confetti[i];
            ctx.beginPath();
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + (c.r / 3), c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.d / 2);
            ctx.stroke();
        }
        updateConfetti();
    }
    function updateConfetti() {
        angle += 0.01;
        for (let i = 0; i < confetti.length; i++) {
            let c = confetti[i];
            c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) / 2;
            c.x += Math.sin(angle);
            c.tiltAngle += c.tiltAngleIncremental;
            c.tilt = Math.sin(c.tiltAngle) * 15;
            if (c.y > canvas.height) {
                c.x = Math.random() * canvas.width;
                c.y = -10;
            }
        }
    }
    let confettiInterval = setInterval(drawConfetti, 16);
    setTimeout(() => {
        clearInterval(confettiInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
    }, 3500);
}

// Fun sound effect
function playSurpriseSound() {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3');
    audio.volume = 0.3;
    audio.play();
}

// --- Animate timer on update ---
function animateTimer() {
    display.classList.remove('pop');
    void display.offsetWidth;
    display.classList.add('pop');
}

// Add pop animation style
(function addPopStyle() {
    const style = document.createElement('style');
    style.innerHTML = `.pop { animation: popScale 0.25s; }
    @keyframes popScale { 0% { transform: scale(1); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }`;
    document.head.appendChild(style);
})();

// --- Sparkle burst on button hover ---
function sparkleBurst(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.left = (e.clientX - rect.left) + 'px';
        sparkle.style.top = (e.clientY - rect.top) + 'px';
        sparkle.style.setProperty('--angle', (i * 30) + 'deg');
        btn.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 700);
    }
}

// Add sparkle event listeners
window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.buttons button').forEach(btn => {
        btn.addEventListener('mouseenter', sparkleBurst);
    });
});

// Add sparkle CSS
(function addSparkleStyle() {
    const style = document.createElement('style');
    style.innerHTML = `.sparkle {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(circle, #fff 60%, #ffe066 100%);
        pointer-events: none;
        animation: sparkle-burst 0.7s forwards;
        z-index: 3;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(var(--angle));
        opacity: 0.8;
    }
    @keyframes sparkle-burst {
        0% { transform: translate(-50%, -50%) scale(0.5) rotate(var(--angle)); opacity: 1; }
        80% { transform: translate(-50%, -120%) scale(1.2) rotate(var(--angle)); opacity: 1; }
        100% { transform: translate(-50%, -200%) scale(0.7) rotate(var(--angle)); opacity: 0; }
    }`;
    document.head.appendChild(style);
})();