/*==================== Declaracion de variables ====================*/

const Texto_geo = document.getElementById('texto_geo');
const boton_ocultar = document.getElementById('boton_movil');

const Dia = document.getElementById('dia');
const Fecha = document.getElementById('fecha');
const Hora = document.getElementById('hora');
const Pais = document.getElementById('pais');
const Ciudad = document.getElementById('ciudad');
const Temperatura = document.getElementById('temp_actual');
const Estado = document.getElementById('estado_actual');
const Clima_icono = document.getElementById('clima-icono');
const Temp_hoy = document.getElementById('temp_hoy');
const Pronostico = document.getElementById('pronostico_clima');
const Dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const Meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const Sensacion = document.getElementById('sensacion');
const Humedad = document.getElementById('humedad');
const Viento = document.getElementById('viento');
const Presion = document.getElementById('presion');
const Rocio = document.getElementById('rocio');
const Visibilidad = document.getElementById('visibilidad');

/*==================== Obtener el dia, la hora y fecha ====================*/

setInterval(() => {
    const tiempo = new Date();
    const año = tiempo.getFullYear();
    const mes = tiempo.getMonth();
    const fecha = tiempo.getDate();
    const dia = tiempo.getDay();
    const hora = ("0" + tiempo.getHours()).slice(-2);
    const hora_12h = hora >= 13 ? hora %12 : hora;
    const minutos = ("0" + tiempo.getMinutes()).slice(-2);
    const am_pm = hora >= 12 ? 'PM' : 'AM';

    Dia.innerHTML = Dias[dia];
    Hora.innerHTML = hora_12h + ':' + minutos + ' ' + `<span id="am_pm">${am_pm}</span>`;
    Fecha.innerHTML = fecha + ' ' + Meses[mes] + ', ' + año;
}, 1000)

/*==================== Obtener el clima ====================*/

const API_KEY = ''; // Aqui se agrega la llave API de OpenWeatherMap (Eliminada del repositorio publico)

function ObtenerClima() {
    // Se pide permiso de geolocalizacion al usuario
    navigator.geolocation.getCurrentPosition((success) => {
        // console.log(success);
        // Se toma la latitud y longitud del la posición del usuario
        let {latitude, longitude} = success.coords;

        // Se hace la petición a la API de OpenWeatherMap con la latitud y longitud, se obtiene un json con los datos del clima y la ciudad, y se llama a la función MostrarCiudad y MostrarClima
        fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${API_KEY}`).then(res => res.json()).then(datos_ciudad => {
            // console.log(datos_ciudad)
            MostrarCiudad(datos_ciudad);})

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=hourly,minutely&appid=${API_KEY}&lang=sp`).then(res => res.json()).then(datos_clima => {
            // console.log(datos_clima)
            MostrarClima(datos_clima);})
    })
}


function ocultar_clima() {
    const toggle_clima = document.getElementById("clima_actual");
    toggle_clima.classList.toggle("ocultar");
} 

// Pedir la geolocalización con el botón
ObtenerClima();

// Boton para ocultar el clima semanal
boton_ocultar.addEventListener('click', ocultar_clima);

/*==================== Mostrar la ciudad y el clima ====================*/

function MostrarCiudad(datos_ciudad) {
    // Se toma el nombre y el pais de la respuesta de la API
    let {name, country} = datos_ciudad[0];
    Ciudad.innerHTML = name + ', ' + country;
}

function MostrarClima(datos_clima) {
    const Dias_clima = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const Dias_clima_comp = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const tiempo_dia = new Date();
    const dia_clima = tiempo_dia.getDay();

    // Se toman los datos del clima de la respuesta de la API y la descripción del clima
    let {temp, feels_like, humidity, wind_speed, dew_point, pressure, visibility} = datos_clima.current;
    let {description, icon} = datos_clima.current.weather[0];



    // Se da formato a los datos del clima para mostrarlos en pantalla
    Temperatura.innerHTML = `${parseFloat(temp).toFixed(1)}°C`;
    Sensacion.innerHTML = `<span id="sensacion" class="texto-clima">${parseFloat(feels_like).toFixed(1)}°C</span>`;
    Humedad.innerHTML = `<span id="humedad" class="texto-clima">${humidity}%</span>`;
    Viento.innerHTML = `<span id="viento" class="texto-clima">${wind_speed} m/s</span>`;
    Presion.innerHTML = `<span id="presion" class="texto-clima">${pressure} hPa</span>`;
    Rocio.innerHTML = `<span id="rocio" class="texto-clima">${parseFloat(dew_point).toFixed(1)}°C</span>`;
    Visibilidad.innerHTML = `<span id="visibilidad" class="texto-clima">${visibility} m</span>`;
    Estado.innerHTML = description.charAt(0).toUpperCase() + description.slice(1);
    Clima_icono.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@4x.png" alt="icono clima del ${Dias_clima_comp[dia_clima]}"></img>`
    Texto_geo.innerHTML = `<span id="texto_geo">Este es el clima en tu zona</span>`;

    let Clima_otros_dias = ''

    // En un foreach se recorre el array de los días del pronostico y se llenan con los datos (hasta 5 días)
    datos_clima.daily.forEach((dias, index) => {
        let fecha = new Date(dias.dt * 1000);

        if(index == 0){
            Temp_hoy.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${dias.weather[0].icon}@4x.png" alt="icono clima del ${Dias_clima_comp[dia_clima]}">
            <div class="other">
                <div class="pronostico-dia">${Dias_clima_comp[dia_clima]}</div>
                <div class="temp">Min: ${dias.temp.min}&#176;C</div>
                <div class="temp">Max: ${dias.temp.max}&#176;C</div>
            </div>
            
            `
        }else if (index <= 5){
            Clima_otros_dias += `
            <div class="pronostico-item">
                <div class="pronostico-dia">${Dias_clima[fecha.getDay()]}</div>
                <img src="http://openweathermap.org/img/wn/${dias.weather[0].icon}@2x.png" alt="icono clima del ${Dias_clima_comp[fecha.getDay()]}">
                <div class="temp">Min: ${dias.temp.min}°C</div>
                <div class="temp">Max: ${dias.temp.max}°C</div>
            </div>
            
            `
        }
    })

    Pronostico.innerHTML = Clima_otros_dias;

}

console.log('© Michel Dávila Rodríguez. 2022')