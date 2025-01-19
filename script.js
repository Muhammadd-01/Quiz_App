// Quiz questions with difficulty levels
const questions = [
    {
        question: "What's the secret ingredient in the Krabby Patty formula?",
        answers: [
            { text: "Love", correct: false },
            { text: "Seahorse radish", correct: false },
            { text: "A pinch of King Neptune's Poseidon Powder", correct: true },
            { text: "Chum", correct: false }
        ],
        difficulty: "easy",
        feedback: "The Krabby Patty's secret formula is a mystery, but in the show, it's hinted that King Neptune's Poseidon Powder might be the key ingredient!"
    },
    {
        question: "Which planet is known for its fabulous ring collection?",
        answers: [
            { text: "Jupiter, the fashionista", correct: false },
            { text: "Saturn, the cosmic showoff", correct: true },
            { text: "Mars, the red carpet star", correct: false },
            { text: "Uranus, the underappreciated trendsetter", correct: false }
        ],
        difficulty: "easy",
        feedback: "Saturn is famous for its spectacular ring system, which is made up of ice particles, rocky debris, and dust."
    },
    {
        question: "What do you call a fake noodle?",
        answers: [
            { text: "An impasta", correct: true },
            { text: "A pseudoodle", correct: false },
            { text: "A fauxccini", correct: false },
            { text: "A mock-aroni", correct: false }
        ],
        difficulty: "easy",
        feedback: "An 'impasta' is a clever play on words, combining 'impostor' and 'pasta'!"
    },
    {
        question: "What is the capital of Burkina Faso?",
        answers: [
            { text: "Ouagadougou", correct: true },
            { text: "Bobo-Dioulasso", correct: false },
            { text: "Koudougou", correct: false },
            { text: "Banfora", correct: false }
        ],
        difficulty: "medium",
        feedback: "Ouagadougou is the capital of Burkina Faso, a country in West Africa."
    },
    {
        question: "In what year did the French Revolution begin?",
        answers: [
            { text: "1776", correct: false },
            { text: "1789", correct: true },
            { text: "1804", correct: false },
            { text: "1815", correct: false }
        ],
        difficulty: "medium",
        feedback: "The French Revolution began in 1789 with the Storming of the Bastille on July 14th."
    },
    {
        question: "What is the chemical symbol for the element Tungsten?",
        answers: [
            { text: "Tu", correct: false },
            { text: "Tn", correct: false },
            { text: "W", correct: true },
            { text: "Tg", correct: false }
        ],
        difficulty: "medium",
        feedback: "Tungsten's chemical symbol is W, which comes from its other name, Wolfram."
    },
    {
        question: "What is the value of π (pi) to 7 decimal places?",
        answers: [
            { text: "3.1415926", correct: true },
            { text: "3.1415927", correct: false },
            { text: "3.1415928", correct: false },
            { text: "3.1415929", correct: false }
        ],
        difficulty: "hard",
        feedback: "The value of π (pi) to 7 decimal places is 3.1415926. It's an irrational number, which means its decimal representation never ends or repeats."
    },
    {
        question: "What is the Fibonacci sequence for the first 8 numbers?",
        answers: [
            { text: "0, 1, 1, 2, 3, 5, 8, 13", correct: true },
            { text: "1, 1, 2, 3, 5, 8, 13, 21", correct: false },
            { text: "0, 1, 2, 3, 5, 8, 13, 21", correct: false },
            { text: "1, 2, 3, 5, 8, 13, 21, 34", correct: false }
        ],
        difficulty: "hard",
        feedback: "The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones."
    },
    {
        question: "What is the half-life of Carbon-14?",
        answers: [
            { text: "5,730 years", correct: true },
            { text: "1,000 years", correct: false },
            { text: "10,000 years", correct: false },
            { text: "50,000 years", correct: false }
        ],
        difficulty: "hard",
        feedback: "The half-life of Carbon-14 is approximately 5,730 years. This makes it useful for dating organic materials up to about 60,000 years old."
    }
];

// DOM elements
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const scoreDisplay = document.getElementById('score');
const progressDisplay = document.getElementById('progress');
const resultContainer = document.getElementById('result-container');
const finalScoreDisplay = document.getElementById('final-score');
const retryButton = document.getElementById('retry-button');
const showAnswersButton = document.getElementById('show-answers-button');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const confettiContainer = document.getElementById('confetti-container');
const difficultySelection = document.getElementById('difficulty-selection');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');
const starRating = document.getElementById('star-rating');
const stars = document.querySelectorAll('.star');

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];
let timeLeft = 60;
let timerInterval;
let selectedDifficulty = '';
let currentQuestions = [];

// Initialize quiz
function startQuiz(difficulty) {
    selectedDifficulty = difficulty;
    currentQuestions = questions.filter(q => q.difficulty === difficulty);
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = new Array(currentQuestions.length).fill(false);
    nextButton.innerHTML = "Next";
    resultContainer.style.display = "none";
    questionContainer.style.display = "block";
    difficultySelection.style.display = "none";
    startTimer();
    showQuestion();
}

