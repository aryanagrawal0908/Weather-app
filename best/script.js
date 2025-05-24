document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('search-button');
    const input = document.getElementById('city-input');
    const cityName = document.getElementById('city-name');
    const cityLocation = document.getElementById('city-location');
    const tempElement = document.getElementById('temp');
    const weatherCondition = document.getElementById('weather-condition');
    const realFeel = document.getElementById('real-feel');
    const windSpeed = document.getElementById('wind-speed');
    const windGusts = document.getElementById('wind-gusts');
    const airQuality = document.getElementById('air-quality');

    async function fetchWeatherData(city) {
        try {
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=0fb888cadc334d7bbe8180632251405&q=${city}&aqi=yes`
            );
            if (!response.ok) {
                throw new Error('City not found');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    function getWeatherEmoji(condition) {
        if (condition.includes('Sunny')) return '☀️';
        if (condition.includes('Rain')) return '🌧️';
        if (condition.includes('Cloud')) return '☁️';
        return '🌤️'; // Default emoji
    }

    button.addEventListener('click', async () => {
        try {
            const value = input.value.trim();
            if (!value) return;

            button.disabled = true;
            const result = await fetchWeatherData(value);

            cityName.innerText = result.location.name;
            cityLocation.innerText = `${result.location.region}, ${result.location.country}`;
            tempElement.innerText = result.current.temp_c;
            const conditionText = result.current.condition.text;
            weatherCondition.innerText = `${conditionText} ${getWeatherEmoji(conditionText)}`;
            realFeel.innerText = `${result.current.feelslike_c}°`;
            windSpeed.innerText = `${result.current.wind_dir} ${result.current.wind_kph} km/h`;
            windGusts.innerText = `${result.current.gust_kph} km/h`;
            airQuality.innerText = result.current.air_quality.pm2_5 > 50 ? 'Poor' : 'Good';
            airQuality.style.color = result.current.air_quality.pm2_5 > 50 ? 'orange' : 'green';

            input.value = '';
        } catch (error) {
            cityName.innerText = 'City not found';
            cityLocation.innerText = '';
            tempElement.innerText = '--';
            weatherCondition.innerText = 'City not found';
            realFeel.innerText = '--';
            windSpeed.innerText = '--';
            windGusts.innerText = '--';
            airQuality.innerText = '--';
            airQuality.style.color = 'black';
        } finally {
            button.disabled = false;
        }
    });
});