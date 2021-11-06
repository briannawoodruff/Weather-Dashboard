/* 
get access to input field 
get access to the button
create function to fetch api data when button is clicked
*/
var inputField = document.querySelector("#city");
var searchButton = document.querySelector(".search");
var pastCityBtns = document.querySelector('#past-cities');
var fiveDayEl = document.querySelector('.five-day-cards');
var apiKey = "c3e754a93a4f13ded8f976731dbbdfc4";

// local storage for cities
if (JSON.parse(localStorage.getItem('cityInput')) !== null) {
    cityInput = JSON.parse(localStorage.getItem("cityInput"));
    for (var i = 0; i < cityInput.length; i++) {
        var showCity = cityInput[i];
        var addedCity = document.createElement("button");
        addedCity.textContent = showCity;
        addedCity.setAttribute("class", "prev-city")
        // addedCity.setAttribute("data-city", showCity);
        pastCityBtns.appendChild(addedCity);
    }
}
var cityInput = [];


// kelvin to F conversion
function convertTemp(temp) {
    return Math.floor(((temp) - 273.15) * (9 / 5) + 32)
}
// metric to imperial conversion
function convertToImperial(meter) {
    return Math.floor(meter * 2.236936)
}

// fetchData for city searched
function fetchData(newCity) {
    var cityName = inputField.value || newCity;

    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            console.log(weatherData);

            var currentName = document.getElementById('city-name');
            currentName.textContent = weatherData.name;
            var currentDate = document.getElementById('city-date');
            function displayTime() {
                var rightNow = moment();
                currentDate.textContent = rightNow.format('(' + 'L' + ')');
            }
            displayTime();

            var iconEl = document.getElementById('city-icon');
            var icon = weatherData.weather[0].icon;
            // var currentIcon = document.createElement("img");
            iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");

            var currentTemp = document.getElementById('temp');
            var currentWind = document.getElementById('wind');
            var currentHumidity = document.getElementById('humidity');

            currentTemp.textContent = convertTemp(weatherData.main.temp) + " F";
            currentWind.textContent = convertToImperial(weatherData.wind.speed) + " MPH";
            currentHumidity.textContent = weatherData.main.humidity + "%";


            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;

            pastCities();
            fetchUV(lat, lon);
            fetch5Day(cityName);

            inputField.value = ''
        })
}

// fetchUV for city searched
function fetchUV(lat, lon) {
    // var apiKey = "c3e754a93a4f13ded8f976731dbbdfc4";
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            console.log(weatherData);

            var currentUV = document.getElementById('uv-index');
            var uvI = weatherData.current.uvi;
            currentUV.textContent = uvI;
            // console.log(uvI);

            if (uvI <= 2) {
                currentUV.classList = "low"
            } else if (uvI > 2 && uvI <= 8) {
                currentUV.classList = "moderate"
            }
            else if (uvI > 8) {
                currentUV.classList = "high"
            };

        })
}

// fetchUV for city searched
function fetch5Day(cityName) {
    // var apiKey = "c3e754a93a4f13ded8f976731dbbdfc4";
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            console.log(weatherData);

            fiveDayEl.textContent = "";

            var forecast = weatherData.list;
            console.log(forecast)
            for (var i = 5; i < forecast.length; i = i + 8) {
                var forecastCards = forecast[i];

                var cardDiv = document.createElement("div");
                fiveDayEl.classList = "card";
                fiveDayEl.append(cardDiv);

                var forecastDate = document.createElement("h5")
                forecastDate.textContent = moment.unix(forecastCards.dt).format("MMM D, YYYY");
                cardDiv.appendChild(forecastDate);

                //create an image element
                var dayIcon = document.createElement("img")
                var newIcon = forecastCards.weather[0].icon;
               dayIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + newIcon + "@2x.png");
                cardDiv.appendChild(dayIcon);

            };
        })
}

searchButton.addEventListener("click", fetchData);

function pastCities() {
    var showCity = inputField.value;
    var addedCity = document.createElement("button");
    addedCity.textContent = showCity || newCity;
    addedCity.setAttribute("class", "prev-city");
    addedCity.setAttribute("type", "button");
    pastCityBtns.prepend(addedCity);
    cityInput.push(showCity)
    localStorage.setItem("cityInput", JSON.stringify(cityInput));

    addedCity.addEventListener("click", function (event) {
        event.preventDefault();
        recallCity(this)
    });

    function recallCity(target) {
        var newCity = target.textContent
        fetchData(newCity)
        target.clear
    }

}