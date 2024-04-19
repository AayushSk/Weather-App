console.log('Welcome Everyone');

let API = "e4a0335abdcd8d8452b7f9fd5c95653f";

function renderWeatherInfo(data) {
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2) - 273.15} °C`;
    document.body.appendChild(newPara);
}

async function showWeather() {
    try {
    let city = "goa";
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`);
        
    const data = await response.json();
    console.log("Weather data:->" , data);
    
    renderWeatherInfo(data);
    }
    
    catch(err) {
        console.log('Error Found' , err);
    }
}

async function getCustomWeatherData() {
    try {
    let lat = 0;
    let long = 0;
        
    let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API}`);
    
    const data = await result.json();
    console.log(data);

    renderWeatherInfo(data);
    }

    catch(err) {
        console.log('Error Found' , err);
    }
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log('No Geolocation Support');
    }
}

function showPosition(position) {
    let lat = position.coords.latitude;
    let longi = position.coords.longitude;

    console.log(lat);
    console.log(longi);

}