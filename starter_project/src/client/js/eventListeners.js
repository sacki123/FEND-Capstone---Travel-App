const btnCheck = document.getElementById("btncheckWeather");
const btnAddTrip = document.getElementById("btnAddTrip");
let location = document.getElementById("location");
let departing = document.getElementById("departing");

const eventListenersAddTrip = ()=>{
    btnAddTrip.addEventListener("click", addTrip);
    btnAddTrip.disabled = true;
}

const addTrip = ()=>{
    btnCheck.disabled = false;
    location.value = "";
    departing.value = "";
}

export {
    eventListenersAddTrip
}