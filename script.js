const apiKey = 'YOUR_API_KEY';  // Replace with your OpenWeatherMap API key
const city = 'London';  // Change to any city of your choice

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        if (data.cod === 200) {
            const temperature = data.main.temp;
            const weatherDescription = data.weather[0].description;
            document.getElementById('weather').innerHTML = 
                `Temperature: ${temperature}°C, Weather: ${weatherDescription}`;
        } else {
            console.error("Error fetching weather data");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
