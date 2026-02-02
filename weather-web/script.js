// let forecast_days = [];
// var data = {};

function checkOverflowY() {
    if (document.body.scrollHeight > window.innerHeight) {
        // If vertical overflow is active
        document.querySelector(".phaseContainer").classList.add('none');
        document.querySelector(".moonset h2").classList.add('smallerH2')
        document.querySelector(".moonrise h2").classList.add('smallerH2')
        document.querySelector(".sunset h2").classList.add('smallerH2')
        document.querySelector(".sunrise h2").classList.add('smallerH2')
    } else {
        // If vertical overflow is not active
        document.querySelector(".phaseContainer").classList.remove('none');
        document.querySelector(".moonset h2").classList.remove('smallerH2')
        document.querySelector(".moonrise h2").classList.remove('smallerH2')
        document.querySelector(".sunset h2").classList.remove('smallerH2')
        document.querySelector(".sunrise h2").classList.remove('smallerH2')
    }
}

// Check on load and on resize to handle changes
window.addEventListener('load', checkOverflowY);
window.addEventListener('resize', checkOverflowY);

// Optional: Also check when the user scrolls
// window.addEventListener('scroll', checkOverflowY);

// credit links (customizsable)
document.querySelector(".github").addEventListener("click", function() {
    window.open("https://github.com/legelff/WeatherWeb", "_blank");
})

document.querySelector(".linkedin").addEventListener("click", function() {
    window.open("https://www.linkedin.com/in/aryan-shah-752364295/details/projects/?profileUrn=urn%3Ali%3Afsd_profile%3AACoAAEdr-S4BJSBfYJmGo7g8ZFQoH0BDic4IBew", "_blank");
})

document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('mousemove', (e) => {
        // Get the dimensions of the island
        const { offsetWidth: width, offsetHeight: height } = island;
         
        // Get the center of the island
        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate the mouse's position relative to the center
        const mouseX = e.clientX - island.getBoundingClientRect().left;
        const mouseY = e.clientY - island.getBoundingClientRect().top;

        // Calculate how much to tilt the island based on mouse position
        const tiltX = (mouseY - centerY) / centerY * 10; // Adjust the tilt value as needed
        const tiltY = (mouseX - centerX) / centerX * -10; // Invert Y tilt for effect

        // Apply transform
        island.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Calculate shadow position based on tilt
        const shadowX = (tiltY / 10) * 10; // Shadow moves based on Y tilt
        const shadowY = (tiltX / 10) * 10; // Shadow moves based on X tilt

        // Apply new shadow position
        island.style.boxShadow = `${shadowX}px ${shadowY}px 35px rgba(0, 0, 0, 0.5)`; // Adjust shadow size as needed
    });

    island.addEventListener('mouseleave', () => {
        // Reset the tilt and shadow when the mouse leaves the island
        island.style.transform = 'rotateX(0) rotateY(0)';
        island.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)'; // Reset to original shadow
    });
});

// for home and fullscreen
document.querySelectorAll('.islandControlsItem').forEach(island => {
    island.addEventListener('mousemove', (e) => {
        // Get the dimensions of the island
        const { offsetWidth: width, offsetHeight: height } = island;
         
        // Get the center of the island
        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate the mouse's position relative to the center
        const mouseX = e.clientX - island.getBoundingClientRect().left;
        const mouseY = e.clientY - island.getBoundingClientRect().top;

        // Calculate how much to tilt the island based on mouse position
        const tiltX = (mouseY - centerY) / centerY * 10; // Adjust the tilt value as needed
        const tiltY = (mouseX - centerX) / centerX * -10; // Invert Y tilt for effect

        // Apply transform
        island.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Calculate shadow position based on tilt
        const shadowX = (tiltY / 10) * 10; // Shadow moves based on Y tilt
        const shadowY = (tiltX / 10) * 10; // Shadow moves based on X tilt

        // Apply new shadow position
        island.style.boxShadow = `${shadowX}px ${shadowY}px 35px rgba(0, 0, 0, 0.5)`; // Adjust shadow size as needed
    });

    island.addEventListener('mouseleave', () => {
        // Reset the tilt and shadow when the mouse leaves the island
        island.style.transform = 'rotateX(0) rotateY(0)';
        island.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)'; // Reset to original shadow
    });
});

