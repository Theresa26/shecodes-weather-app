// update the last updated time on weather app
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

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
  return `${actualDay} ${hours}:${minutes}`;
}

// update the sunrise time
function showSunrise(time) {
  let sunriseDate = new Date(time);
  let sunriseHours = sunriseDate.getHours();
  if (sunriseHours < 10) {
    sunriseHours = `0${sunriseHours}`;
  }
  let sunriseMinutes = sunriseDate.getMinutes();
  if (sunriseMinutes < 10) {
    sunriseMinutes = `0${sunriseMinutes}`;
  }
  return `${sunriseHours}:${sunriseMinutes}`;
}

// update the sunset time
function showSunset(time) {
  let sunsetDate = new Date(time);
  let sunsetHours = sunsetDate.getHours();
  let sunsetMinutes = sunsetDate.getMinutes();
  if (sunsetMinutes < 10) {
    sunsetMinutes = `0${sunsetMinutes}`;
  }
  return `${sunsetHours}:${sunsetMinutes}`;
}

// fetch city that was updated in the search engine and update elements using the open weather API

function search(city) {
  let apiKey = "095c860579f22b3bd8962f914fb1341a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

function displayCity(event) {
  event.preventDefault();
  search(document.getElementById("searchCity").value);
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

  // sunrise and sunset times (check if you add to separate function)

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
  displaySunrise.innerHTML = showSunrise(response.data.sys.sunrise * 1000);
  displaySunset.innerHTML = showSunset(response.data.sys.sunset * 1000);

  // update city name
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

// functionality of the current button using geolocation
function obtainPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "095c860579f22b3bd8962f914fb1341a";
  let apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;

  // now get weather of the geolocation
  axios.get(`${apiUrlGeo}&appid=${apiKey}`).then(showTemp);
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

let celsiusTempConversion = document.querySelector("#celsius");
celsiusTempConversion.addEventListener("click", displayCelsius);

let celsiusTemp = null;
