import { getGeoname, getCurentWeather, getPredictedWeather, getPixaBay} from './api';
import {countdownDay} from './countdowDays';
import {eventListenersAddTrip} from './eventListeners';

let location = document.getElementById("location");
let departing = document.getElementById("departing");
const btnsavetrip = document.getElementById("savetrip");
const btnremovetrip = document.getElementById("removetrip");
const mytrip = document.getElementById("mytrip");
const departingTo = document.getElementById("departingTo");
const weather = document.getElementById("weather");
const table = document.getElementById("table");
const tableBody = document.querySelector("#tableBody");
const temp = document.getElementById("temp");
const countdown = document.getElementById("countdown");
const image = document.getElementById("image");
const sidebar_menu = document.getElementById("sidebar_menu");
const expiredTrips = document.getElementById("Expiredtrips");
const btnCheck = document.getElementById("btncheckWeather");
const btnAddTrip = document.getElementById("btnAddTrip");
let sidebarLst = [];
let expiredtripLst = [];
let differenceInDays = "0"
let weatherType = "";
let weatherInfoDays = [];
let currentLocalStorageKey = "";
let bodyReq = {};

const addElementsTable = (dataLst)=> {
    tableBody.innerHTML = "";
    dataLst.forEach((data) => {
        const trElement = document.createElement('tr');
        const tdElementDate = document.createElement('td');
        const tdElementWeather = document.createElement('td');
        const tdElementTemp = document.createElement('td');
        tdElementDate.textContent = data.datetime;
        tdElementWeather.textContent = data.weather.description;
        tdElementTemp.textContent = data.temp;
        trElement.appendChild(tdElementDate);
        trElement.appendChild(tdElementWeather);
        trElement.appendChild(tdElementTemp);
        tableBody.appendChild(trElement);
    });
}

const addElementSidebar = (dataLst,expired = false)=> {
    dataLst.sort((a, b) => new Date(b) - new Date(a));
    dataLst.forEach(element => {
        try {
            const liElement = document.createElement('li');
            const aElement = document.createElement('a');
            aElement.addEventListener("click", (event) =>{
                event.preventDefault();
                getTrip(element);
            });
            aElement.innerText = element;
            aElement.setAttribute("href","");
            if (expired) {
                aElement.classList.add("sidebar_link_expired");
                liElement.appendChild(aElement);
                liElement.setAttribute("id",element);
                expiredTrips.appendChild(liElement);
            } else {
                aElement.classList.add("sidebar_link");
                liElement.appendChild(aElement);
                liElement.setAttribute("id",element);
                sidebar_menu.appendChild(liElement);   
            }
        } catch (error) {
            console.log(error);
        }
    });    
}

const initial = ()=>{
    eventListenersAddTrip();
    btnCheck.addEventListener("click", checkWeather);
    btnsavetrip.addEventListener("click", saveTrip);
    btnsavetrip.disabled = true;
    btnremovetrip.addEventListener("click", (event)=>{
        event.preventDefault();
        removeTrip(currentLocalStorageKey);
    })
    sidebarLoad();
    if (sidebarLst.length > 0) {
        getTrip(sidebarLst[0]); 
    }
    if (currentLocalStorageKey == "") {
        btnremovetrip.disabled = true;
    }
}