// Event listener for search button

document.querySelector(".searchButton").addEventListener("click", function (e) {
    searchP1(e);
});

document.addEventListener("keydown", function (e) {
    if (document.querySelector(".islandTopCenter").classList.contains("initialPhase")) {
        if (e.key === "Enter") {
            searchP1(e);
        }
    }
});

// back button 
document.querySelector(".islandHome").addEventListener("click", function() {
    location.reload()
})

// fullscreen 
document.querySelector(".islandFullscreen").addEventListener("click", function() {
    toggleFullscreen()
})

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.querySelector(".islandControls").classList.add("none")
        // document.querySelector(".hourlyContainer").classList.add("hourlyContainerFullscreen")
        // document.querySelectorAll(".hourlyItem").forEach(item => {
        //     item.classList.add("hourlyItemFullscreen");
        // });
        document.querySelector(".weather").classList.add("weatherFullscreen")
    } else {
        document.exitFullscreen();
        document.querySelector(".islandControls").classList.remove("none")
        // document.querySelector(".hourlyContainer").classList.remove("hourlyContainerFullscreen")
        // document.querySelectorAll(".hourlyItem").forEach(item => {
        //     item.classList.remove("hourlyItemFullscreen");
        // });
        document.querySelector(".weather").classList.remove("weatherFullscreen")
    }
}

// Listen for fullscreen changes to manage the visibility of islandControls
document.addEventListener('fullscreenchange', () => {
    const islandControls = document.querySelector('.islandControls');
    if (document.fullscreenElement) {
        islandControls.classList.add('none'); // Hide when entering fullscreen
        // document.querySelector(".hourlyContainer").classList.add("hourlyContainerFullscreen")
        // document.querySelectorAll(".hourlyItem").forEach(item => {
        //     item.classList.add("hourlyItemFullscreen");
        // });
        document.querySelector(".weather").classList.add("weatherFullscreen")
    } else {
        islandControls.classList.remove('none'); // Show when exiting fullscreen
        // document.querySelector(".hourlyContainer").classList.remove("hourlyContainerFullscreen")
        // document.querySelectorAll(".hourlyItem").forEach(item => {
        //     item.classList.remove("hourlyItemFullscreen");
        // });
        document.querySelector(".weather").classList.remove("weatherFullscreen")
    }
});

const hourlyContainer = document.querySelector('.hourlyContainer');

hourlyContainer.addEventListener('wheel', (event) => {
  //event.preventDefault(); 
  hourlyContainer.scrollLeft += event.deltaY; // Scrolls horizontally
});

// ip lookup eventlistener auto location
document.querySelector(".autoLocation").addEventListener("click", function() {
    fetchIp();
    animate()
})


function searchP1(e) {
    e.preventDefault(); // Prevents default button behavior

    // Get the value of the country input
    const location = document.querySelector("#country").value.trim();

    if (location) {
        fetchLocations(location);
        
        
    } else {
        // displayError("Please enter a country.");
        country_selector = document.querySelector(".countryOptions");
        country_selector.innerHTML = `
                <div class="dataCell">
                    <p>No location found!</p>
                </div>
                <div class="dataCell">
                    <p>Type in a location silly</p>
                </div>
            `
    }
}

