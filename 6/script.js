// I used this video
// https://www.youtube.com/watch?v=qwi2Gb6QCDo


const state = document.querySelector('.state')
const scoreDiv = document.querySelector('.score')
let score = 0

let x = Math.round(0)
let y = Math.round(0)


const main = document.querySelector('.main');
main.style.width = '300px';
main.style.height = '500px';
main.style.background = 'grey';
main.style.position = 'relative';
main.style.borderRadius = '20px';


const ball  = document.createElement('div');
const b = {x:130, y:230, w:40, h:40, dx:1, dy:1, speed: 0.0, ani: {}, move: false };
ball.style.background = 'red';
ball.style.borderRadius = '50%';
ball.style.width = `${b.w}px`;
ball.style.height = `${b.h}px`;
ball.style.position = 'absolute';
ball.style.left = `${b.x}px`;
ball.style.top = `${b.y}px`;



const hole = document.createElement('div');
const h = {x : 0, y: 0, w: 40, h: 40, dx: 1, dy: 1, speed: 1, ani: {}, move: false };
hole.style.background = 'black';
hole.style.borderRadius = '50%';
hole.style.width = `${h.w}px`;
hole.style.height = `${h.h}px`;
hole.style.position = 'absolute';
hole.style.left = `${h.x}px`;
hole.style.top = `${h.y}px`;


main.appendChild(ball);
main.appendChild(hole);


function holeMover(){
    if(h.x > 300 - h.w || h.x < 0){
        h.dx *= -1
    }

    if(h.y > 500 - h.h || h.y < 0){
        h.dy *= -1
    }

    h.x += h.dx;
    h.y += h.dy;

    hole.style.left = `${h.x}px`;
    hole.style.top = `${h.y}px`;
    if(h.move){
        h.ani = requestAnimationFrame(holeMover);
    }
    
}


function ballMover(){

    if(x == 0) b.dx = 0
    else if(x > 0) b.dx = 1
    else b.dx = -1

    if(y == 0) b.dy = 0
    else if(y > 0) b.dy = 1
    else b.dy = -1


    if(b.y + b.dy > 500 - b.h || b.y +  b.dy < 0){
        if(b.y < 0){
            b.y = 0;
        }else if(b.y > 500 - b.h){
            b.y = 500 - b.h;
        }
        b.dy = 0;
    }


    if(b.x + b.dx > 300 - b.w || b.x + b.dx < 0){
        if(b.x < 0){
            b.x = 0;
        }else if(b.x > 300 - b.w){
            b.x = 300 - b.w;
        }
        b.dx = 0;
    }

    // console.log(b.x, b.y)

    b.x += b.dx * b.speed;
    b.y += b.dy * b.speed;

    ball.style.left = `${b.x}px`;
    ball.style.top = `${b.y}px`;

    if((Math.abs(b.y - h.y) < 8) && (Math.abs(b.x - h.x) < 8)){
        // console.log(b.y, h.y)
        // console.log(b.y, h.y)
        // console.log(b.y - h.y)
        // console.log(b.x - h.x)
        score += 1
        scoreDiv.innerHTML = `Score: ${score}`
        cancelAnimationFrame(b.ani);
        cancelAnimationFrame(h.ani);
        h.move = false;
        b.move = false;
    }

    if(b.move){
        b.ani = requestAnimationFrame(ballMover);

    }
}


function handlerOrientation(event) {
    state.innerHTML = 'Device orientation event' 
    state.innerHTML = 'Device orientation supported' 

    const beta = event.beta;
    const gamma = event.gamma;

    x = Math.round(gamma);
    y = Math.round(beta);


    b.speed = (Math.abs(x) + Math.abs(y))/15;
    console.log(b.speed)
}


document.querySelector('.startAnimation').addEventListener('click', () => {
    h.x = Math.floor(Math.random() * (300 - h.w));
    h.y = Math.floor(Math.random() * (500 - h.h));
    b.y = 230
    b.x = 130

    if(!b.move){
        b.ani = requestAnimationFrame(ballMover);
        h.ani = requestAnimationFrame(holeMover);

        h.move = true;
        b.move = true;
    }else{
        cancelAnimationFrame(b.ani);
        cancelAnimationFrame(h.ani);
        h.move = false;
        b.move = false;
    }
})



async function requestDeviceOrientation(){
    if(typeof DeviceOrientationEvent != 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function'){
        state.innerHTML = 'requestPermission'
        try{
            const  permissionState = await DeviceOrientationEvent.requestPermission();
            if(permissionState === 'granted'){
                state.innerHTML('Permission granted')
                window.addEventListener("deviceorientation", handlerOrientation)
            }

        }catch(e){
            state.innerHTML = 'Permission denied'
            alert('Permission denied')
        }

    }else if('DeviceOrientationEvent' in window){
        window.addEventListener("deviceorientation", handlerOrientation)
    }else{
        state.innerHTML('Device orientation not supported')
        alert('Device orientation not supported');

    }

}

requestDeviceOrientation()