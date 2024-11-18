const apiKey = 'cedf1b920ea093a9d0d9354a7a125095';  // Your OpenWeatherMap API key
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Ulaanbaatar&appid=${apiKey}&units=metric`;

async function fetchWeather() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Update the HTML with weather data
        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('feels-like').textContent = `Feels Like: ${data.main.feels_like} °C`;
        document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind').textContent = `Wind Speed: ${data.wind.speed} m/s`;

        // Weather icon
        const iconCode = data.weather[0].icon;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}.png`;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById('temperature').textContent = "Failed to load data.";
    }
}

fetchWeather();
