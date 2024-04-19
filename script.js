const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const notFoundContainer = document.querySelector(".not-found-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// Initial variable needs
let currentTab = userTab;
const API =  "e4a0335abdcd8d8452b7f9fd5c95653f";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
    notFoundContainer.classList.remove("active");
    // check if clickedTab is already selected or not
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        // check which Tab is Selected - search / your

        // If Search Form not contains active class then add [Search Weather]
        if(!searchForm.classList.contains("active")) {
            // kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        // Your weather
        else {
            // main pahle search wale tab pr tha, ab your weather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // Ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local storage first
            // for coordinates, if we haved saved then there.
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    // Pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // Pass clicked tab as input parameter
    switchTab(searchTab);
});

// Check if coordinates are already present in session storage
function getFromSessionStorage() {
    const  localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        // agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
        notFoundContainer.classList.remove("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        // HW
        console.log("Error Found", err);
        alert("Error Found", err);
    }
}

// render weather on UI
function renderWeatherInfo(weatherInfo) {
    // firstly, we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    const tempInDegree = weatherInfo?.main?.temp-273.15;
    const tempUptoTwoDecimals = tempInDegree.toFixed(2);

    // fetch values from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${tempUptoTwoDecimals} °C`;
    // temp.innerText = `${weatherInfo?.main?.temp} K`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else {
        // HW - show an alert for no geolocation support available
        console.log("No Geolocation Support Available");
        alert("No Geolocation Support Available");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates); 
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityNmae = searchInput.value;

    if(cityNmae === "")
        return;
    else{
        fetchSearchWeatherInfo(cityNmae);
        searchInput.value = "";
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active"); 
    notFoundContainer.classList.remove("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`
        );
        const data = await response.json();

        if(data?.name === undefined){
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFoundContainer.classList.add("active");
        }
        else {
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
    }
    catch (err) {
        // HW
        console.log('Error Found',err);
        alert("Error Found", err);
    }
}

