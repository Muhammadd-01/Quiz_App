// Quiz questions
const questions = [
    {
        question: "What's the secret ingredient in the Krabby Patty formula?",
        answers: [
            { text: "Love", correct: false },
            { text: "Seahorse radish", correct: false },
            { text: "A pinch of King Neptune's Poseidon Powder", correct: true },
            { text: "Chum", correct: false }
        ]
    },
    {
        question: "Which planet is known for its fabulous ring collection?",
        answers: [
            { text: "Jupiter, the fashionista", correct: false },
            { text: "Saturn, the cosmic showoff", correct: true },
            { text: "Mars, the red carpet star", correct: false },
            { text: "Uranus, the underappreciated trendsetter", correct: false }
        ]
    },
    {
        question: "What do you call a fake noodle?",
        answers: [
            { text: "An impasta", correct: true },
            { text: "A pseudoodle", correct: false },
            { text: "A fauxccini", correct: false },
            { text: "A mock-aroni", correct: false }
        ]
    },
    {
        question: "Which animal's milk is used to make authentic mozzarella cheese?",
        answers: [
            { text: "Cow", correct: false },
            { text: "Goat", correct: false },
            { text: "Water Buffalo", correct: true },
            { text: "Sheep", correct: false }
        ]
    },
    {
        question: "What's the best way to watch a fly fishing tournament?",
        answers: [
            { text: "Live stream", correct: true },
            { text: "On the river bank", correct: false },
            { text: "Through binoculars", correct: false },
            { text: "On a fish-eye lens", correct: false }
        ]
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

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = new Array(questions.length).fill(false);
let timeLeft = 60;
let timerInterval;

// Initialize quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = new Array(questions.length).fill(false);
    nextButton.innerHTML = "Next";
    resultContainer.style.display = "none";
    questionContainer.style.display = "block";
    startTimer();
    showQuestion();
}

// Display current question
function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
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
}

// Handle answer selection
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) {
        selectedButton.classList.add("correct", "bg-green-500", "text-white");
        score++;
        createConfetti();
    } else {
        selectedButton.classList.add("incorrect", "bg-red-500", "text-white");
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

    if (currentQuestionIndex === questions.length - 1) {
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
    progressDisplay.innerHTML = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Handle next button click
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
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
    finalScoreDisplay.innerHTML = `Your score: ${score} out of ${questions.length}`;
    resultContainer.style.display = "block";
    resultContainer.classList.add("fade-in");
    nextButton.style.display = "none";
    prevButton.style.display = "none";
    questionContainer.style.display = "none";
    timerDisplay.timerDisplay.parentElement.style.display = "none";
    createConfetti();
}

// Handle retry button click
retryButton.addEventListener("click", () => {
    startQuiz();
});

// Handle show answers button click
showAnswersButton.addEventListener("click", () => {
    showAnswers();
});

// Show correct answers
function showAnswers() {
    resetState();
    questionText.innerHTML = "Correct Answers";
    questions.forEach((question, index) => {
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

// Start the quiz
startQuiz();

