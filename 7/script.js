const APIKEY = '5a9402ecf95431ad0f74a4f7d3caeb6b'; // :)

const addCityBtn = document.querySelector('.addCityBtn')
const cityInput = document.querySelector('.cityInput')
const weatherInfo = document.querySelector('.weatherInfo')


let myCities = []


window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('myCities');
  if (saved) {
    myCities = JSON.parse(saved);
    updateUi();
  }
});


function saveMyCities() {
  localStorage.setItem('myCities', JSON.stringify(myCities));
}




addCityBtn.addEventListener('click', () => {
  addCity();
})


cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addCity();
  }
});



function addCity(){
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  if (myCities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
    alert('This city is already in your list!');
    cityInput.value = '';
    return;
  }

  const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIKEY}`

  fetch(geoApiUrl).then(response => {
    if (!response.ok){throw new Error(`HTTP error! status: ${response.status}`);}
    return response.json();
  }).then(data => {
    console.log('Geo data:', data);

    //getting lot and lon 
    const exclude = 'minutely'
    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=${exclude}&units=metric&appid=${APIKEY}`
    console.log('Weather API URL:', weatherApiUrl);
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
        humidity: whetherData.current.humidity,
        wetherIcon: whetherData.current.weather[0].icon,
        weatherForNextDays: whetherData.daily.map(day => {
          return {
            temp: day.temp.day,
            weatherIcon: day.weather[0].icon,
            date: new Date(day.dt * 1000).toLocaleDateString()
          }
        }),
      })
      console.log(myCities)
      updateUi()
      saveMyCities();
      cityInput.value = '';

    }).catch(error => {
      console.error('Error fetching weather data:', error);
    });


  }).catch(error => {
    console.error('Error fetching weather data:', error);
  });
}



function updateUi() {
  weatherInfo.innerHTML = '';  
  myCities.forEach(element => {
    let forecastHtml = '';
    element.weatherForNextDays.slice(1,5).forEach(day => {
      forecastHtml += `
        <div class="forecast-day">
          <p>${day.date}</p>
          <img src="https://openweathermap.org/img/wn/${day.weatherIcon}@2x.png" alt="Weather icon", >
          <p>${day.temp}°C</p>
        </div>
      `;
    });


    weatherInfo.innerHTML += `
      <div class="weather-card">
        <h2>${element.name}</h2>
        <img src="https://openweathermap.org/img/wn/${element.wetherIcon}@2x.png" alt="${element.name} weather icon">
        <p class="temperature">${element.temp}°C</p>
        <p>Wind Speed: ${element.windSpeed} m/s</p>
        <p>Humidity: ${element.humidity}%</p>
        <p>Sunrise: ${new Date(element.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(element.sunset * 1000).toLocaleTimeString()}</p>
        <h3>Weather for Next Days</h3>
        <div class="forecast-container">
          ${forecastHtml}
        </div>
        <button class="delete-btn">Delete</button>
      </div>
    `;
  });

  // gpt done this: :)
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.weather-card');
    const index = card.getAttribute('data-index');
    myCities.splice(index, 1);
    updateUi();
    saveMyCities();
    console.log('City deleted:', index);
    });
  });
}





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




function refreshAllCitiesWeather() {
  const citiesToUpdate = [...myCities];
  myCities = [];
  let updatedCount = 0;

  citiesToUpdate.forEach(city => {
    const exclude = 'minutely';
    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&exclude=${exclude}&units=metric&appid=${APIKEY}`;
    fetch(weatherApiUrl)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(whetherData => {
        myCities.push({
          name: city.name,
          lat: city.lat,
          lon: city.lon,
          temp: whetherData.current.temp,
          sunrise: whetherData.current.sunrise,
          sunset: whetherData.current.sunset,
          windSpeed: whetherData.current.wind_speed,
          humidity: whetherData.current.humidity,
          wetherIcon: whetherData.current.weather[0].icon,
          weatherForNextDays: whetherData.daily.map(day => ({
            temp: day.temp.day,
            weatherIcon: day.weather[0].icon,
            date: new Date(day.dt * 1000).toLocaleDateString()
          })),
        });
        updatedCount++;
        if (updatedCount === citiesToUpdate.length) {
          updateUi();
          saveMyCities();
        }
      })
      .catch(error => {
        console.error('Error refreshing weather data:', error);
        updatedCount++;
        if (updatedCount === citiesToUpdate.length) {
          updateUi();
          saveMyCities();
        }
      });
  });


}

// Refresh weather every 5 minutes (300000 ms)
setInterval(refreshAllCitiesWeather, 300000);

