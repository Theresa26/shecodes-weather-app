// set the current time on the weather app

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

// make sure that the city that is being searched for is being displayed
// double check why it works now for the querselector but not queryselectorAll

function displayCity(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#searchCity");
  let defaultCity = document.querySelectorAll(".default");
  var i;
  for (i = 0; i < defaultCity.length; i++) {
    defaultCity[i].innerHTML = searchCity.value;
  }

  var city = document.getElementById("searchCity").value;
  let apiKey = "095c860579f22b3bd8962f914fb1341a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

let form = document.querySelector("form");
form.addEventListener("submit", displayCity);

// pull the acutal weather for the location that is being entered

function showTemp(response) {
  let tempNow = Math.round(response.data.main.temp);
  let tempMin = Math.round(response.data.main.temp_min);
  let tempMax = Math.round(response.data.main.temp_max);
  let feelsLike = Math.round(response.data.main.feels_like);

  let weatherDes = response.data.weather[0].description;
  let windSpeed = response.data.wind.speed;
  let humidity = response.data.main.humidity;

  // sunrise and sunset times (check if you add to separate function)

  let sunriseDate = new Date(response.data.sys.sunrise * 1000);
  let sunriseHours = sunriseDate.getHours();
  if (sunriseHours < 10) {
    sunriseHours = `0${sunriseHours}`;
  }
  let sunriseMinutes = sunriseDate.getMinutes();
  if (sunriseMinutes < 10) {
    sunriseMinutes = `0${sunriseMinutes}`;
  }
  let sunriseTime = `${sunriseHours}:${sunriseMinutes}`;

  let sunsetDate = new Date(response.data.sys.sunset * 1000);
  let sunsetHours = sunsetDate.getHours();
  let sunsetMinutes = sunsetDate.getMinutes();
  if (sunsetMinutes < 10) {
    sunsetMinutes = `0${sunsetMinutes}`;
  }
  let sunsetTime = `${sunsetHours}:${sunsetMinutes}`;

  let displayTempNow = document.querySelector("#currentTemperature");
  displayTempNow.innerHTML = tempNow;

  let displayTempMin = document.querySelector("#min");
  displayTempMin.innerHTML = tempMin;

  let displayTempMax = document.querySelector("#max");
  displayTempMax.innerHTML = tempMax;

  let displayFeelsLike = document.querySelector("#feels-like");
  displayFeelsLike.innerHTML = feelsLike;

  let displayHumidity = document.querySelector("#humidity");
  displayHumidity.innerHTML = humidity;

  let displayWindSpeed = document.querySelector("#speed");
  displayWindSpeed.innerHTML = Math.round(windSpeed);

  let displayDescription = document.querySelector("#description");
  displayDescription.innerHTML = weatherDes;

  let date = document.querySelector("#day-time");
  date.innerHTML = formatDate(response.data.dt * 1000);

  let displaySunrise = document.querySelector("#sunrise");
  displaySunrise.innerHTML = sunriseTime;

  let displaySunset = document.querySelector("#sunset");
  displaySunset.innerHTML = sunsetTime;

  //update the icon on the weather app based on current weather
  let weatherCode = response.data.weather[0].icon;
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherCode}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);
}

// functionality of the current button using geolocation

function updateCityGeo(input) {
  let geoLocation = input.data.name;
  console.log(geoLocation);
  let defaultCity = document.querySelectorAll(".default");
  var i;
  for (i = 0; i < defaultCity.length; i++) {
    defaultCity[i].innerHTML = geoLocation;
  }
}

function obtainPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "095c860579f22b3bd8962f914fb1341a";
  let apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;

  // now get weather of the geolocation
  axios.get(`${apiUrlGeo}&appid=${apiKey}`).then(showTemp);
  axios.get(`${apiUrlGeo}&appid=${apiKey}`).then(updateCityGeo);
}

function useLocation(event) {
  navigator.geolocation.getCurrentPosition(obtainPosition);
}

let locationButton = document.querySelector(".btn-success");
locationButton.addEventListener("click", useLocation);