// To animate blocks
function animate(location) {
    // Trigger animations
    document.querySelector(".islandTopCenter").classList.remove("initialPhase");
    document.querySelector(".islandTopCenter").classList.add("removeMargin");
    document.querySelector(".islandBottomCenter").classList.remove("initialPhaseBottom", "hidden");
    document.querySelector(".islandBottomCenter").classList.add("fade-in");
    document.querySelector(".searchContainer").classList.add("fade-out");
    document.querySelector(".countryOptions").classList.add("fade-out");
    document.querySelector(".containerRight").classList.remove("hidden");
    document.querySelector(".containerRight").classList.add("slide-in-right");
    document.querySelector(".containerLeft").classList.remove("hidden");
    document.querySelector(".containerLeft").classList.add("slide-in-left");

    document.querySelector(".hourlyContainer").classList.remove("none")
    document.querySelector(".weather").classList.remove("none")
    document.querySelector(".searchContainer").classList.add("none")
    document.querySelector(".countryOptions").classList.add("none")
}

// Function to display current weather data in top center
function displayMainData(data, index = 0) {
    const weatherContainer = document.querySelector('.weather');

    // let date = new Date(data.forecast.forecast.forecastday[index].date);
    let date = new Date(data.forecast.forecastday[index].date);

    let formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(date);
    // my fav car is a porsche 918 spyder 💯💯🔥😍

    // Extract relevant information from data
    const hourLocation = start = new Date(data.location.localtime).getHours()
    const location = data.location.name;
    const country = data.location.country;
    const region = data.location.region;
    const temperature = data.forecast.forecastday[index].day.avgtemp_c;
    const maxtemp = data.forecast.forecastday[index].day.maxtemp_c;
    const mintemp = data.forecast.forecastday[index].day.mintemp_c;
    const condition = data.forecast.forecastday[index].day.condition.text;
    const icon = "https:" + data.forecast.forecastday[index].day.condition.icon;
    const max_wind_speed = data.forecast.forecastday[index].day.maxwind_kph;
    const wind_direction = data.forecast.forecastday[index].hour[hourLocation].wind_dir;
    const humidity = data.forecast.forecastday[index].day.avghumidity;
    const uv = data.forecast.forecastday[index].day.uv;
    const air_qual = data.current.air_quality["us-epa-index"];
    const rain_chance = data.forecast.forecastday[index].day.daily_chance_of_rain;
    const rain_level = data.forecast.forecastday[index].day.totalprecip_mm;
    var qualDef = ""
    
    switch (air_qual) {
        case 1:
            qualDef = "Good"
            break;

        case 2:
            qualDef = "Moderate"
            break;

        case 3:
            qualDef = "Unhealthy for sensitive group"
            break;

        case 4:
            qualDef = "Unhealthy"
            break;

        case 5:
            qualDef = "Very unhealthy"
            break;

        case 6:
            qualDef = "Hazardous"
            break;
    
        default:
            qualDef = "Unknown"
            break;
    }

    // location name and date
    document.querySelector(".dayWeather").innerHTML = `${formattedDate}`
    document.querySelector(".locationWeather").innerHTML = `
    ${region ? `${region}, ` : ''}${location}, ${country}
    `;

    // thermometer + temperature 
    // Update the temperature value and thermometer fill
    const tempValueElement = document.querySelector(".tempInfo h2");
    const thermometerFill = document.querySelector(".thermometer-fill");
    var maxTempPlace = document.querySelector(".maxTemp")
    var minTempPlace = document.querySelector(".minTemp")

    // Update temperature text
    tempValueElement.innerHTML = `${Math.round(temperature)}°C`;
    maxTempPlace.innerHTML = `${Math.round(maxtemp)}°C`
    minTempPlace.innerHTML = `${Math.round(mintemp)}°C`

    // Map temperature to a percentage fill height for thermometer (assuming 0°C to 40°C range)
    const fillHeight = Math.min(Math.max((temperature / 40) * 100, 0), 100);
    thermometerFill.style.height = `${fillHeight}%`;

    // condition
    var conditionh2 = document.querySelector(".conditionInfo h2")
    var conditionIcon = document.querySelector(".conditionIcon")

    conditionh2.innerHTML = `${condition}`
    conditionIcon.innerHTML = `<img src="${icon}" alt="condition">`

    // rainmeter + rain elements
    // Update the temperature value and rainmeter fill
    const rainValueElement = document.querySelector(".rainInfo h2");
    const rainmeterFill = document.querySelector(".rainmeter-fill");

    // Update rain text
    rainValueElement.innerHTML = `${rain_chance}%`;

    rainmeterFill.style.height = `${Math.min(Math.max(rain_chance, 0), 100)}%`;

    // humidity and humiditymeter
    // Update the humidity value and humidity fill
    const humidityValueElement = document.querySelector(".humidityInfo h2");
    const humiditymeterFill = document.querySelector(".humiditymeter-fill");

    // Update humidity text
    humidityValueElement.innerHTML = `${humidity}%`;

    //fill
    const humfillHeight = Math.min(Math.max(humidity, 0), 100);
    humiditymeterFill.style.height = `${humfillHeight}%`;

    // airqual and airqualmeter
    // Update the airqual value and airqualmeter fill
    const airqualValueElement = document.querySelector(".airqualInfo h2");
    const airqualmeterFill = document.querySelector(".airqualmeter-fill");

    // Update airqual text
    airqualValueElement.innerHTML = `${qualDef}`;

    //fill
    // air_qual is in the range of 1 to 6
    const airqualfillHeight = Math.min(Math.max(air_qual, 1), 6); // Ensure air_qual is between 1 and 6

    // Convert air quality from a scale of 1-6 to a percentage (0-100)
    const airqualPercentage = ((6 - airqualfillHeight) / 5) * 100; // Inverted mapping: 1 -> 100%, 6 -> 0%

    airqualmeterFill.style.height = `${airqualPercentage}%`;

    // precipitation
    var preciph2 = document.querySelector(".percipInfo h2")

    preciph2.innerHTML = `${rain_level} mm`

    // uv and uvmeter
    // Update the uv value and uvmeter fill
    const uvValueElement = document.querySelector(".uvInfo h2");
    const uvmeterFill = document.querySelector(".uvmeter-fill");

    // Update uv text
    uvValueElement.innerHTML = `${Math.round(uv)}`;

    //fill
    // uv is in the range of 1 to 11
    const uvfillHeight = Math.round(uv);

    // Map UV from a scale of 1-11 to a percentage (0-100)
    const uvPercentage = (uvfillHeight / 11) * 100;

    uvmeterFill.style.height = `${uvPercentage}%`;

    // // Define a variable to hold the degree value
    let degWind = 0;

    // Use switch case to determine the degrees based on wind_dir
    switch (wind_direction) {
        case "N":
            degWind = 0;
            break;
        case "NNE":
            degWind = 22.5;
            break;
        case "NE":
            degWind = 45;
            break;
        case "E":
            degWind = 90;
            break;
        case "ESE":
            degWind = 112.5;
            break;
        case "SE":
            degWind = 135;
            break;
        case "SSE":
            degWind = 157.5;
            break;
        case "S":
            degWind = 180;
            break;
        case "SSW":
            degWind = 202.5;
            break;
        case "SW":
            degWind = 225;
            break;
        case "WSW":
            degWind = 247.5;
            break;
        case "W":
            degWind = 270;
            break;
        case "WNW":
            degWind = 292.5;
            break;
        case "NW":
            degWind = 315;
            break;
        case "NNW":
            degWind = 337.5;
            break;
        default:
            degWind = 0; // Default case if direction is not recognized
    }

    // Rotate the wind icon image
    const windIconImg = document.querySelector(".windIcon img");
    windIconImg.style.transform = `rotate(${degWind}deg)`;

    // wind speed html
    document.querySelector(".windInfo h2").innerHTML = `${max_wind_speed} km/h`
    weatherContainer.classList.remove('hidden');
    displayHourlyData(data, index);
    displayAstronomy(data, index);
}

