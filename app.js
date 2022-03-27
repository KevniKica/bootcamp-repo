'use strict'
const switcher = document.querySelector('.mode-btn');
switcher.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
});
const searchBtn = document.querySelector('.search-btn');
const addressField = document.querySelector('#searchBar');
function load(){
    let location = localStorage.getItem("location");
    let search = localStorage.getItem("search");
    location = location.replace(/\+/g, " ");
    addressField.value = location;
    document.querySelector('#map').src = search;
}

searchBtn.addEventListener('click', function() {
    search();
});
async function search(){
    // document.querySelector('#map').src = addressField.value;
    
    // Let's make the embed map src string and set it
    const start = "https://www.google.com/maps/embed/v1/search?q=";
    var location = addressField.value;
    const end = "&key=AIzaSyCW17vgNIavXhOnaHhxOFfkRedUmeVvVzQ";
    location = location.replace(/ /g,'+');
    var search = start+location+end;
    // console.log(search);
    document.querySelector('#map').src = search;
    localStorage.setItem("location" , location);
    localStorage.setItem("search" , search);
    

    // Let's get the coordinates of the address they typed in
    var geocoder=new google.maps.Geocoder();
    const result = await geocoder.geocode({"address": location});
    const loc = String(result.results[0].geometry.location).replace(/[()\s]/g,"");

    // Let's make a request to our weather api with the coordinates
    const request = new Request("https://api.weather.gov/points/"+loc);
    const response = await fetch(request);
    const data = await response.json();

    // Let's use the response we got to get specific data about the forecast
    
    const request2=new Request(data.properties.forecast);
    const response2=await fetch(request2);
    const data2=await response2.json();    
    const days=data2.properties.periods;

    const weatherReport = document.getElementById("report");
    
    if(weatherReport){
        weatherReport.remove();
    }

    // Lets make a for loop to project the data from the website

    for(const day of days){

        const container = document.createElement("div");
        container.id = "report";
        container.classList.add("report");

        const header = document.createElement("h2");
        header.textContent = day.name;
        header.classList.add("day");

        const temp = document.createElement("p");
        temp.textContent = day.temperature + "\xB0" + day.temperatureUnit;
        temp.classList.add("temp");
        
        const forecast = document.createElement("p");
        forecast.textContent=day.shortForecast;
        forecast.classList.add("forecast");

        const windSpd = document.createElement("p");
        windSpd.textContent = "Wind Speed: " + day.windSpeed;
        windSpd.classList.add("wind-speed")

        container.appendChild(header);
        container.appendChild(temp);
        container.appendChild(forecast);
        container.appendChild(windSpd);
        document.querySelector(".report-days").appendChild(container);

    }
}