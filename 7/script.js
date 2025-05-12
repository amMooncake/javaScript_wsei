const APIKEY = '5a9402ecf95431ad0f74a4f7d3caeb6b'
const addCityBtn = document.querySelector('.addCityBtn')
const cityInput = document.querySelector('.cityInput')

let myCities = []


addCityBtn.addEventListener('click', () => {
  const cityName = cityInput.value
  const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIKEY}`

  fetch(geoApiUrl).then(response => {
    if (!response.ok){throw new Error(`HTTP error! status: ${response.status}`);}
    return response.json();
  }).then(data => {
    console.log('Geo data:', data);
    //getting lot and lon 

    const exclude = 'minutely'
    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=${exclude}&units=metric&appid=${APIKEY}`
    
    fetch(weatherApiUrl).then(response => {
      if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`)}
      return response.json();
    }).then(whetherData => {
      console.log('Weather data:', whetherData);
      myCities.push({
        name: data[0].name, 
        lat: data[0].lat, 
        lon: data[0].lon, 
        temp : whetherData.current.temp, 
        sunrise: whetherData.current.sunrise, 
        sunset: whetherData.current.sunset, 
        windSpeed: whetherData.current.wind_speed,
        wetherIcon: whetherData.current.weather[0].icon,
      })
      console.log(myCities)

    }).catch(error => {
      console.error('Error fetching weather data:', error);
    });


  }).catch(error => {
    console.error('Error fetching weather data:', error);
  });


})




// fetch(apiUrl)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   })  
//   .then(data => {
//     console.log('Weather data:', data);
//     // Process the data as needed
//   })
//   .catch(error => {
//     console.error('Error fetching weather data:', error);
// });