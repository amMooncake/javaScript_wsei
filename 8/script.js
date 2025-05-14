const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const numDistance = document.querySelector(".numDistance");
const noOfCircles = document.querySelector(".noOfCircles");
const framesInfo = document.querySelector(".frames-info");
let myReq;

let mouse = {x: null, y: null};

let attractionStrength = 0.08;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const circles = [];
let numCircles = 40;
let maxDistance = window.innerWidth * 0.2


function generateRandomCircles(){ 
    for(let i = 0; i< numCircles; i++){
        circles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: 6 + Math.random() * 8,
        });
    } 
}

function drawLine(c1, c2){
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if(distance < maxDistance){
        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.strokeStyle = `rgba(0, 0, 0, 255)`;
        ctx.linewidth = 1;
        ctx.stroke();
    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numCircles; i++) {
        const c = circles[i];

        c.x += c.vx;
        c.y += c.vy;

        if (c.x <= 0 || c.x >= canvas.width) c.vx *= -1;
        if (c.y <= 0 || c.y >= canvas.height) c.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - c.x;
            const dy = mouse.y - c.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = attractionStrength * (1 - dist / 120);
                const fx = dx / dist * force;
                const fy = dy / dist * force;
                c.vx += fx;
                c.vy += fy;
            }
        }

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        

        for (let j = i + 1; j < numCircles; j++) {
            drawLine(c, circles[j]);
        }
    }

    myReq = requestAnimationFrame(animate);
}

document.querySelector(".startBtn").addEventListener("click", () => {
    if (myReq) {
        cancelAnimationFrame(myReq);
        myReq = null;
    } else {
        animate();
    }
});

document.querySelector(".resetBtn").addEventListener("click", () => {
    if (myReq) {
        cancelAnimationFrame(myReq);
        myReq = null;
    }
    circles.length = 0;
    generateRandomCircles();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


generateRandomCircles()



numDistance.addEventListener("input", (e) => {
    maxDistance = e.target.value;
})

noOfCircles.addEventListener("input", (e) => {
    numCircles = e.target.value;
    generateRandomCircles();

    if (myReq) {
        cancelAnimationFrame(myReq);
        myReq = null;
    }
})





const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    framesInfo.innerHTML = `FPS: ${fps}`;
    refreshLoop();
  });
}


canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});



window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.addEventListener('mouseleave', function() {
    mouse.x = null;
    mouse.y = null;
});



refreshLoop();