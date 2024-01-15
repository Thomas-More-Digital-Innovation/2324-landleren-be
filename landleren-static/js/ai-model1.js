// ------ wwww.landleren.be ------ //

var video = document.getElementById('video');
var startButton = document.getElementById('startButton');
var captureButton = document.getElementById('captureButton');
var retakeButton = document.getElementById('retakeButton');
var mirrorSlider = document.getElementById('mirrorCheckbox');
var stream;
var anwser = document.getElementById('result')
let score = 0;
let questionCounter = 0;
var checkBtn = document.getElementById('check-btn').disabled = true;
const smileyContainer = document.getElementById("smileys");
const resultBox = document.querySelector(".resultaat-vak");

function toggleExercises() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("exercise").style.display = "block";
}

function toggleresults() {
    document.getElementById("exercise").style.display = "none";
    document.getElementById("results").style.display = "block";
    quizResult();
}

// Event listener for the start button
startButton.addEventListener('click', function() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                startButton.style.display = 'none';
                captureButton.style.display = 'inline-block';
            })
            .catch(function(err0r) {
                console.log("Something went wrong!");
            });
    }
    // Disable the retake button
    retakeButton.style.display = 'none';
    smileyContainer.innerHTML = '';
    const totalQuestion = landen.length;
    for (let i = 0; i < landen.length; i++) {
        const indicator = document.createElement("div");
        smileyContainer.appendChild(indicator);
    }
});

function updateSmiley(markType) {
    smileyContainer.children[questionCounter - 1].classList.add(markType);
}

// Event listener for the mirror checkbox
mirrorCheckbox.addEventListener('change', function() {
    if (mirrorCheckbox.checked) {
        video.style.transform = 'scaleX(-1)';
    } else {
        video.style.transform = 'scaleX(1)';
    }
});

// Event listener for the capture button
captureButton.addEventListener('click', function() {
    // Pause the video
    video.pause();

    // Create a canvas element and set its dimensions to match the video
    var canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame of the video onto the canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Save the canvas as an image data URL and set it as the source of an image element
    var imageDataURL = canvas.toDataURL('image/png');
    var img = new Image();
    img.src = imageDataURL;

    // Append the image element to a hidden div
    var hiddenDiv = document.createElement('div');
    hiddenDiv.style.display = 'none';
    hiddenDiv.appendChild(img);
    document.body.appendChild(hiddenDiv);

    // Hide the capture button and show the retake button
    captureButton.style.display = 'none';
    retakeButton.style.display = 'inline-block';

    // Enable the check button after a short delay
    checkBtn = document.getElementById('check-btn').disabled = false;


    // Use the Teachable Machine model to predict the class label of the image
    var modelURL = 'https://teachablemachine.withgoogle.com/models/FW4UEoFqg/';
    var model;
    var labelContainer = document.getElementById('label-container');

    // Load the model
    tmImage.load(modelURL + 'model.json', modelURL + 'metadata.json').then(function(loadedModel) {
        model = loadedModel;
        // Make a prediction using the loaded model and the image
        return model.predict(img);
    }).then(function(predictions) {
        // Sort the predictions by probability values
        predictions.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));

        // Display the predicted class label with the highest probability
        labelContainer.innerHTML = predictions[0].className;
    });
});

// Event listener for the retake button
function retakeVideo() {
    video.play();
    captureButton.style.display = 'inline-block';
    retakeButton.style.display = 'none';
    checkBtn = document.getElementById('check-btn').disabled = true;
}

// Array met 9 landen
const landen = ['Italie', 'Oostenrijk', 'Kroatie', 'Duitsland', 'Estland', 'Denemarken', 'Belgie', 'Bulgarije', 'Cyprus'];
//
// Array om bij te houden welke landen al geweest zijn
let geweest = [];

// Kies een willekeurig land uit de array en toon het op de pagina
function kiesRandomLand() {
    // Als alle landen zijn geweest, toon een melding
    if (geweest.length === landen.length) {
        const meldingElement = document.getElementById('melding');
        meldingElement.textContent = 'Alle landen zijn geweest!';
        document.getElementById("check-btn").style.display = "none";
        document.getElementById("final-btn").style.display = "inline-block";
        return;
    }

    let gekozenLand;
    do {
        gekozenLand = landen[Math.floor(Math.random() * landen.length)];
    } while (geweest.includes(gekozenLand)); // Zolang het gekozen land al geweest is, blijf nieuwe landen kiezen

    // Voeg het gekozen land toe aan de array van geweest landen
    geweest.push(gekozenLand);

    // Toon het gekozen land op de pagina
    const landElement = document.getElementById('land');
    landElement.textContent = gekozenLand;
    questionCounter++;
}

// Toon bij het laden van de pagina een willekeurig land
kiesRandomLand();

//controlleer outputs

// Voeg een eventlistener toe aan de knop
document.getElementById("check-btn").addEventListener("click", function getResult(element) {
    // Haal de waarde van het gevraagde land op
    var gevraagdeLand = document.getElementById("land").innerHTML;

    // Haal de waarde van de output van het Teachable Machine model op
    var uitvoerTM = document.getElementById("label-container").innerHTML;

    // Vergelijk de waarden
    if (uitvoerTM.trim() === gevraagdeLand.trim()) {
        score++; // verhogen van score bij juiste antwoord
        document.getElementById("score").innerText = score; // score updaten op de website
        // Geef een melding als de waarden overeenkomen
        anwser.innerHTML = 'juist'
        updateSmiley("correct");
    } else {
        anwser.innerHTML = 'fout'
        updateSmiley("incorrect");
    }
    retakeVideo();
    kiesRandomLand();
});

function quizResult() {
    document.getElementById("totaal-vragen").innerHTML = landen.length;
    document.getElementById("totaal-correct").innerHTML = score;
    document.getElementById("totaal-fout").innerHTML = landen.length - score;
    const percentage = (score / landen.length) * 100;
    document.getElementById("percentage").innerHTML = percentage.toFixed(2) + "%";
    document.getElementById("totaal-score").innerHTML = score + " / " + landen.length;

}