// Function to display current weather data in top center
function displayForecastData(data) {
    const weatherContainer = document.querySelector('.islandBottomCenter');
    for(var day = 0; day < 3; day++) {
        
        const days = data.forecast.forecastday[day];
        let time_hour = days.date; // Default label as date
        if (day == 0) {
            time_hour = "Today";
        } else if (day == 1) {
            time_hour = "Tomorrow";
        } else if (day == 2) {
            time_hour = "Overmorrow";
        }
        
        // if you want to get the whole day information replace hour by day.
        const rain = days.day.daily_chance_of_rain;
        const image = "https:" + days.day.condition.icon;
        const desc = days.day.condition.text;
        const temp = days.day.avgtemp_c;
        
        
        weatherContainer.innerHTML += `
            <div class="dayDiv d${day}">
                <h4>${time_hour}</h4>
                <img src="${image}">
                <p style="color:rgba(255, 255, 255, 0.8);">${desc}</p>
                <p>${Math.round(temp)}°C</p>
                <p class="lastDayItem" style="color:lightblue;">${rain}%</p>
            </div>
        `;
        
    }
    // this is only for hourly
    weatherContainer.classList.remove('hidden');

    document.querySelectorAll(".dayDiv").forEach(function(day, index) {
        day.addEventListener("click", function() {
            displayMainData(data, index);
    
            // Scroll to the 07:00 hourly item when d1 or d2 is clicked
            if (index == 0) {
                // Reset scroll to the start when d0 is clicked
                hourlyContainer.scrollLeft = 0;
            }
            else if (index == 1 || index == 2) { // d1 is index 1, d2 is index 2
                const hourlyItems = document.querySelectorAll('.hourlyItem');
                const hourlyContainer = document.querySelector('.hourlyContainer');
                
                setTimeout(() => {
                    hourlyItems.forEach(item => {
                        const timeText = item.querySelector('h5').textContent.trim();
                        if (timeText == "07:00") {
                            hourlyContainer.scrollLeft = item.offsetLeft - 20;
                        }
                    });
                }, 20); // added delay to avoid buggy scroll
            }
        });
    });
    
    
}

