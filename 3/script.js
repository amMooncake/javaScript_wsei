const sound = document.querySelectorAll('audio')
let currentChannel = ''
let nextChanel = 2


// becouse when I was programming I also was watching tv series :D
sound.forEach(element => {
    element.volume = 0.1
});

let chanels = {
    'chanel1' : [],
}

const avaliableSoundsKey = []
const sounds = {}

// creating list with avaliable sounds
for (let i = 0; i < sound.length; i++) {
    const key = sound[i].dataset.key
    sounds[key] = sound[i]
    avaliableSoundsKey.push(key)
}



// Playing sounds and recording from keypress
document.addEventListener('keypress',(ev)=>{
    if(!avaliableSoundsKey.includes(ev.key)) return
    
    const key = ev.key
    sounds[key].currentTime = 0
    sounds[key].play()

    chanels[currentChannel].push({
        key: key,
        time: Date.now()
    })
})




//select record chanels
function recordSounds(){
    document.querySelectorAll('.record').forEach(e => {
        
        console.log(chanels)
        console.log(e.id)
        e.addEventListener('click',(element)=>{
            chanels[e.id] = []
            currentChannel = `${e.id}`
        })
    });
}

recordSounds()



// Playing sounds from chanels
function playSounds(){
    document.querySelectorAll('.play-button').forEach(e => {
        e.addEventListener('click',(element)=>{
            console.log(chanels[e.id])

            let startTime = chanels[e.id][0].time
            console.log(startTime)
            chanels[e.id].forEach(sound => {
                const key = sound.key
                const time = sound.time - startTime

                setTimeout(()=>{
                    sounds[key].currentTime = 0
                    sounds[key].play()
                },time)
            })
        })
    })
}


//adding new record chanel
document.querySelector('.add').addEventListener('click',()=>{
    const newChanel = document.createElement('div')
    newChanel.classList.add('icons')

    newChanel.innerHTML = `
    <button id="chanel${nextChanel}" class="record" ><i class="fa-solid fa-record-vinyl"></i></button>
    <button id="chanel${nextChanel}" class="play-button"><i class="fas fa-play"></i></button>`
    console.log(newChanel)
    document.querySelector('.buttons').appendChild(newChanel)
    chanels[`chanel${nextChanel}`] = [];
    nextChanel = nextChanel + 1
    recordSounds()
    playSounds()
})

