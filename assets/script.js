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

function fetchFiveDayForecast(cityName) {
    var fiveDayForecastApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=3266c576b90d62fe56a4b62feab62ebd&units=imperial";

    fetch(fiveDayForecastApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Five Day Forecast Data:', data);
            var forecastList = data.list;
            var dailyData = {};

            // Process the data to extract daily summaries
            forecastList.forEach(function (forecast) {
                var date = dayjs(forecast.dt * 1000).format('YYYY-MM-DD');
                if (!dailyData[date]) {
                    dailyData[date] = {
                        temp: [],
                        wind: [],
                        humidity: [],
                        icon: forecast.weather[0].icon,
                        condition: forecast.weather[0].main
                    };
                }
                dailyData[date].temp.push(forecast.main.temp);
                dailyData[date].wind.push(forecast.wind.speed);
                dailyData[date].humidity.push(forecast.main.humidity);
            });
        
            // Populate the forecast data for 5 days
            var dayIndex = 1;
            for (var date in dailyData) {
                if (dayIndex > 5) break;
                var dayData = dailyData[date];
                var avgTemp = (dayData.temp.reduce((a, b) => a + b, 0) / dayData.temp.length).toFixed(2);
                var avgWind = (dayData.wind.reduce((a, b) => a + b, 0) / dayData.wind.length).toFixed(2);
                var avgHumidity = (dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length).toFixed(2);
                var iconUrl = "http://openweathermap.org/img/w/" + dayData.icon + ".png";

                document.getElementById(`day${dayIndex}CityNameDate`).textContent = dayjs(date).format('MMMM D, YYYY');
                document.getElementById(`day${dayIndex}Temp`).textContent = "Temp: " + avgTemp + "°F";
                document.getElementById(`day${dayIndex}Wind`).textContent = "Wind: " + avgWind + " mph";
                document.getElementById(`day${dayIndex}Humidity`).textContent = "Humidity: " + avgHumidity + "%";
                document.getElementById(`day${dayIndex}Icon`).src = iconUrl;
                dayIndex++;
            }
        })
        .catch(function (error) {
            console.error('Error fetching five day forecast:', error);
        });
}