function displayHourlyData(data, index) {
    const hourlyWeather = document.querySelector(".hourlyContainer");
    
    hourlyWeather.innerHTML = null;
    let start = 0;
    let end = 24;
    if(index == 0) {
        start = new Date(data.location.localtime).getHours();
    }
    for (var hour = start; hour < end; hour++) {
        const hourly = data.forecast.forecastday[index].hour[hour];
        
        let time = String(new Date(hourly.time).getHours()).padStart(2, '0') + ":00";

        if (hour == start && time != "00:00") {
            time = "Now"
        }

        const image = "https:" + hourly.condition.icon;
        // const desc = hourly.condition.text;
        const temp = hourly.temp_c;
        const rain_chance = hourly.chance_of_rain;

        hourlyWeather.innerHTML += `
            <div class="hourlyItem">
                <h5>${time}</h5>
                <img src="${image}">
                <p>${Math.round(temp)}°C</p>
                <p style="color:lightblue;">${rain_chance}%</p>
            </div>
        `;
    }
}

function displayAstronomy(data, index) {

    const moonPlace = document.querySelector(".moonImage");
    
    const astronomy = data.forecast.forecastday[index].astro;
    
    const moon_phase = astronomy.moon_phase;
    const moonrise = astronomy.moonrise;
    const moonset = astronomy.moonset;
    const sunrise = astronomy.sunrise;
    const sunset = astronomy.sunset;
    
    moonPlace.innerHTML = `
        <img src="./assets/img/${moon_phase.replace(/ /g, '').toLowerCase()}.png" alt="${moon_phase.replace(/ /g, '').toLowerCase()}" class="moonPhase">
    `;

    document.querySelector(".sunrise h2").innerHTML = `
        ${to24HourFormat(sunrise)}
    `

    document.querySelector(".sunset h2").innerHTML = `
        ${to24HourFormat(sunset)}
    `

    document.querySelector(".moonrise h2").innerHTML = `
        ${to24HourFormat(moonrise)}
    `

    document.querySelector(".moonset h2").innerHTML = `
        ${to24HourFormat(moonset)}
    `

    document.querySelector(".moonPhaseData h2").innerHTML = `
        ${moon_phase}
    `
}

