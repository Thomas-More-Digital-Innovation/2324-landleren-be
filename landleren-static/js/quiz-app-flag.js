// ------ wwww.landleren.be ------ //
// part of the GeoSelector program //

// select all required elements from the form
const vraagNummer = document.querySelector(".aantal-vragen");
const vraagTekst = document.querySelector(".vraag-tekst");
const countrycard = document.querySelector(".countrycard");
const keuzeContainer = document.querySelector(".keuze-mogelijkheden");
const antwoordenIndicatorContainer = document.querySelector(".antwoord-aanduider");
const homeBox = document.querySelector(".start-scherm");
const quizBox = document.querySelector(".quiz-vak");
const resultBox = document.querySelector(".resultaat-vak");
const questionLimit = 10; // to enable all questions use quiz.length
const imgLink = "https://static-landleren.digitalinnovation.be/flag/name/"; // linkt to the folder containing the flags - these are stored on a different server to improve performance and loading times
let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctantwoorden = 0;
let attempt = 0;

// extract questions from quiz-options.js so they can be used more easily in the program
function setAvailableQuestions() {
    const totalQuestion = quiz.length;
    for (let i = 0; i < totalQuestion; i++) {
        availableQuestions.push(quiz[i]);
    }
}

// set up everything involved with the question
function getNewQuestion() {

    // set question number 
    vraagNummer.innerHTML = "Vraag " + (questionCounter + 1) + " van " + questionLimit;

    // get random question
    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentQuestion = questionIndex;

    // set instruction
    vraagTekst.innerHTML = "Duid het land aan op de kaart";

    // remove question from the available questions to avoid duplication
    const index1 = availableQuestions.indexOf(questionIndex);
    availableQuestions.splice(index1, 1);

    // add image to panel
    if (currentQuestion.hasOwnProperty("img")) {

        // create new img element and give it the required image from static page
        const img = document.createElement("img");
        img.src = imgLink + currentQuestion.img;
        img.alt = currentQuestion.country;
        vraagTekst.appendChild(img);
    }

    // to keep track of the number of displayed questions
    questionCounter++;
}

// result function to display a happy or a sad smiley - called from the map-interact.js file when a country is selected on the map
function getResult(country) {

    // check if the answer from the map is correct 
    if (country === currentQuestion.country) {

        // set the indicator to correct and update the score
        updateantwoordIndicator("correct");
        correctantwoorden++;
    } else {

        // set the indicator to wrong
        updateantwoordIndicator("wrong");
    }

    // add an attempt to keep track if all questions have been answered or the user has skipped a question
    attempt++;

    // Automatically move to the next question so the user doesn't have to click another button to continue
    next();
}

// function to initialize the progress / answer indicator
function antwoordenIndicator() {

    // remove al contents to avoid duplication
    antwoordenIndicatorContainer.innerHTML = '';

    // generate indicators for each question
    const totalQuestion = questionLimit;
    for (let i = 0; i < totalQuestion; i++) {

        // create a div for each question that will be styled in the css file
        const indicator = document.createElement("div");
        antwoordenIndicatorContainer.appendChild(indicator);
    }
}

// funtion to assign the correct or wrong class to the answer indicator
function updateantwoordIndicator(markType) {

    // add the correct or wrong class to the indicator wich is styled in the css file to display a smiley
    antwoordenIndicatorContainer.children[questionCounter - 1].classList.add(markType);
}

// function to move to the next question or skip the current question
function next() {

    // check if all questions have been asked wich will end the quiz...
    if (questionCounter === questionLimit) {
        quizOver();
    }

    // or continue with the next question
    else {
        getNewQuestion();
    }
}

// function to end the quiz and display the results
function quizOver() {

    // hide the question form
    quizBox.classList.add("hide");

    // show result screen
    resultBox.classList.remove("hide");
    quizResult();
}

// fill in the result screen
function quizResult() {

    // select the appropriate elements from the result screen and fill them with the correct data from the variables
    resultBox.querySelector(".totaal-vragen").innerHTML = questionLimit;
    resultBox.querySelector(".totaal-poging").innerHTML = attempt;
    resultBox.querySelector(".totaal-correct").innerHTML = correctantwoorden;
    resultBox.querySelector(".totaal-fout").innerHTML = attempt - correctantwoorden;
    const percentage = (correctantwoorden / questionLimit) * 100;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultBox.querySelector(".totaal-score").innerHTML = correctantwoorden + " / " + questionLimit;
}

// function to reset the quiz for a new attempt
function resetQuiz() {

    // set everything back to zero or empty
    questionCounter = 0;
    correctantwoorden = 0;
    attempt = 0;
    availableQuestions = [];
}

// function to restart the quiz for a new attempt
function tryAgainQuiz() {

    // hide the results screen
    resultBox.classList.add("hide");

    // show the question form again
    quizBox.classList.remove("hide");

    // call the resetQuiz helper function and start the quiz again
    resetQuiz();
    startQuiz();
}

// function to go back to the home screen where the instructions are displayed
function goToHome() {

    // hide results screen
    resultBox.classList.add("hide");

    // show home page
    homeBox.classList.remove("hide");

    // still reset the quiz to avoid problems if the user decides to start the quiz again
    resetQuiz();
}

// function to start the quiz - called from the start button on the home screen
function startQuiz() {

    // hide home page
    homeBox.classList.add("hide");

    // show quiz 
    quizBox.classList.remove("hide");

    // call the helper functions to load the questions from the quiz-options.js file
    setAvailableQuestions();

    // get the first question to get the quiz started
    getNewQuestion();

    // load the answer indicators
    antwoordenIndicator();
}

// function to load part of the quiz when the page is loaded
window.onload = function() {

    // load the amount of questions in the quiz to the home screen
    homeBox.querySelector(".totaal-vragen").innerHTML = questionLimit;
}