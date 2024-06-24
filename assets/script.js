document.getElementById('searchBtn').addEventListener('click', function () {
    var cityName = document.getElementById('cityInput').value;
    if (cityName) {
        fetchWeatherData(cityName);
        fetchFiveDayForecast(cityName);
    } else {
        alert("Please enter a city name");
    }
});


function fetchWeatherData(cityName) {
    var currentWeatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=3266c576b90d62fe56a4b62feab62ebd&units=imperial";
  
    fetch(currentWeatherApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Current Weather Data:', data);

            var cityNameDate = dayjs(data.dt * 1000).format('MMMM D, YYYY h:mm A');
            document.getElementById('currentCityNameDate').textContent = data.name + ": " + cityNameDate;
            document.getElementById('currentTemp').textContent = "Temperature: " + data.main.temp + "°F";
            document.getElementById('currentWindSpeed').textContent = "Wind Speed: " + data.wind.speed + " mph";
            document.getElementById('currentHumidity').textContent = "Humidity: " + data.main.humidity + "%";
            document.getElementById('currentCondition').textContent = "Condition: " + data.weather[0].main;

            var iconCode = data.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            document.getElementById('conditionIcon').src = iconUrl;
        })
        .catch(function (error) {
            console.error('Error fetching current weather:', error);
        });
    }
