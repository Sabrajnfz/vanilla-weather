//Add a search engine
//display the current date and time

function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

let dateElement = document.querySelector("#realDate");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let search = document.querySelector("#search-form");
search.addEventListener("click", searchCity);

//forcast weather
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function showForcast(response) {
  let forcast = response.data.daily;
  let forcastElement = document.querySelector("#forcast");

  let forcastHTML = `<div class="row">`;
  forcast.forEach(function (forcastDay, index) {
    if (index < 5) {
      forcastHTML =
        forcastHTML +
        `
   
              <div class="col-2">
                <div class="forecast-time">${formatDay(forcastDay.dt)}</div>
                <img src="https://openweathermap.org/img/wn/${
                  forcastDay.weather[0].icon
                }@2x.png"  />
                <div class="forecast-temperature">
                  <span class="forecast-temperature-max">${Math.round(
                    forcastDay.temp.max
                  )}</span>°<span
                    class="forecast-temperature-min"
                    >${Math.round(forcastDay.temp.min)}</span
                  >°
                </div>
              </div>
            
  `;
    }
  });

  forcastHTML = forcastHTML + `</div>`;
  forcastElement.innerHTML = forcastHTML;
}

function getForcast(coordinates) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&unit=metric`;

  axios.get(apiUrl).then(showForcast);
}

//unit conversion

function cToF(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#tempertureDegree");
  Celeciuslink.classList.add("active");
  farenheitlink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let Celeciuslink = document.querySelector("a#Celecius-link");
Celeciuslink.addEventListener("click", cToF);

function fToC(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#tempertureDegree");
  Celeciuslink.classList.remove("active");
  farenheitlink.classList.add("active");
  let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;

  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}
let farenheitlink = document.querySelector("a#Farenheit-link");
farenheitlink.addEventListener("click", fToC);

//display the name of the city

function showTemperatre(response) {
  let temperature = Math.round(response.data.main.temp);
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#tempertureDegree").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  celsiusTemperature = response.data.main.temp;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForcast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperatre);
}

function citySubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

//add current location button

function searchLocation(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperatre);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", citySubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("paris");
