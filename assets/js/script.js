/* 
get access to input field 
get access to the button
create function to fetch api data when button is clicked
*/
var body = document.body.children[1].children[1].children[0];
var inputField = document.querySelector("#city");
var searchButton = document.querySelector(".search");
var pastCityBtns = document.querySelector('#past-cities');
// var pastButton = document.querySelectorAll(".prev-city"); 

// local storage for cities
if (JSON.parse(localStorage.getItem('cityInput')) !== null) {
    cityInput = JSON.parse(localStorage.getItem("cityInput"));
    for (var i = 0; i < cityInput.length; i++) {
        var showCity = cityInput[i];
        var addedCity = document.createElement("button");
        addedCity.textContent = showCity;
        addedCity.setAttribute("class", "prev-city")
        addedCity.setAttribute("data-city", showCity);
        pastCityBtns.appendChild(addedCity);
        console.log(showCity)
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
    function fetchData() {
        var cityName = inputField.value;
        var apiKey = "c3e754a93a4f13ded8f976731dbbdfc4";
        var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
        
        fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            // console.log(weatherData);
            
            var currentTemp = document.getElementById('temp');
            var currentWind = document.getElementById('wind');
            var currentHumidity = document.getElementById('humidity');
            // var uvIndex = document.getElementById('#uv-index');
            
            currentTemp.textContent = convertTemp(weatherData.main.temp) + " F";
            currentWind.textContent = convertToImperial(weatherData.wind.speed) + " MPH";
            currentHumidity.textContent = weatherData.main.humidity + "%";
            // uvIndex.textContent = "Weather Description: " + weatherData.weather[0].main + ", " + weatherData.weather[0].description;

            saveSearchBtn();

            inputField.value = ''
        })
}

searchButton.addEventListener("click", fetchData);
// pastCityBtns.addEventListener("click", pastSearchHandler);


function saveSearchBtn() {
    var showCity = inputField.value;
    var addedCity = document.createElement("button");
    addedCity.textContent = showCity;
    addedCity.setAttribute("class", "prev-city");
    addedCity.setAttribute("data-city", showCity);
    pastCityBtns.appendChild(addedCity);
    // console.log(showCity)
    cityInput.push(showCity)
    localStorage.setItem("cityInput", JSON.stringify(cityInput));
}