'use strict'
const switcher = document.querySelector('.mode-btn');
switcher.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
});
const searchBtn = document.querySelector('.search-btn');
const addressField = document.querySelector('#searchBar');

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

        const header = document.createElement("h2");
        header.textContent = day.name;

        const temp = document.createElement("h2");
        temp.textContent = day.temperature;

        const tempUnit = document.createElement("h2");
        tempUnit.textContent = day.temperatureUnit;
        
        const forecast = document.createElement("p");
        forecast.textContent=day.shortForecast;

        const windSpd = document.createElement("p");
        windSpd.textContent = day.windSpeed;

        container.appendChild(header);
        container.appendChild(temp);
        container.appendChild(tempUnit);
        container.appendChild(forecast);
        container.appendChild(windSpd);
        document.querySelector("body").appendChild(container);

    }
}
