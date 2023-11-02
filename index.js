const quizSection = document.querySelectorAll(".quiz-section");

const startSection = document.getElementById("start");
const strtbtn = document.getElementById("start-button");

const quizsections = document.getElementById("quiz-questions");
const timeLeft = document.getElementById("time-remaining");
const question = document.getElementById("question");
const choice = document.getElementById("choices");
const choicestatus = document.querySelectorAll(".choice-status");
const correct = document.getElementById("correct");
const incorrect = document.getElementById("incorrect");

const sectionEnd = document.getElementById("end");
const titleEnd = document.getElementById("end-title");
const score = document.getElementById("score");
const inputInitl = document.getElementById("initials");
const sumbitscore = document.getElementById("submit-score");
const errorMsg = document.getElementById("error-message");

class Question {
  constructor(question, choices, correctChoice) {
    this.question = question;
    this.choices = choices;
    this.correctChoice = correctChoice;
  }
}
const q1 = new Question("Commonly used data types DO NOT include: ", 
  ["Strings", "Booleans", "Alerts", "Numbers"], 2);
const q2 = new Question("The condition in an if / else statement is enclosed within ____.", 
  ["Quotes", "Curly brackets", "Parentheses", "Square brackets"], 2);
const q3 = new Question("Arrays in JavaScript can be used to store ____.", 
  ["Numbers and Strings", "Other arrays", "Booleans", "All of the above"], 3);
const q4 = new Question("String values must be enclosed within _____ when being assigned to variables.", 
  ["Commas", "Curly brackets", "Quotes", "Parentheses"], 2);
const q5 = new Question("A very useful tool used during development and debugging for printing content to the debugger is: ", 
  ["JavaScript", "Terminal/Bash", "For Loops", "console.log"], 3);
const questionList = [q1, q2, q3, q4, q5];

let currentQuestion = 0;

let totalTime = 75;
let totalTimeleft;
let choiceTimeout; 

strtbtn.addEventListener('click', startGame);
choice.addEventListener('click', processChoice);
sumbitscore.addEventListener('submit', processInput);

function startGame() {
  showElement(quizSection, quizsections);
  
  displayTime();  
  displayQuestion();

  startTimer();
}

function showElement(siblingList, showElement) {
  for (element of siblingList) {
    hideElement(element);
  }
  showElement.classList.remove("hidden");
} 

function hideElement(element) {
  if (!element.classList.contains("hidden")) {
    element.classList.add("hidden");
  }
}

function displayTime() {
  timeLeft.textContent = totalTime;
}

function startTimer() {
  totalTimeleft = setInterval(function() {
    totalTime--;
    displayTime();
    checkTime();

  }, 1000);
}

function checkTime() {
  if (totalTime <= 0) {
    totalTime = 0;
    endGame();
  }
}

function displayQuestion() {
  question.textContent = questionList[currentQuestion].question;

  answerListDisplay();
}

function answerListDisplay() {
  choice.innerHTML = "";

  questionList[currentQuestion].choices.forEach(function(answer, index) {
    const li = document.createElement("li");
    li.dataset.index = index;
    const button = document.createElement("button");
    button.textContent = (index + 1) + ". " + answer;
    li.appendChild(button);
    choice.appendChild(li);
  });
}

function processChoice(event) {
  const userChoice = parseInt(event.target.parentElement.dataset.index);

  resetChoiceStatusEffects();
  checkChoice(userChoice);
  getNextQuestion();
}

function resetChoiceStatusEffects() {
  clearTimeout(choiceTimeout);
  styleTimeRemainingDefault();
}

function styleTimeRemainingDefault() {
  timeLeft.style.color = "#fff";
}

function styleTimeRemainingWrong() {
  timeLeft.style.color = "#fff";
}

function checkChoice(userChoice) {
  if (isChoiceCorrect(userChoice)) {
    displayCorrectChoiceEffects();
  } else {
    displayWrongChoiceEffects();
  }
}

function isChoiceCorrect(choice) {
  return choice === questionList[currentQuestion].correctChoice;
}

function displayWrongChoiceEffects() {
  deductTimeBy(10);

  styleTimeRemainingWrong();
  showElement(choicestatus, incorrect);

  choiceTimeout = setTimeout(function() {
    hideElement(incorrect);
    styleTimeRemainingDefault();
  }, 1000);
}

function deductTimeBy(seconds) {
  totalTime -= seconds;
  checkTime();
  displayTime();
}

function displayCorrectChoiceEffects() {
  showElement(choicestatus, correct);

  choiceTimeout = setTimeout(function() {
    hideElement(correct);
  }, 1000);
}

function getNextQuestion() {
  currentQuestion++;
  if (currentQuestion >= questionList.length) {
    endGame();
  } else {
    displayQuestion();
  }
}

function endGame() {
  clearInterval(totalTimeleft);
  
  showElement(quizSection, sectionEnd);
  displayScore();
  setEndHeading();
}

function displayScore() {
  score.textContent = totalTime;
}

function setEndHeading() {
  if (totalTime === 0) {
    titleEnd.textContent = "Oh no! Your time is out";
  } else {
    titleEnd.textContent = "You completed the test!";
  }
}

function processInput(event) {
  event.preventDefault();

  const initials = inputInitl.value.toUpperCase();

  if (isInputValid(initials)) {
    const score = totalTime;
    const highscoreEntry = getNewHighscoreEntry(initials, score);
    saveHighscoreEntry(highscoreEntry);
    window.location.href= "./highscores.html";
  }
}

function getNewHighscoreEntry(initials, score) {
  const entry = {
    initials: initials,
    score: score,
  }
  return entry;
}

function isInputValid(initials) {
  let errorMessage = "";
  if (initials === "") {
    errorMessage = "Initials cannot be left empty";
    displayFormError(errorMessage);
    return false;
  } else if (initials.match(/[^a-z]/ig)) {
    errorMessage = "Initials can only have letters."
    displayFormError(errorMessage);
    return false;
  } else {
    return true;
  }
}

function displayFormError(errorMessage) {
  errorMsg.textContent = errorMessage;
  if (!inputInitl.classList.contains("error")) {
    inputInitl.classList.add("error");
  }
}

function saveHighscoreEntry(highscoreEntry) {
  const currentScores = getScoreList();
  placeEntryInHighscoreList(highscoreEntry, currentScores);
  localStorage.setItem('scoreList', JSON.stringify(currentScores));
}

function getScoreList() {
  const currentScores = localStorage.getItem('scoreList');
  if (currentScores) {
    return JSON.parse(currentScores);
  } else {
    return [];
  }
}

function placeEntryInHighscoreList(newEntry, scoreList) {
  const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
  scoreList.splice(newScoreIndex, 0, newEntry);
}

function getNewScoreIndex(newEntry, scoreList) {
  if (scoreList.length > 0) {
    for (let i = 0; i < scoreList.length; i++) {
      if (scoreList[i].score <= newEntry.score) {
        return i;
      }
    } 
  }
  return scoreList.length;
}