// convert ex. 05:26 PM to 24h format
function to24HourFormat(time) {
    const [hours, minutes] = time.split(/[: ]/);
    const period = time.slice(-2);
    
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    
    return `${String(hour).padStart(2, '0')}:${minutes}`;
}

function displayTime(data) {
    const DateTime = document.querySelector(".islandTopLeft");
    
    // let localtime = data.forecast.location.localtime; this gets when was the last time weather was updated, not accurate
    const localtime = new Date(data.location.localtime);

    const timezone = data.location.tz_id;

    const optionsTZ = { timeZone: timezone, timeZoneName: "short" };
    const formatter = new Intl.DateTimeFormat("en-US", optionsTZ);

    const tzFormatted = formatter.formatToParts(localtime).find(part => part.type === "timeZoneName").value

    // DateTime.innerHTML = `
    //     <h4>Local time: ${localtime}</h4>
    // `

    // change gradient based on time
    const hour = localtime.getHours()
    const location = data.location.name;
    const country = data.location.country;

    // Start clock hands rotation
    const deg = 6; // 360° / 60 seconds/minutes
    const hr = document.querySelector('#hr');
    const min = document.querySelector('#min');
    const sec = document.querySelector('#sec');
    
    // Update the hands for the first time
    updateClockHands(localtime, hr, min, sec, deg);

    // Update the digital clock for the first time
    updateDigitalClock(localtime, digitalClock);

    // Update every second
    setInterval(() => {
        localtime.setSeconds(localtime.getSeconds() + 1); // Increment by 1 second
        updateClockHands(localtime, hr, min, sec, deg);
        updateDigitalClock(localtime, digitalClock); // Update digital clock
    }, 1000);

    // change to morning/day/evening/night gradient
    // const body = document.querySelector("body");

    if (hour >= 5 && hour < 12) {
        // morning
        DateTime.classList.add("morningGradient")
        // body.style.backgroundImage = "url('./assets/img/morning.png')";
        document.querySelector(".islandTopLeft h2").innerHTML = `
            Good Morning ${location}, ${country}!
        `
    }

    else if (hour >= 12 && hour < 17) {
        // afternoon
        DateTime.classList.add("dayGradient")
        // body.style.backgroundImage = "url('./assets/img/day.png')";
        document.querySelector(".islandTopLeft h2").innerHTML = `
            Good Afternoon ${location}, ${country}!
        `
    }

    else if (hour >= 17 && hour < 21) {
        // evening
        DateTime.classList.add("eveningGradient")
        // body.style.backgroundImage = "url('./assets/img/evening.png')";
        document.querySelector(".islandTopLeft h2").innerHTML = `
            Good Evening ${location}, ${country}!
        `
    }

    else {
        // night
        DateTime.classList.add("nightGradient")
        // body.style.backgroundImage = "url('./assets/img/night.png')";
        document.querySelector(".islandTopLeft h2").innerHTML = `
            Good Night ${location}, ${country}!
        `
    }

    // display day, date
    const options = { weekday: 'long' }; // 'long' for full day name, 'short' for abbreviated
    const dayName = localtime.toLocaleDateString('en-US', options);

    // Get day, month, and year
    const day = String(localtime.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const month = String(localtime.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11, so add 1
    const year = localtime.getFullYear(); // Get full year

    // const timezoneName = localtime.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ').pop(); // Gets the last part of the string which is the timezone

    // Format the date as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;

    document.querySelector(".day").innerHTML = `
        ${dayName}
    `

    document.querySelector(".date").innerHTML = `
        ${formattedDate}
    `

    document.querySelector(".timezone").innerHTML = `
        ${tzFormatted}
    `
}

function updateClockHands(localtime, hr, min, sec, deg) {
    const hh = localtime.getHours() * 30 + (localtime.getMinutes() / 2); // Each hour is 30 degrees
    const mm = localtime.getMinutes() * deg;
    const ss = localtime.getSeconds() * deg;

    hr.style.transform = `rotateZ(${hh}deg)`;
    min.style.transform = `rotateZ(${mm}deg)`;
    sec.style.transform = `rotateZ(${ss}deg)`;
}

// New function to update the digital clock
function updateDigitalClock(localtime, digitalClock) {
    const hours = String(localtime.getHours()).padStart(2, '0');
    const minutes = String(localtime.getMinutes()).padStart(2, '0');
    const seconds = String(localtime.getSeconds()).padStart(2, '0');
    digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
}

// display historical data. 6 days from yesterday
function displayHistoricalData(data) {
    const historical = document.querySelector(".historicalContainer");
    const history_data = data.forecast.forecastday;

    for(let day = 5; day >= 0; day--) {
        const history_day = history_data[day];
        const icon = "https:" + history_day.day.condition.icon;
        // test data
        const avg_temp = Math.round(history_day.day.avgtemp_c);
        const min_temp = history_day.day.mintemp_c;
        const max_temp = history_day.day.maxtemp_c;
        const change_of_rain = history_day.day.daily_chance_of_rain;
        const uv = history_day.day.uv;

        let date = new Date(history_day.date);
        let formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        }).format(date);

        if (day == 5) {
            formattedDate = "Yesterday";
        }

        historical.innerHTML += `
            <div class="historicalItem">
                <h4>${formattedDate}</h4>
                <img src="${icon}" class="historicalImage">
                <div class="historicalDetails">
                    <p>${avg_temp}°C <span style="color:lightblue; opacity:0.7;">/ ${change_of_rain}%</span></p>
                </div
            </div>
        `
    }





}

