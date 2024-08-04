var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
dotenv.config();

const app = express();

const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'))

console.log(__dirname);

// Variables for url and api key
app.get('/', function (req, res) {
    res.sendFile("dist/index.html");
});

// POST Route
//Geoname
app.post('/apiGeoname', async (req, res) => {
    const requestData = req.body;
    const response = await fetch(`http://api.geonames.org/searchJSON?name=${requestData.location}&maxRows=1&username=${process.env.API_KEY_GEO}`);
    try {
        const data = await response.json();
        res.send(data);
        console.log("Location",requestData.location);
        console.log(data);
    } catch (error) {
        console.log("Error",error);
    }
})

//Curent Weatherbit
app.post('/apiCurrentWeather', async (req, res) => {
    const requestData = req.body;
    const lat = parseInt(requestData.lat);
    const lon = parseInt(requestData.lon);
    console.log(req.body);
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${process.env.API_KEY_WT}`);
    try {
        const data = await response.json();
        res.send(data);
        console.log("Current forcecast",data);
    } catch (error) {
        console.log("Error",error);
    }
})

//predicted Weatherbit
app.post('/apiPredictedtWeather', async (req, res) => {
    const requestData = req.body;
    const lat = parseFloat(requestData.lat);
    const lon = parseFloat(requestData.lon);
    console.log(lat + '-' + lon);
    const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=7&key=${process.env.API_KEY_WT}`);
    try {
        const data = await response.json();
        res.send(data);
        console.log("Daily forecast",data);
    } catch (error) {
        console.log("Error",error);
    }
})
 //PixaBay
 app.post('/apiPixaBay', async (req, res) => {
    const requestData = req.body;
    const response = await fetch(`https://pixabay.com/api/?key=${process.env.API_KEY_PIXA}&q=${requestData.data}&category=travel&per_page=3`);
    try {
        const data = await response.json();
        res.send(data);
        console.log(requestData)
        console.log("PixaBay",data);
    } catch (error) {
        console.log("Error",error);
    }
})
// Designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});

module.exports = app;
