const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")

const grantAccesssContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

//initially Varibales need???
let currentTab = userTab;
const API_KEY = "f7cae82f35d34bcb7a01987c73ed944b"
currentTab.classList.add("current-tab")
getfromSessionStorage()

function switchTab(clickedTab) {
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes thenmake it visible
            userInfoContainer.classList.remove("active")
            grantAccesssContainer.classList.remove("active")
            searchForm.classList.add("active")
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible krna hai
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active")
            //ab main your weather tab me aagaya hu, to weather bhi display krna prega, so let's check loacal storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage()
        }
    }

}
userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(userTab)
})

searchTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(searchTab)
})

//check if coordinates are already present in the session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if(!localCoordinates) {
        //agar local coordinates nahi mile 
        grantAccesssContainer.classList.add("active")
    }
    else {
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates
    //make grantcontainer invisible
    grantAccesssContainer.classList.remove("active")
    //make loader visible
    loadingScreen.classList.add("active")


//API CAll
try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    const data = await response.json()

    loadingScreen.classList.remove("active")
    userInfoContainer.classList.add("active")
    renderWeatherInfo(data)
    } 
catch (err) {
    loadingScreen.classList.remove("active")
    //HW
    }
}

function renderWeatherInfo(weatherInfo) {
    //firstly, we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    //fetch values from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name
    countryIcon.src = `https://flagcdn.com/144*108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText = weatherInfo?.weather?.[0]?.description
    weatherIcon.src = `http://openweathermap.org/img/w/s{weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText = weatherInfo?.main?.temp
    windspeed.innerText = weatherInfo?.wind?.speed
    humidity.innerText = weatherInfo?.main?.humidity
    cloudiness.innerText = weatherInfo?.clouds?.all

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {
        //HW - show an alert for no geolocation support available 
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringfy(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}

const grantAccessButton = document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener("click", getLocation)

const searchInput = document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let cityName = searchInput.value

    if(cityName === "")
       return
    else
       fetchSearchWeatherInfo(cityName)   
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classlist.add("active")
    userInfoContainer.classList.remove("active")
    grantAccesssContainer.classList.remove("active")

    try {
        const response = await fetch (
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )
        const data = await response.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)

    }
    catch(err) {
        //HW
    }
}