function displayImages(images) {
    const image_div = document.querySelector(".images");
    const images_data = images.photos;

    // Create a loading counter
    let imagesLoaded = 0;

    // Function to load and display an image
    const loadImage = (index) => {
        if (index >= images_data.length) return; // Stop if all images are loaded

        const url = images_data[index].src.original;
        const alt = images_data[index].alt;

        const img = document.createElement('img');
        img.src = url;
        img.alt = alt;
        img.classList.add('loopImage', 'hidden'); // Initially hidden

        // Set the load event
        img.onload = () => {
            imagesLoaded++; // Increment the counter when an image loads
            // Start the slideshow if all images have loaded
            if (imagesLoaded === images_data.length) {
                // Remove hidden class and start slideshow
                document.querySelectorAll('.loopImage').forEach(image => {
                    image.classList.remove('hidden');
                });

                startSlideshow(document.querySelectorAll('.loopImage'));
            }
        };

        // Append the image to the container
        image_div.appendChild(img);

        // Load the next image after a delay
        setTimeout(() => loadImage(index + 1), 1000); // Delay of 1 second
    };

    // Start loading images
    loadImage(0); // Start with the first image
}

function startSlideshow(images) {
    let current = 0;

    // Initialize first image as active
    images[current].classList.add('active');

    setInterval(() => {
        // Remove active class from the current image
        images[current].classList.remove('active');

        // Move to the next image, looping back to start if necessary
        current = (current + 1) % images.length;

        // Add active class to the new current image
        images[current].classList.add('active');
    }, 3000); // Change every 3 seconds
}

