const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const loadingText = document.getElementById("loading");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const errorText = document.getElementById("error");

function getWeather() {
  const city = cityInput.value.trim();

  errorText.innerText = "";
  cityName.innerText = "";
  temperature.innerText = "";
  condition.innerText = "";

  if (city === "") {
    errorText.innerText = "Please enter a city name";
    return;
  }

  loadingText.classList.remove("hidden");

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch city location");
      }
      return response.json();
    })
    .then(data => {
      if (!data.results) {
        throw new Error("City not found");
      }

      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;

      return fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
    })
    .then(response => response.json())
    .then(weatherData => {
      cityName.innerText = city;
      temperature.innerText =
        `Temperature: ${weatherData.current_weather.temperature} °C`;
      condition.innerText =
        `Wind Speed: ${weatherData.current_weather.windspeed} km/h`;
    })
    .catch(error => {
      
      errorText.innerText = error.message;
      console.error("Error:", error);
    })
    .finally(() => {
      loadingText.classList.add("hidden");
    });
}

searchBtn.addEventListener("click", getWeather);
