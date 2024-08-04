const { expect } = require('@jest/globals')
const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

app.get('/test', (req, res) => {
    res.status(200).send('Server Tested');
});

module.exports = app;

jest.setTimeout(10000);
it("Test Server",async ()=>{
    const responseServer = await request(app).get('/test');
    expect(responseServer.statusCode).toBe(200);
});
