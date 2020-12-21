// format time stamps on page
function formatTime(time) {
  let formatTimeDate = new Date(time);
  let formatTimeHours = formatTimeDate.getHours();
  if (formatTimeHours < 10) {
    formatTimeHours = `0${formatTimeHours}`;
  }
  let formatTimeMinutes = formatTimeDate.getMinutes();
  if (formatTimeMinutes < 10) {
    formatTimeMinutes = `0${formatTimeMinutes}`;
  }
  return `${formatTimeHours}:${formatTimeMinutes}`;
}

// update the last updated time on weather app with weekday and time
function formatDate(timestamp) {
  let date = new Date(timestamp);

  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let actualDay = weekdays[date.getDay()];
  let timeToShow = formatTime(timestamp);
  return `${actualDay} ${timeToShow}`;
}

// pull the acutal weather for the location that is being entered
function showTemp(response) {
  celsiusTemp = Math.round(response.data.main.temp);
  let tempMin = Math.round(response.data.main.temp_min);
  let tempMax = Math.round(response.data.main.temp_max);
  let feelsLike = Math.round(response.data.main.feels_like);
  let weatherDes = response.data.weather[0].description;
  let windSpeed = response.data.wind.speed;
  let humidity = response.data.main.humidity;
  let displayTempNow = document.querySelector("#currentTemperature");
  let displayTempMin = document.querySelector("#min");
  let displayTempMax = document.querySelector("#max");
  let displayFeelsLike = document.querySelector("#feels-like");
  let displayHumidity = document.querySelector("#humidity");
  let displayWindSpeed = document.querySelector("#speed");
  let displayDescription = document.querySelector("#description");
  let date = document.querySelector("#day-time");
  let displaySunrise = document.querySelector("#sunrise");
  let displaySunset = document.querySelector("#sunset");

  displayTempNow.innerHTML = celsiusTemp;
  displayTempMin.innerHTML = tempMin;
  displayTempMax.innerHTML = tempMax;
  displayFeelsLike.innerHTML = feelsLike;
  displayHumidity.innerHTML = humidity;
  displayWindSpeed.innerHTML = Math.round(windSpeed);
  displayDescription.innerHTML = weatherDes;
  date.innerHTML = formatDate(response.data.dt * 1000);
  displaySunrise.innerHTML = formatTime(response.data.sys.sunrise * 1000);
  displaySunset.innerHTML = formatTime(response.data.sys.sunset * 1000);

  // update city name on page
  let updateCity = document.querySelectorAll(".default");
  var i;
  for (i = 0; i < updateCity.length; i++) {
    updateCity[i].innerHTML = response.data.name;
  }

  //update the icon and alternative description on the weather app based on current weather
  let weatherCode = response.data.weather[0].icon;
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weatherCode}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);
}

// implement forecast to be displayed
function showForecast(response) {
  let insertForecast = document.querySelector("#forecast");
  insertForecast.innerHTML = null;

  for (i = 0; i < 5; i++) {
    let forecast = response.data.list[i];
    let forecastTime = formatTime(response.data.list[i].dt * 1000);
    let forecastMin = forecast.main.temp_min;
    let forecastMax = forecast.main.temp_max;
    let forecastIcon = forecast.weather[0].icon;

    insertForecast.innerHTML += `<div class="row">
      <div class="col-sm-4 day"> ${forecastTime}</div>
      <div class="col-sm-4 logo">
        <img src=" https://openweathermap.org/img/wn/${forecastIcon}@2x.png" />
      </div>
  <div class="col-sm-4 temp">${Math.round(forecastMin)}°C / ${Math.round(
      forecastMax
    )}°C</div>
    </div>`;
  }
}

// fetch city that was updated in the search engine and update elements using the open weather API
function search(city) {
  let apiKey = "095c860579f22b3bd8962f914fb1341a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
  axios.get(`${apiUrlForecast}&appid=${apiKey}`).then(showForecast);
}

function displayCity(event) {
  event.preventDefault();
  search(document.getElementById("searchCity").value);
}

// functionality of the current button using geolocation
function obtainPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "095c860579f22b3bd8962f914fb1341a";
  let apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;
  let apiUrlGeoForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric`;

  // now get weather of the geolocation
  axios.get(`${apiUrlGeo}&appid=${apiKey}`).then(showTemp);
  axios.get(`${apiUrlGeoForecast}&appid=${apiKey}`).then(showForecast);
}

function useLocation(event) {
  navigator.geolocation.getCurrentPosition(obtainPosition);
}

// fahrenheit conversion function
function displayFahrenheit(event) {
  event.preventDefault();
  let displayFahrenheit = (celsiusTemp * 9) / 5 + 32;
  let currentDisplayTemp = document.querySelector("#currentTemperature");
  currentDisplayTemp.innerHTML = Math.round(displayFahrenheit);

  document.querySelector("#celsius").classList.remove("active");
  document.querySelector("#fahrenheit").classList.add("active");
}

// conversion back to celsius
function displayCelsius(event) {
  event.preventDefault();
  let currentDisplayTemp = document.querySelector("#currentTemperature");
  currentDisplayTemp.innerHTML = celsiusTemp;

  document.querySelector("#celsius").classList.add("active");
  document.querySelector("#fahrenheit").classList.remove("active");
}

let form = document.querySelector("form");
form.addEventListener("submit", displayCity);

search("London");

//use current location to fetch weather
let locationButton = document.querySelector(".btn-success");
locationButton.addEventListener("click", useLocation);

//fahrenheit conversion
let fahrenheitTemp = document.querySelector("#fahrenheit");
fahrenheitTemp.addEventListener("click", displayFahrenheit);

//conversion back to celsius
let celsiusTempConversion = document.querySelector("#celsius");
celsiusTempConversion.addEventListener("click", displayCelsius);

let celsiusTemp = null;
