const apiKey = '84a5dd3c07c9749d17f2ff97f4156436'; //It is replace by your generate API-Key.

document.getElementById('searchBtn').addEventListener('click', getWeatherByCity);
document.getElementById('locationBtn').addEventListener('click', getWeatherByLocation);
document.getElementById('clearBtn').addEventListener('click', clearWeather);
document.getElementById('restartBtn').addEventListener('click', () => location.reload());

function getWeatherByCity() {
  const city = document.getElementById('cityInput').value.trim();
  if (city !== '') {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeatherData(url);
  } else {
    alert('Please enter a city name.');
  }
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        fetchWeatherData(url);
      },
      function () {
        alert('Location access denied or unavailable.');
      }
    );
  } else {
    alert('Geolocation not supported by your browser.');
  }
}

function fetchWeatherData(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const weatherDisplay = document.getElementById('weatherDisplay');
      const condition = data.weather[0].main;
      const temp = data.main.temp;

      // Generate advice----------
      let englishAdvice = '';
      let hindiAdvice = '';

      switch (condition) {
        case 'Clear':
          englishAdvice = '☀️ It’s a sunny day!';
          hindiAdvice = '☀️ आज धूप निकली है!';
          break;
        case 'Rain':
          englishAdvice = '🌧️ Rainy weather! Carry an umbrella.';
          hindiAdvice = '🌧️ बारिश हो रही है! छाता साथ रखें।';
          break;
        case 'Clouds':
          englishAdvice = '☁️ Cloudy skies.';
          hindiAdvice = '☁️ बादल छाए हुए हैं।';
          break;
        case 'Snow':
          englishAdvice = '❄️ Snowfall expected.';
          hindiAdvice = '❄️ बर्फबारी हो सकती है।';
          break;
        case 'Thunderstorm':
          englishAdvice = '⛈️ Thunderstorm alert. Stay indoors.';
          hindiAdvice = '⛈️ तूफ़ान आ सकता है। घर पर रहें।';
          break;
        case 'Mist':
        case 'Fog':
          englishAdvice = '🌫️ Low visibility due to mist.';
          hindiAdvice = '🌫️ धुंध के कारण दृश्यता कम है।';
          break;
        default:
          englishAdvice = '🌍 Stay prepared!';
          hindiAdvice = '🌍 तैयार रहें!';
      }

      if (temp < 10) {
        englishAdvice += ' Very cold! Stay warm and limit outdoor activity.';
        hindiAdvice += ' बहुत ठंड है! गर्म रहें और बाहर कम जाएं।';
      } else if (temp < 15) {
        englishAdvice += ' Cool weather. Dress warmly.';
        hindiAdvice += ' ठंडा मौसम है। गर्म कपड़े पहनें।';
      } else if (temp < 25) {
        englishAdvice += ' Pleasant weather. Ideal for outdoor tasks.';
        hindiAdvice += ' सुहावना मौसम। बाहर जाने के लिए उपयुक्त है।';
      } else if (temp < 35) {
        englishAdvice += ' Warm weather. Stay hydrated.';
        hindiAdvice += ' गर्मी है। पानी पीते रहें।';
      } else {
        englishAdvice += ' Very hot! Avoid going out during peak hours.';
        hindiAdvice += ' बहुत गर्मी है! दोपहर में बाहर जाने से बचें।';
      }

      weatherDisplay.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><strong>Temperature:</strong> ${temp} °C</p>
        <p><strong>Weather:</strong> ${condition}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <div style="margin-top:10px; padding:10px; background-color:#f0f8ff; border-left:4px solid #2196F3;">
          <strong>Advice:</strong> ${englishAdvice}
          <br><span style="color: gray; font-size: 14px;">${hindiAdvice}</span>
        </div>
      `;
    })
    .catch(() => {
      document.getElementById('weatherDisplay').innerHTML = `<p>Error getting weather data.</p>`;
    });
}

function clearWeather() {
  document.getElementById('cityInput').value = '';
  document.getElementById('weatherDisplay').innerHTML = '';
}
