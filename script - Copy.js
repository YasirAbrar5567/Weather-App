document.getElementById('weather-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get the city name from the input
    const city = document.getElementById('city-input').value;

    // Fetch weather data using WeatherAPI
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=fb879c0337fc40088b870813241110&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;

    console.log(`Fetching weather data from: ${weatherUrl}`); // Log the weather URL for debugging

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                console.error(`Error fetching weather data: ${response.status} ${response.statusText}`);
                throw new Error('Failed to fetch weather data');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('forecast').innerHTML = `<p>${error.message}</p>`;
        });
});

// Function to display weather data
function displayWeather(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<h2>Weather Forecast for ${data.location.name}, ${data.location.country}</h2>`;

    // Display current temperature and whether it's day or night
    const currentTemp = data.current.temp_c;
    const isDay = data.current.is_day ? "Day" : "Night";
    forecastDiv.innerHTML += `
        <div>
            <strong>Current Temperature:</strong> ${currentTemp}°C<br>
            <strong>It is currently:</strong> ${isDay}<br>
            <hr>
        </div>
    `;

    // Daily forecast
    const forecastDays = data.forecast.forecastday;
    for (let i = 0; i < forecastDays.length; i++) {
        const day = forecastDays[i];
        const avgTemp = (day.day.maxtemp_c + day.day.mintemp_c) / 2; // Calculate average temperature
        forecastDiv.innerHTML += `
            <div>
                <strong>${new Date(day.date).toLocaleDateString()}</strong><br>
                Max Temp: ${day.day.maxtemp_c}°C<br>
                Min Temp: ${day.day.mintemp_c}°C<br>
                Average Temp: ${avgTemp.toFixed(2)}°C<br>
                Sunrise: ${day.astro.sunrise}<br>
                Sunset: ${day.astro.sunset}<br>
                Precipitation: ${day.day.totalprecip_mm} mm<br>
                Day/Night: ${day.day.is_day === 1 ? "Day" : "Night"}<br>
            </div>
            <hr>
        `;
    }
}
