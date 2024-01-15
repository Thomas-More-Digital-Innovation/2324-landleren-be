// ------ wwww.landleren.be ------ //

// importeren van de vereiste bestanden / data
const vraagNummer = document.querySelector(".aantal-vragen");
const vraagTekst = document.querySelector(".vraag-tekst");
const keuzeContainer = document.querySelector(".keuze-mogelijkheden");
const antwoordenIndicatorContainer = document.querySelector(".antwoord-aanduider");
const homeBox = document.querySelector(".start-scherm");
const quizBox = document.querySelector(".quiz-vak");
const resultBox = document.querySelector(".resultaat-vak");
const questionLimit = 10; // aantal vragen die gesteld worden, 10 in totaal
const imgLink = "https://static.landleren.be/"; // linkt naar de map waar alle vlaggen zich in bevinden - deze staan op een een andere server op de laadsnelheid te verbeteren door deze niet constant opnieuz op te moeten vragen
let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctantwoorden = 0;
let attempt = 0;
let answered = false;

// zet de vragen in de availableQuestions Array
function setAvailableQuestions() {
    const totalQuestion = quiz.length;
    for (let i = 0; i < totalQuestion; i++) {
        availableQuestions.push(quiz[i]);
    }
}


// opties voor de vragen op te roepen
function getNewQuestion() {
    answered = false;

    // stel het nummer van de vraag in
    vraagNummer.innerHTML = "Vraag " + (questionCounter + 1) + " van " + questionLimit;

    // stel de vraag in + de mogelijke antwoorden
    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentQuestion = questionIndex;
    vraagTekst.innerHTML = currentQuestion.q;

    // krijg de postie van de questionIndex in de availableQuestions array
    const index1 = availableQuestions.indexOf(questionIndex);

    // remove the questionIndex van de availableQuestions array zodat de vraag zich niet herhaalt
    availableQuestions.splice(index1, 1);

    // als er een foto bij de vraag hoort, haal dan deze foto op
    if (currentQuestion.hasOwnProperty("img")) {
        const img = document.createElement("img");
        img.src = imgLink + currentQuestion.img;
        vraagTekst.appendChild(img);
    }

    // krijg de lengte van de opties
    const optionLen = currentQuestion.options.length;

    // zet de opties in de availableOptions array
    for (let i = 0; i < optionLen; i++) {
        availableOptions.push(i)
    }
    keuzeContainer.innerHTML = '';
    let animationDelay = 0.15;

    for (let i = 0; i < optionLen; i++) {

        // random opties worden toegevoegd
        const optonIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        const index2 = availableOptions.indexOf(optonIndex);

        // de mogelijke optonIndex wordt verwijderd uit de array zodat deze zich niet herhaalt
        availableOptions.splice(index2, 1);
        const option = document.createElement("div");
        option.innerHTML = currentQuestion.options[optonIndex];
        option.id = optonIndex;
        option.style.animationDelay = animationDelay + 's';
        animationDelay = animationDelay + 0.15;
        option.className = "option";
        keuzeContainer.appendChild(option);
        option.setAttribute("onclick", "getResult(this)");
    }

    questionCounter++;
}

function getResult(element) {
    if (!answered) {
        answered = true;
        const id = parseInt(element.id);

        // als het antwoord correct is wordt het aangeduid met groen
        if (id === currentQuestion.antwoord) {
            element.classList.add("correct");

            // antwoord indicator wordt groen
            updateantwoordIndicator("correct");
            correctantwoorden++;

            // als het antwoord fout is wordt het aangeduid door rood
        } else {
            element.classList.add("wrong");

            // antwoord indicator wordt rood
            updateantwoordIndicator("wrong");

            const optionLen = keuzeContainer.children.length;
            for (let i = 0; i < optionLen; i++) {
                if (parseInt(keuzeContainer.children[i].id) === currentQuestion.antwoord) {
                    keuzeContainer.children[i].classList.add("correct");
                }
            }
        }

        attempt++;
        unclickableOptions();
    }
}

// deze functie zorgt ervoor dat de antwoorden 'unclickable' worden nadat er al één antwoord is aangeduid. Geen andere antwoord kan aangeduid worden.
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
    if (!answered) {
        updateantwoordIndicator("wrong");
    }

    if (questionCounter === questionLimit) {
        quizOver();
    } else {
        getNewQuestion();
    }
}

function quizOver() {
    homeBox.classList.add("hide");

    // quiz box wordt verstopt
    quizBox.classList.add("hide");

    // result box wordt getoond
    resultBox.classList.remove("hide");
    quizResult();
}

// Overzicht van de test, het tonen van het resultaat.
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

    // result box verstoppen
    resultBox.classList.add("hide");

    // de quiz box wordt terug getoond
    quizBox.classList.remove("hide");
    resetQuiz();
    startQuiz();
}

function goToHome() {

    //result box verstoppen
    resultBox.classList.add("hide");

    // de home box wordt getoond
    homeBox.classList.remove("hide");
    resetQuiz();
}

function startQuiz() {

    // home box wordt verstopt
    homeBox.classList.add("hide");

    // quiz Box wordt getoond
    quizBox.classList.remove("hide");

    // Alle mogelijke vragen worden opgeroepen in de array.
    setAvailableQuestions();

    // getNewQuestion(); functie wordt opgeroepen
    getNewQuestion();

    // indicator maken voor de antwoorden
    antwoordenIndicator();
}