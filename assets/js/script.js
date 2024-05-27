$(document).ready(function () {
    const apiKey = process.env.WEATHER_API_KEY; // Replace with your OpenWeatherMap API key

    function getWeather(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                const weather = `
                    <h3>${data.name} (${new Date().toLocaleDateString()}) <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather icon"></h3>
                    <p>Temp: ${data.main.temp} °F</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} MPH</p>
                `;
                $('#weather-result').html(weather);
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                getForecast(lat, lon);
            })
            .catch(error => {
                $('#weather-result').html(`<p class="text-danger">${error.message}. Please try again.</p>`);
            });
    }

    function getForecast(lat, lon) {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                let forecastHtml = '<h3>5-Day Forecast:</h3>';
                for (let i = 0; i < data.list.length; i += 8) { // Every 24 hours (8 * 3 hours = 24 hours)
                    const forecast = data.list[i];
                    forecastHtml += `
                        <div class="forecast-card col-md-2">
                            <h5>${new Date(forecast.dt_txt).toLocaleDateString()}</h5>
                            <img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather icon">
                            <p>Temp: ${forecast.main.temp} °F</p>
                            <p>Humidity: ${forecast.main.humidity}%</p>
                            <p>Wind: ${forecast.wind.speed} MPH</p>
                        </div>
                    `;
                }
                $('#forecast-cards').html(forecastHtml);
            });
    }

    function updateSearchHistory(city) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
        displaySearchHistory();
    }

    function displaySearchHistory() {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        let historyHtml = '<h4>Search History:</h4>';
        searchHistory.forEach(city => {
            historyHtml += `<button class="history-btn">${city}</button>`;
        });
        $('#search-history').html(historyHtml);
    }

    $('#weather-form').submit(function (event) {
        event.preventDefault();
        const city = $('#city').val();
        getWeather(city);
        updateSearchHistory(city);
    });

    $('#search-history').on('click', '.history-btn', function () {
        const city = $(this).text();
        getWeather(city);
    });

    displaySearchHistory();
});
