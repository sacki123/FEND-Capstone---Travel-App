const serverURL = 'http://localhost:8080'

const getGeoname = async (bodyReq)=>{
    const response = await fetch(`${serverURL}/apiGeoname`,{
        method: "POST",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyReq)
    })
    try {
        const dataGeo = await response.json();
        console.log(dataGeo);
        return dataGeo
    } catch (error) {
        console.log("Error", error);
    }
}

const getCurentWeather = async (bodyReq)=>{
    const response = await fetch(`${serverURL}/apiCurrentWeather`,{
        method: "POST",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyReq)
    })
    try {
        const dataCurrentWT = await response.json();
        console.log("CurentWeather",dataCurrentWT);
        return dataCurrentWT;
    } catch (error) {
        console.log("Error", error);
    }
}

const getPredictedWeather = async (bodyReq)=>{
    const response = await fetch(`${serverURL}/apiPredictedtWeather`,{
        method: "POST",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyReq)
    })
    try {
        const dataPredictedWT = await response.json();
        console.log("PredictedWeather",dataPredictedWT);
        return dataPredictedWT;
    } catch (error) {
        console.log("Error", error);
    }
}

const getPixaBay = async (location)=>{
    const response = await fetch(`${serverURL}/apiPixaBay`,{
        method: "POST",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data: location})
    })
    try {
        const dataPixaBay = await response.json();
        console.log("PixaBay",dataPixaBay);
        return dataPixaBay;
    } catch (error) {
        console.log("Error", error);
    }
}

export {
    getGeoname,
    getCurentWeather,
    getPredictedWeather,
    getPixaBay
}