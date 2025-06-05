const randomNumbers = Array.from({length: 100}, () => Math.floor(Math.random() * 1000))

const asyncAdd = async (a,b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return Promise.reject('Argumenty muszą mieć typ number!')
  }
  return new Promise((resolve, reject) => {
    setTimeout(() =>{
      resolve(a+b)
    }, 100)
  })
}


const asyncAddmultiple = async (...numbers) => {
  if (numbers.some(num => typeof num !== 'number')) {
    return Promise.reject('Argumenty muszą mieć typ number!')
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(numbers.reduce((sum, num) => sum + num, 0))
    }, 100)
  })
}





performance.mark('asyncAdd100Start')
let asyncAddPromises = []
for (let i = 0; i < 100; i += 2) {
    asyncAddPromises.push(asyncAdd(randomNumbers[i], randomNumbers[i + 1]))
}

Promise.all(asyncAddPromises).then(() => {
    performance.mark('asyncAdd100End')
    performance.measure('asyncAdd100', 'asyncAdd100Start', 'asyncAdd100End')
    const measure = performance.getEntriesByName('asyncAdd100')[0]

    console.log(`asyncAdd dla 100 elementów: Czas wykonania: ${measure.duration} ms, Ilość operacji asynchronicznych: ${asyncAddPromises.length}`)
});


performance.mark('asyncAddMultiple100Start')
asyncAddmultiple(...randomNumbers).then(() => {
    performance.mark('asyncAddMultiple100End')
    performance.measure('asyncAddMultiple100', 'asyncAddMultiple100Start', 'asyncAddMultiple100End')
    const measure = performance.getEntriesByName('asyncAddMultiple100')[0]
    console.log(`asyncAddMultiple dla 100 elementów: Czas wykonania: ${measure.duration} ms, Ilość operacji asynchronicznych: 1`)
});