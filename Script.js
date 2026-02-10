//Desafio Front-end: Dashboard de Clima e Sugestão de Looks
//A Ideia: Criar um site que consulte uma API de previsão do tempo (ex: OpenWeather) e, dependendo da temperatura, sugira o que o usuário deve vestir ou fazer (ex: "Está 15°C, leve um casaco!").
//Requisitos:
//Campo de busca por cidade.
//Card central com temperatura atual, umidade e ícone do tempo.
//Lógica JS para exibir mensagens dinâmicas baseadas na temperatura.
//Layout totalmente responsivo (mobile-first).
//Entrega estimada: 10/02.  Enviar repositório do projeto no github.

// API key from OpenWeather
// I will replace this with my own key


const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Enter a city");
        return;
    }

    // 1) Get city coordinates
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(geoData => {

            if (!geoData.results || geoData.results.length === 0) {
                alert("City not found");
                return;
            }

            const location = geoData.results[0];
            const lat = location.latitude;
            const lon = location.longitude;

            document.getElementById("cityName").textContent =
                location.name + ", " + location.country;

            // 2) Get weather using coordinates
            const weatherUrl =
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;

            return fetch(weatherUrl);
        })
        .then(response => response.json())
        .then(weatherData => {

            const weather = weatherData.current_weather;
            const temp = Math.round(weather.temperature);
            const wind = weather.windspeed;

            // humidity (current hour)
            const humidity = weatherData.hourly.relativehumidity_2m[0];

            document.getElementById("temperature").textContent =
                "Temperature: " + temp + "°C";

            document.getElementById("wind").textContent =
                "Wind: " + wind + " km/h";

            document.getElementById("humidity").textContent =
                "Humidity: " + humidity + "%";

            document.getElementById("description").textContent =
                "Weather code: " + weather.weathercode;

            // Clothing suggestion
            let suggestion = "";

            if (temp <= 10) {
                suggestion = "Very cold. Wear a coat.";
            } else if (temp <= 18) {
                suggestion = "Cool weather. Take a jacket.";
            } else if (temp <= 26) {
                suggestion = "Nice weather. Light clothes are fine.";
            } else {
                suggestion = "Hot weather. Stay hydrated.";
            }

            document.getElementById("suggestion").textContent = suggestion;

            document.getElementById("result").classList.remove("hidden");
        })
        .catch(() => {
            alert("Error loading weather data");
        });
});