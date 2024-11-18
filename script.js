// Check if user is logged in
if (sessionStorage.getItem('user')) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('weather-container').style.display = 'block';
    getWeather();
}

// Weather function
function getWeather() {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
    const city = 'London';  // Default city
    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            const weatherElement = document.getElementById('weather');
            weatherElement.innerHTML = `Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}`;
        })
        .catch(error => console.error('Error fetching weather:', error));
}

// Logout
document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('user');
    window.location.href = '/';
});
