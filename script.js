// Handle response after Google Sign-In
function handleCredentialResponse(response) {
    const data = JSON.parse(atob(response.credential.split('.')[1]));
    console.log("User:", data);

    // Extract profile information
    const profilePicUrl = data.picture;
    const userName = data.name;
    const userEmail = data.email;

    // Display profile picture, name, and email (Gmail)
    document.getElementById('profile-pic').src = profilePicUrl;
    document.getElementById('user-name').textContent = `Welcome, ${userName}!`;
    document.getElementById('user-email').textContent = userEmail;

    // Show the user info section
    document.getElementById('user-info').style.display = 'flex';
}

// Your existing weather-fetching code
const apiKey = 'cedf1b920ea093a9d0d9354a7a125095';  // Replace with your OpenWeather API Key
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Ulaanbaatar&appid=${apiKey}&units=metric`;

async function fetchWeather() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Update HTML with weather data
        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('feels-like').textContent = `Feels Like: ${data.main.feels_like} °C`;
        document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind').textContent = `Wind Speed: ${data.wind.speed} m/s`;

        const iconCode = data.weather[0].icon;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}.png`;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById('temperature').textContent = "Failed to load data.";
    }
}

fetchWeather();
