let inputIP = document.querySelector(".ip-address");
let mapContainer = document.querySelector(".map-container");
let trackBtn = document.querySelector(".track-btn");
let ipAddress = document.querySelector(".ip");
let clientLocation = document.querySelector(".location");
let timezone = document.querySelector(".timezone");
let ISP = document.querySelector(".isp");
let API_URL = "https://ipgeolocation.abstractapi.com/v1/?api_key=7d9fc1d56b5c40a69a22129ab43a1692";
let mymap;
let marker;
let clientIP;
let clientCity; 
let clientTime;
let clientISP;
let lat;
let lng;

window.addEventListener("load", ()=>{
    fetchingData();
})

trackBtn.addEventListener("click", ()=>{
    mymap.remove(); //To reload the map
    generateURL();
    fetchingData();
})

function generateURL(){
    if(inputIP.value !== 0){
        API_URL = `https://ipgeolocation.abstractapi.com/v1/?api_key=7d9fc1d56b5c40a69a22129ab43a1692&ip_address=${inputIP.value}`;
    }
}

function fetchingData() {
    fetch(API_URL)
    .then(
        (response)=>{
            return response.json()
        }
    )
    .then(
        (data)=>{
            lat = data.latitude;
            lng = data.longitude;
            clientCity = data.city;
            clientIP = data.ip_address;
            clientTime = data.timezone.current_time;
            clientISP = data.connection.autonomous_system_organization;
        }
    )
    .then(
        ()=>{
            //Display Info To The User
            displayInfo(clientIP,clientCity,clientTime,clientISP);
            //Create The Map
            mymap = L.map('mapid').setView([lat, lng], 13);
            //Add A Marker
            marker = L.marker([lat, lng]).addTo(mymap);
            if(clientCity !== null){
                marker.bindPopup(`<b>Hello there!</b><br>You are in ${clientCity}` ).openPopup();
            } 
            else {
                marker.bindPopup(`<b>Hello there!</b><br>You're here!` ).openPopup();
            }

            //Add A Tile
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZXRvbmFyIiwiYSI6ImNrbTZod3htcTA5OWUycGxhd2NrcnZqNWQifQ.3ixfzTfut9LF8VCBzABMKA'
            }).addTo(mymap);

            /*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mymap);*/
            
        }
    )
}

function displayInfo(ip, city, time, isp) {
    ipAddress.textContent = ip;
    clientLocation.textContent = city;
    timezone.textContent = time;
    ISP.textContent = isp;
}