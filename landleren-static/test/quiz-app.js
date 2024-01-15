const vraagNummer = document.querySelector(".aantal-vragen");
const vraagTekst = document.querySelector(".vraag-tekst");
const countrycard = document.querySelector(".countrycard");
const keuzeContainer = document.querySelector(".keuze-mogelijkheden");
const antwoordenIndicatorContainer = document.querySelector(".antwoord-aanduider");
const homeBox = document.querySelector(".start-scherm");
const quizBox = document.querySelector(".quiz-vak");
const resultBox = document.querySelector(".resultaat-vak");
const questionLimit = 10; // if you want all questions "quiz.length"
const imgLink = "https://static-landleren.digitalinnovation.be/flag/name/"; // linkt to the folder containing the flags - these are stored on a different server or on a cdn to improve performance
let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctantwoorden = 0;
let attempt = 0;

// push the questions into  availableQuestions Array
function setAvailableQuestions() {
    const totalQuestion = quiz.length;
    for (let i = 0; i < totalQuestion; i++) {
        availableQuestions.push(quiz[i]);
    }
}

// set question number and question and options
function getNewQuestion() {
    // set question number 
    vraagNummer.innerHTML = "Vraag " + (questionCounter + 1) + " van " + questionLimit;

    // get random question
    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentQuestion = questionIndex;
    vraagTekst.innerHTML = "Duid " + currentQuestion.country + " aan op de kaart";

    // get the position of 'questionIndex' from the availableQuestion Array
    const index1 = availableQuestions.indexOf(questionIndex);
    // remove the 'questionIndex' from the availableQuestion Array, so that the question does not repeat
    availableQuestions.splice(index1, 1);
    // 
    if (currentQuestion.hasOwnProperty("img")) {
        const img = document.createElement("img");
        img.src = imgLink + currentQuestion.img;
        img.alt = currentQuestion.country;
        vraagTekst.appendChild(img);
    }
    // 
    // set options
    // get the length of options
    // const optionLen = currentQuestion.options.length;
    // // push options into availableOptions Array
    // for (let i = 0; i < optionLen; i++) {
    //     availableOptions.push(i)
    // }
    // keuzeContainer.innerHTML = '';
    // let animationDelay = 0.15;
    // // create options in html - answers are send to the getResult function
    // for (let i = 0; i < optionLen; i++) {
    //     // random option
    //     const optonIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
    //     // get the position of 'optonIndex' from the availableOptions Array
    //     const index2 = availableOptions.indexOf(optonIndex);
    //     // remove the  'optonIndex' from the availableOptions Array , so that the option does not repeat
    //     availableOptions.splice(index2, 1);
    //     const option = document.createElement("div");
    //     option.innerHTML = currentQuestion.options[optonIndex];
    //     option.id = optonIndex;
    //     option.style.animationDelay = animationDelay + 's';
    //     animationDelay = animationDelay + 0.15;
    //     option.className = "option";
    //     keuzeContainer.appendChild(option);
    //     option.setAttribute("onclick", "getResult(this)");
    // }
    //
    // console.log(availableQuestions)
    // console.log(availableOptions)
    questionCounter++;
}

// get the result of current attempt question
// function getResult(element) {
function getResult(country) {
    // check if the answer from the map is correct 
    if (country === currentQuestion.country) {
        // add the indicator to correct mark
        updateantwoordIndicator("correct");
        correctantwoorden++;
    } else {
        // add the indicator to wrong mark
        updateantwoordIndicator("wrong");
    }
    attempt++;
    next();
    // unclickableOptions();
}

// make all the options unclickable once the user select a option (RESTRICT THE USER TO CHANGE THE OPTION AGAIN)
function unclickableOptions() {
    const optionLen = keuzeContainer.children.length;
    for (let i = 0; i < optionLen; i++) {
        keuzeContainer.children[i].classList.add("already-antwoorded");
    }
}

function antwoordenIndicator() {
    antwoordenIndicatorContainer.innerHTML = '';
    const totalQuestion = questionLimit;
    for (let i = 0; i < totalQuestion; i++) {
        const indicator = document.createElement("div");
        antwoordenIndicatorContainer.appendChild(indicator);
    }
}

function updateantwoordIndicator(markType) {
    antwoordenIndicatorContainer.children[questionCounter - 1].classList.add(markType);
}

function next() {
    if (questionCounter === questionLimit) {
        quizOver();
    } else {
        getNewQuestion();
    }
}

function quizOver() {
    // hide quiz Box
    quizBox.classList.add("hide");
    // show result Box
    resultBox.classList.remove("hide");
    quizResult();
}
// get the quiz Result
function quizResult() {
    resultBox.querySelector(".totaal-vragen").innerHTML = questionLimit;
    resultBox.querySelector(".totaal-poging").innerHTML = attempt;
    resultBox.querySelector(".totaal-correct").innerHTML = correctantwoorden;
    resultBox.querySelector(".totaal-fout").innerHTML = attempt - correctantwoorden;
    const percentage = (correctantwoorden / questionLimit) * 100;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultBox.querySelector(".totaal-score").innerHTML = correctantwoorden + " / " + questionLimit;
}

function resetQuiz() {
    questionCounter = 0;
    correctantwoorden = 0;
    attempt = 0;
    availableQuestions = [];
}

function tryAgainQuiz() {
    // hide the resultBox
    resultBox.classList.add("hide");
    // show the quizBox
    quizBox.classList.remove("hide");
    resetQuiz();
    startQuiz();
}

function goToHome() {
    // hide result Box
    resultBox.classList.add("hide");
    // show home box
    homeBox.classList.remove("hide");
    resetQuiz();
}

// #### STARTING POINT ####

function startQuiz() {

    // hide home box 
    homeBox.classList.add("hide");
    // show quiz Box
    quizBox.classList.remove("hide");
    // first we will set all questions in availableQuestions Array
    setAvailableQuestions();
    // second we will call getNewQuestion(); function
    getNewQuestion();
    // to create indicator of antwoorden
    antwoordenIndicator();
}


window.onload = function() {
    homeBox.querySelector(".totaal-vragen").innerHTML = questionLimit;
}