// Display current question
function showQuestion() {
    resetState();
    let currentQuestion = currentQuestions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionText.innerHTML = questionNo + ". " + currentQuestion.question;
    questionText.classList.add('fade-in');

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("answer-button", "bg-gray-200", "text-gray-800", "py-2", "px-4", "rounded-full", "hover:bg-gray-300", "transition-colors", "slide-in");
        button.style.animationDelay = `${index * 0.1}s`;
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });

    updateNavigationButtons();
    updateProgress();
}

// Reset question state
function resetState() {
    nextButton.style.display = "block";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
    questionText.classList.remove('fade-in');
    feedbackContainer.style.display = "none";
    feedbackContainer.classList.remove("correct", "incorrect");
}

// Handle answer selection
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) {
        selectedButton.classList.add("correct", "bg-green-500", "text-white");
        score++;
        createConfetti();
        feedbackContainer.classList.add("correct");
    } else {
        selectedButton.classList.add("incorrect", "bg-red-500", "text-white");
        feedbackContainer.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct", "bg-green-500", "text-white");
        }
        button.disabled = true;
    });
    answeredQuestions[currentQuestionIndex] = true;
    updateScore();
    updateNavigationButtons();
    showFeedback(currentQuestions[currentQuestionIndex].feedback);
}

// Show feedback
function showFeedback(feedback) {
    feedbackText.textContent = feedback;
    feedbackContainer.style.display = "block";
    feedbackContainer.classList.add("fade-in");
}

// Update score display
function updateScore() {
    scoreDisplay.innerHTML = score;
    scoreDisplay.classList.add("scale-up");
    setTimeout(() => {
        scoreDisplay.classList.remove("scale-up");
    }, 300);
}

// Update navigation buttons
function updateNavigationButtons() {
    if (currentQuestionIndex === 0) {
        prevButton.style.display = "none";
    } else {
        prevButton.style.display = "block";
    }

    if (currentQuestionIndex === currentQuestions.length - 1) {
        nextButton.innerHTML = "Finish";
    } else {
        nextButton.innerHTML = "Next";
    }

    if (answeredQuestions[currentQuestionIndex]) {
        nextButton.disabled = false;
    } else {
        nextButton.disabled = true;
    }
}

// Update progress display
function updateProgress() {
    progressDisplay.innerHTML = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Handle next button click
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

// Handle previous button click
prevButton.addEventListener("click", () => {
    currentQuestionIndex--;
    showQuestion();
});

// Show quiz result
function showResult() {
    resetState();
    clearInterval(timerInterval);
    questionText.innerHTML = "Quiz Completed!";
    finalScoreDisplay.innerHTML = `Your score: ${score} out of ${currentQuestions.length}`;
    resultContainer.style.display = "block";
    resultContainer.classList.add("fade-in");
    nextButton.style.display = "none";
    prevButton.style.display = "none";
    questionContainer.style.display = "none";
    timerDisplay.parentElement.style.display = "none";
    createConfetti();
}

// Handle retry button click
retryButton.addEventListener("click", () => {
    difficultySelection.style.display = "block";
    resultContainer.style.display = "none";
});

// Handle show answers button click
showAnswersButton.addEventListener("click", () => {
    showAnswers();
});

// Show correct answers
function showAnswers() {
    resetState();
    questionText.innerHTML = "Correct Answers";
    currentQuestions.forEach((question, index) => {
        const answerParagraph = document.createElement("p");
        answerParagraph.classList.add("mb-2", "fade-in");
        answerParagraph.style.animationDelay = `${index * 0.1}s`;
        const correctAnswer = question.answers.find(answer => answer.correct);
        answerParagraph.innerHTML = `<strong>Q${index + 1}:</strong> ${correctAnswer.text}`;
        answerButtons.appendChild(answerParagraph);
    });
    nextButton.style.display = "none";
    prevButton.style.display = "none";
}

// Start timer
function startTimer() {
    timeLeft = 60;
    timerDisplay.parentElement.style.display = "block";
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResult();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 10) {
        timerDisplay.classList.add("danger");
    } else if (timeLeft <= 30) {
        timerDisplay.classList.add("warning");
    } else {
        timerDisplay.classList.remove("warning", "danger");
    }
}

// Create confetti effect
function createConfetti() {
    confettiContainer.innerHTML = '';
    confettiContainer.style.display = 'block';
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiContainer.appendChild(confetti);
    }
    setTimeout(() => {
        confettiContainer.style.display = 'none';
    }, 5000);
}

// Initialize particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
});

// Handle difficulty selection
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const difficulty = button.dataset.difficulty;
        startQuiz(difficulty);
    });
});

// Handle star rating
stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        setRating(rating);
    });

    star.addEventListener('mouseover', () => {
        const rating = parseInt(star.dataset.rating);
        highlightStars(rating);
    });

    star.addEventListener('mouseout', () => {
        resetStars();
    });
});

function setRating(rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function highlightStars(rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.classList.add('text-yellow-400');
        } else {
            star.classList.remove('text-yellow-400');
        }
    });
}

function resetStars() {
    stars.forEach(star => {
        if (!star.classList.contains('active')) {
            star.classList.remove('text-yellow-400');
        }
    });
}

// Start with difficulty selection
difficultySelection.style.display = "block";
questionContainer.style.display = "none";

