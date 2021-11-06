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

// local storage for cities and creates new buttons based on what is saved in local storage
if (JSON.parse(localStorage.getItem('cityInput')) !== null) {
    cityInput = JSON.parse(localStorage.getItem("cityInput"));
    for (var i = 0; i < cityInput.length; i++) {
        var showCity = cityInput[i];
        var addedCity = document.createElement("button");
        addedCity.textContent = showCity;
        addedCity.setAttribute("class", "prev-city")
        pastCityBtns.appendChild(addedCity);
    }
}
// array where cityNames are pushed to
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

            // appends inputed city's name
            var currentName = document.getElementById('city-name');
            currentName.textContent = weatherData.name;

            // appends inputed city's date
            var currentDate = document.getElementById('city-date');
            // momentjs function
            function displayTime() {
                var rightNow = moment();
                currentDate.textContent = rightNow.format('(' + 'L' + ')');
            }
            displayTime();

            // adds icon of weather to img element
            var iconEl = document.getElementById('city-icon');
            var icon = weatherData.weather[0].icon;
            iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");

            // adds temp to span and converted to F
            var currentTemp = document.getElementById('temp');
            currentTemp.textContent = convertTemp(weatherData.main.temp) + " °F";

            // adds wind to span and converted to imperial
            var currentWind = document.getElementById('wind');
            currentWind.textContent = convertToImperial(weatherData.wind.speed) + " MPH";

            // adds humidity to span
            var currentHumidity = document.getElementById('humidity');
            currentHumidity.textContent = weatherData.main.humidity + "%";

            // gets inputed city's lat and lon to be used in fetchUV function
            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;

            // calls next functions to save to local storage and call other apis
            pastCities();
            fetchUV(lat, lon);
            fetch5Day(cityName);

            // clears input field
            inputField.value = ''
        })
}

// fetchUV for city searched
function fetchUV(lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            console.log(weatherData);

            // adds UV data to span
            var currentUV = document.getElementById('uv-index');
            var uvI = weatherData.current.uvi;
            currentUV.textContent = uvI;

            // changes color depending on severity
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

// fetch5Day for city searched
function fetch5Day(cityName) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            console.log(weatherData);

            // clears the fiveDayEl each time searched
            fiveDayEl.textContent = "";

            var forecast = weatherData.list;
            // for loop going through the 5 days and putting them in divs
            for (var i = 5; i < forecast.length; i = i + 8) {
                var forecastCards = forecast[i];

                // creating each div
                var cardDiv = document.createElement("div");
                cardDiv.classList = "card";

                // adding date element
                var forecastDate = document.createElement("h5");
                forecastDate.textContent = moment.unix(forecastCards.dt).format("MMM D, YYYY");
                cardDiv.appendChild(forecastDate);

                // adding icon for each day
                var dayIcon = document.createElement("img");
                var newIcon = forecastCards.weather[0].icon;
                dayIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + newIcon + "@2x.png");
                cardDiv.appendChild(dayIcon);

                // adding temp for each day
                var forecastTemp = document.createElement("p");
                forecastTemp.textContent = convertTemp(forecastCards.main.temp) + " °F";
                cardDiv.appendChild(forecastTemp);

                // adding wind for each day
                var forecastWind = document.createElement("p");
                forecastWind.textContent = convertToImperial(forecastCards.wind.speed) + " MPH";
                cardDiv.appendChild(forecastWind);

                // adding humidity for each day
                var forecastHum = document.createElement("p");
                forecastHum.textContent = forecastCards.main.humidity + "%";
                cardDiv.appendChild(forecastHum);

                // appending to the fiveDayEl section
                fiveDayEl.append(cardDiv);
            };
        })
}

// eventListener for search button
searchButton.addEventListener("click", fetchData);

// saving past city to local storage and creating a button to be searched again
function pastCities() {
    var showCity = inputField.value;
    var addedCity = document.createElement("button");
    addedCity.textContent = showCity || newCity;
    addedCity.setAttribute("class", "prev-city");
    addedCity.setAttribute("type", "button");
    pastCityBtns.prepend(addedCity);
    cityInput.push(showCity)
    localStorage.setItem("cityInput", JSON.stringify(cityInput));

    // eventListener for the past seached buttons
    addedCity.addEventListener("click", function (event) {
        event.preventDefault();
        recallCity(this)
    });

    // makes new variable based on what's in the textContent to send to fetchData function when each button is clicked
    function recallCity(target) {
        var newCity = target.textContent
        fetchData(newCity)
        target.clear
    }

}