const checkWeather = async ()=>{
    const departingDay = new Date(departing.value);
    departingDay.setHours(0,0,0,0);
    differenceInDays = countdownDay(departingDay);
    if (location.value == "" || departing.value == "") {
        alert("My trip and departing cannot be left blank.")
    }
    // else if (differenceInDays < 0){
    //     alert("Departing date must be on or after the current date.")
    // }
    else {
        btnCheck.disabled = true;
        btnAddTrip.disabled = false;
        bodyReq.location = (location.value).toUpperCase();
        mytrip.innerText = `My Trip to: ${(location.value).toUpperCase()}`;
        departingTo.innerText = `Departing: ${departing.value}`;
        console.log("Data Request", bodyReq);
        if (location && departing){
            const dataGeo = await getGeoname(bodyReq);
                if (dataGeo.geonames){
                    bodyReq.lat = dataGeo.geonames[0].lat;
                    bodyReq.lon = dataGeo.geonames[0].lng;
                    bodyReq.countryName = dataGeo.geonames[0].countryName;
                    console.log("Days ",differenceInDays);
                    if (differenceInDays >= 8) {
                        weatherType = "PredictedWeather";
                        const dataPredictedWT = await getPredictedWeather(bodyReq);
                        if (dataPredictedWT) {
                            weatherInfoDays = dataPredictedWT.data;
                            addElementsTable(dataPredictedWT.data);
                            table.style.display = 'block';
                            weather.style.display = 'none';
                            temp.style.display = 'none';
                        }                       
                    } else {
                        weatherType = "CurrentWeather";
                        const dataCurrentWT = await getCurentWeather(bodyReq);
                        if(dataCurrentWT){
                            weather.style.display = 'block';
                            temp.style.display = 'block';
                            weather.innerText = `⚫️  Weather: ${dataCurrentWT.data[0].weather.description}`;
                            temp.innerText = `⚫️  Temp(°C): ${dataCurrentWT.data[0].temp}`;
                            table.style.display = 'none';
                        }
                    }
                    countdown.innerText = `${bodyReq.location} is ${parseInt(differenceInDays)} days away`;
                    let dataPixaBay = await getPixaBay(bodyReq.location);
                    if (dataPixaBay.hits.length == 0) {
                        dataPixaBay = await getPixaBay(bodyReq.countryName);
                    }
                    image.src = dataPixaBay.hits[0].webformatURL;
                    image.style.display = "block";
                    btnsavetrip.disabled = false;
                    btnremovetrip.disabled = true;
                }
        }    
    }
}

const saveTrip = ()=>{
    if (localStorage.length > 7) {
        removeTrip(sidebarLst[sidebarLst.length]); 
    }
    const localStorageBody = {};
    const key = new Date();
    localStorageBody.weatherType = weatherType;
    localStorageBody.location = bodyReq.location;
    localStorageBody.departing = departing.value;
    localStorageBody.image = image.src;
    if (weatherType == "CurrentWeather") {
        localStorageBody.weather = weather.innerText;
        localStorageBody.temp = temp.innerText;
    }
    else if(weatherType == "PredictedWeather"){
        localStorageBody.weatherLst = weatherInfoDays;
    }
    localStorage.setItem(key,JSON.stringify(localStorageBody));
    currentLocalStorageKey = key;
    sidebarLoad();
    btnsavetrip.disabled = true;
    btnremovetrip.disabled = false;
}

const getTrip = (key) => {
    currentLocalStorageKey = key;
    let trip = {};
    trip = JSON.parse(localStorage.getItem(key));
    if (Object.keys(trip).length > 0) {
        try {
            mytrip.innerText = `My trip to: ${trip.location}`;
            departingTo.innerText = `Departing to: ${trip.departing}`;
            image.src = trip.image;
            image.style.display = "block";
            countdown.innerText = `${(trip.location)} is ${countdownDay(trip.departing)} days away`;
            if (trip.weatherType == "CurrentWeather") {
                weather.innerText = trip.weather; 
                temp.innerText = trip.temp;
                table.style.display = 'none';
            }
            else if (trip.weatherType == "PredictedWeather"){
                addElementsTable(trip.weatherLst);
                weather.innerText = ""; 
                temp.innerText = "";
                table.style.display = 'block';
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const sidebarLoad = ()=> {
    let trip = {};
    sidebarLst = [];
    expiredtripLst = [];
    sidebar_menu.innerHTML = "";
    expiredTrips.innerHTML = "";
    if (localStorage.length > 0) {
        for (let index = 0; index < localStorage.length; index++) {
            try {
                trip = JSON.parse(localStorage.getItem(localStorage.key(index)));
                if (countdownDay(trip.departing) >= 0) {
                    sidebarLst.push(localStorage.key(index));
                } else {
                    expiredtripLst.push(localStorage.key(index));
                }       
            } catch (error) {
                localStorage.removeItem(localStorage.key(index));
            }
        };
        if (sidebarLst.length > 0) {
            addElementSidebar(sidebarLst);
        }
        if (expiredtripLst.length > 0) {
            addElementSidebar(expiredtripLst, true);
        }
    }
}

const removeTrip = (key)=> {
    localStorage.removeItem(key);
    const liElement = document.getElementById(key);
    liElement.remove();
    sidebarLoad();
    if (sidebarLst.length > 0) {
        getTrip(sidebarLst[0]); 
    }
    else {
        mytrip.innerText = "";
        departingTo.innerText = "";
        image.src = "";
        image.style.display = "none";
        weather.innerText = ""; 
        temp.innerText = "";
        countdown.innerText = "";
        table.style.display = 'none';
    }
}

initial();
export {
    checkWeather
}