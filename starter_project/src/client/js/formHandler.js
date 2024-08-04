// Replace checkForName with a function that checks the URL
import { checkUrl } from './urlChecker'

// If working on Udacity workspace, update this with the Server API URL e.g. `https://wfkdhyvtzx.prod.udacity-student-workspaces.com/api`
// const serverURL = 'https://wfkdhyvtzx.prod.udacity-student-workspaces.com/api'
const serverURL = 'http://localhost:8080/api'

const form = document.getElementById('urlForm');
const agreement = document.getElementById("agreement");
const confidence = document.getElementById("confidence");
const irony = document.getElementById("irony");
const score = document.getElementById("score");
const subjectivity = document.getElementById("subjectivity");
const postData = {};
let formUrl = "";
function handleSubmit(event) {
    event.preventDefault();
    // Get the URL from the input field
    formUrl = document.getElementById('url').value;
    // Check if the URL is valid
    const checkUrl = Client.checkUrl(formUrl);
    // If the URL is valid, send it to the server using the serverURL constant above
    if(checkUrl) {
        meaningCloud();   
    }   
    else {
        alert("Url Invalid")
    }  
}

// Function to send data to the server
const meaningCloud = async ()=>{
    postData.url = formUrl;   
    const response= await fetch(serverURL,{
        method: "POST",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });
    try {
        const data = await response.json();
        agreement.innerHTML = `Agreement: ${data.agreement}`;
        confidence.innerHTML = `Confidence: ${data.confidence}`;
        irony.innerHTML = `Irony: ${data.irony}`;
        score.innerHTML = `Score-tag: ${data.score_tag}`;
        subjectivity.innerHTML = `Subjectivity: ${data.subjectivity}`;
        console.log(data);
        return data

    } catch (error) {
        console.log("Error loi", error);
    }
}
// Export the handleSubmit function
export { handleSubmit };

