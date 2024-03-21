// Getting Json config
fetch('../conf.json')
.then(response => response.json())
.then(config => {
    const { apiKey, cityName } = config;

    // API selected -> OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=fr`;

    // Getting weather data & display
    const fetchWeatherAndUpdateUI = () => {
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pas de réponse réseaux');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.cod !== 200) {
                throw new Error(`Erreur de l'API OpenWeatherMap : ${data.message}`);
            }
            // City display with OpenWeatherMap structure
            const meteoCity = document.getElementById('meteo-container__city');
            meteoCity.innerHTML = `<h2>${data.name}<h2>`;
            
            // Weather element display with OpenWeatherMap structure
            const meteoElement = document.getElementById('meteo');
            meteoElement.innerHTML = 
            `<img class="meteo__logo" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon" />
            <p class="meteo__temperature">${data.main.temp}°C</p>
            <p class="meteo__description">Actuellement : ${data.weather[0].description}</p>
            <p class="meteo__wind">Vent : ${data.wind.speed} m/sec</p>
            <p class="meteo__humidity">Humidité : ${data.main.humidity} %</p>`;    
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
            document.getElementById('meteo-container__city').innerHTML = `<p>Erreur lors de la récupération des données de la ville.</p>`;
            document.getElementById('meteo').innerHTML = `<p>Erreur lors de la récupération des données météo.</p>`;
            
        });
    };

    fetchWeatherAndUpdateUI();

    // Update every hour
    setInterval(fetchWeatherAndUpdateUI, 3600000);
})
.catch(console.error);