function displayLocations(locations) {
    document.querySelector(".countryOptions").innerHTML = "";
    if (locations.length === 0) {
        country_selector = document.querySelector(".countryOptions");
        country_selector.innerHTML = `
                <div class="dataCell">
                    <p>No location found!</p>
                </div>
                <div class="dataCell">
                    <p>Typo perahps?</p>
                </div>
            `
        return; // Exit the function if no locations
    }

    if(locations.length == 1) {
        const lat_long = `${locations[0].lat},${locations[0].lon}`
        // Trigger animations
        animate(lat_long);
        // Fetch the weather data
        fetchWeather(lat_long);
    }
    else {
        country_selector = document.querySelector(".countryOptions");
        
        for(let country = 0; country < locations.length; country++) {

            const country_name = locations[country].country;
            const lat = locations[country].lat;
            const long = locations[country].lon;
            const name = locations[country].name;
            const region = locations[country].region;

            country_selector.innerHTML += `
                <div class="dataCell" data-loc="${lat},${long}">
                    <p>${name}, ${region ? region + "," : ""} ${country_name}</p>
                </div>
            `
        }
        
        document.querySelectorAll(".dataCell").forEach(function(cell) {
            cell.addEventListener("click", function() {

                const lat_long = cell.getAttribute("data-loc");
                animate(lat_long);
                fetchWeather(lat_long);
            });
        });

    }

} 

const weatherKey = "a908fb2eee8b48f6bd190405242910";
const imagesKey = "YRYgxgKpXO1mrKzwJROFweux59nebkt8yiRFJhUbZHT8obxNh51mQUnI"; // no point in stealing these anyways since theyre free

async function fetchLocations(location) {
    try {
        // Direct API call to WeatherAPI for location search
        const location_data = await fetch(`https://api.weatherapi.com/v1/search.json?key=${weatherKey}&q=${location}`);
        
        // Parse the response as JSON
        const loc = await location_data.json();

        if (loc.error) {
            displayError("Locations not found.");
        } else {
            displayLocations(loc); // Call the function to handle displaying the locations
        }
    } catch (error) {
        displayError("An error occurred while fetching locations.");
    }
}

async function fetchWeather(location) {
    try {
        // Fetch weather forecast and historical data
        const forecastResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${location}&days=3&aqi=yes`);
        const forecastData = await forecastResponse.json();

        // Handle errors from the weather API
        if (forecastData.error) {
            displayError("Weather data not found.");
            return;
        }

        // Calculate the date 6 days ago and 1 day ago
        const currentDate = new Date();
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - 6); // 6 days ago
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() - 1); // 1 day ago
 
        // Format the dates to 'YYYY-MM-DD'
        const pastDateStr = pastDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
 
        // Fetch historical data using the calculated date range
        const historyResponse = await fetch(`https://api.weatherapi.com/v1/history.json?key=${weatherKey}&q=${location}&dt=${pastDateStr}&end_dt=${endDateStr}`);
        const historyData = await historyResponse.json();

        // Fetch images from Pexels using the country from the weather data
        const pexelResponse = await fetch(`https://api.pexels.com/v1/search?query=${forecastData.location.country}&per_page=5`, {
            headers: {
                Authorization: imagesKey
            }
        });
        const imagesData = await pexelResponse.json();

        // Display the weather and image data
        displayMainData(forecastData);
        displayForecastData(forecastData);
        displayTime(forecastData);
        displayHistoricalData(historyData);
        displayImages(imagesData);

    } catch (error) {
        displayError("An error occurred while fetching data.");
    }
}

// Fetch location from IP
async function fetchIp() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/ip.json?key=${weatherKey}&q=auto:ip`);
        const locationData = await response.json();

        if (locationData.error) {
            displayError("Could not retrieve location.");
        } else {
            fetchWeather(`${locationData.lat},${locationData.lon}`);
        }
    } catch (error) {
        console.error("Error fetching IP-based location:", error);
    }
}

// Function to display error messages
function displayError(message) {
    // replaced additional element creation (put error in console devtools)
    console.log(message)
}