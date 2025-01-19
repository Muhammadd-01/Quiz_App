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
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const confettiContainer = document.getElementById('confetti-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');
const starRating = document.getElementById('star-rating');
const stars = document.querySelectorAll('.star');
const gokuImage = document.getElementById('goku-image');
const gokuContainer = document.getElementById('goku-container');
const gokuSprite = document.getElementById('goku-sprite');

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];
let timeLeft = 60;
let timerInterval;
let currentQuestions = [];

// Fetch questions from API
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await response.json();
        return data.results.map(q => ({
            question: q.question,
            answers: [
                { text: q.correct_answer, correct: true },
                ...q.incorrect_answers.map(answer => ({ text: answer, correct: false }))
            ].sort(() => Math.random() - 0.5),
            feedback: `The correct answer is: ${q.correct_answer}`
        }));
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}

// Initialize quiz
async function startQuiz() {
    currentQuestions = await fetchQuestions();
    if (currentQuestions.length === 0) {
        alert('Failed to fetch questions. Please try again later.');
        return;
    }
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = new Array(currentQuestions.length).fill(false);
    nextButton.innerHTML = "Next";
    resultContainer.style.display = "none";
    questionContainer.style.display = "block";
    startTimer();
    showQuestion();
    gokuFlyAcrossScreen();
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
    gokuSprite.classList.remove("super-saiyan", "flying");
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
        gokuPowerUp();
    } else {
        selectedButton.classList.add("incorrect", "bg-red-500", "text-white");
        feedbackContainer.classList.add("incorrect");
        gokuNormal();
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
    if (score > currentQuestions.length / 2) {
        gokuSuperSaiyan();
    } else {
        gokuNormal();
    }
}

// Handle retry button click
retryButton.addEventListener("click", () => {
    startQuiz();
});

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

// Goku animations
function gokuFlyAcrossScreen() {
    gokuSprite.classList.add("flying");
    setTimeout(() => {
        gokuSprite.classList.remove("flying");
    }, 5000);
}

function gokuPowerUp() {
    gokuSprite.classList.add("super-saiyan");
    setTimeout(() => {
        gokuSprite.classList.remove("super-saiyan");
    }, 2000);
}

function gokuSuperSaiyan() {
    gokuSprite.classList.add("super-saiyan");
}

function gokuNormal() {
    gokuSprite.classList.remove("super-saiyan");
}

// Start the quiz
startQuiz();

