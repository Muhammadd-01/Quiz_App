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
const characterImage = document.getElementById('character-image');
const characterContainer = document.getElementById('character-container');
const shenronContainer = document.getElementById('shenron-container');
const villainContainer = document.getElementById('villain-container');
const villainImage = document.getElementById('villain-image');
const attackEffect = document.getElementById('attack-effect');

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];
let timeLeft = 60;
let timerInterval;
let currentQuestions = [];

const dbzCharacters = [
    { name: 'Goku', image: 'https://i.imgur.com/JYUB0m3.png' },
    { name: 'Vegeta', image: 'https://i.imgur.com/YfxMdBE.png' },
    { name: 'Gohan', image: 'https://i.imgur.com/pJOFY4D.png' },
    { name: 'Piccolo', image: 'https://i.imgur.com/NbZVWAn.png' },
    { name: 'Trunks', image: 'https://i.imgur.com/TSvGzTr.png' }
];

const dbzVillains = [
    { name: 'Frieza', image: 'https://i.imgur.com/8xQyoOS.png' },
    { name: 'Cell', image: 'https://i.imgur.com/QQGN9JY.png' },
    { name: 'Majin Buu', image: 'https://i.imgur.com/CU1BLFa.png' },
    { name: 'Broly', image: 'https://i.imgur.com/XfaWWbS.png' }
];

const dbzQuestions = [
    {
        question: "Who is Goku's rival and Saiyan prince?",
        answers: [
            { text: 'Vegeta', correct: true },
            { text: 'Piccolo', correct: false },
            { text: 'Frieza', correct: false },
            { text: 'Krillin', correct: false }
        ],
        feedback: "Vegeta is Goku's rival and the prince of all Saiyans."
    },
    {
        question: "What is the name of Goku's signature attack?",
        answers: [
            { text: 'Kamehameha', correct: true },
            { text: 'Spirit Bomb', correct: false },
            { text: 'Galick Gun', correct: false },
            { text: 'Destructo Disk', correct: false }
        ],
        feedback: "The Kamehameha is Goku's signature energy wave attack."
    },
    {
        question: "Who is Gohan's mentor?",
        answers: [
            { text: 'Piccolo', correct: true },
            { text: 'Goku', correct: false },
            { text: 'Vegeta', correct: false },
            { text: 'Krillin', correct: false }
        ],
        feedback: "Piccolo becomes Gohan's mentor and trains him in martial arts."
    },
    {
        question: "What is the name of the wish-granting dragon in Dragon Ball Z?",
        answers: [
            { text: 'Shenron', correct: true },
            { text: 'Porunga', correct: false },
            { text: 'Eternal Dragon', correct: false },
            { text: 'Omega Shenron', correct: false }
        ],
        feedback: "Shenron is the eternal dragon that grants wishes when the Dragon Balls are gathered."
    },
    {
        question: "What is the highest level of Super Saiyan achieved in the original Dragon Ball Z series?",
        answers: [
            { text: 'Super Saiyan 3', correct: true },
            { text: 'Super Saiyan', correct: false },
            { text: 'Super Saiyan 2', correct: false },
            { text: 'Super Saiyan 4', correct: false }
        ],
        feedback: "Super Saiyan 3 is the highest level achieved in the original Dragon Ball Z series."
    }
];

// Initialize quiz
function startQuiz() {
    currentQuestions = [...dbzQuestions];
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = new Array(currentQuestions.length).fill(false);
    nextButton.innerHTML = "Next";
    resultContainer.style.display = "none";
    questionContainer.style.display = "block";
    startTimer();
    showQuestion();
    createShenron();
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
    updateCharacter();
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
    villainContainer.style.display = "none";
    attackEffect.classList.remove('active');
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
        characterPowerUp();
    } else {
        selectedButton.classList.add("incorrect", "bg-red-500", "text-white");
        feedbackContainer.classList.add("incorrect");
        showVillainAttack();
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
    finalScoreDisplay.innerHTML = `Your power level: ${score * 1000} out of ${currentQuestions.length * 1000}`;
    resultContainer.style.display = "block";
    resultContainer.classList.add("fade-in");
    nextButton.style.display = "none";
    prevButton.style.display = "none";
    questionContainer.style.display = "none";
    timerDisplay.parentElement.style.display = "none";
    createConfetti();
    if (score > currentQuestions.length / 2) {
        characterImage.src = 'https://i.imgur.com/JYUB0m3.png'; // Super Saiyan Goku
        characterContainer.classList.add("power-up");
    } else {
        characterImage.src = 'https://i.imgur.com/pJOFY4D.png'; // Normal Goku
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

// Update character
function updateCharacter() {
    const character = dbzCharacters[Math.floor(Math.random() * dbzCharacters.length)];
    characterImage.src = character.image;
    characterImage.alt = character.name;
}

// Create Shenron
function createShenron() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    shenronContainer.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const shenron = new THREE.Mesh(geometry, material);
    scene.add(shenron);

    camera.position.z = 30;

    function animate() {
        requestAnimationFrame(animate);
        shenron.rotation.x += 0.01;
        shenron.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

// Show villain attack
function showVillainAttack() {
    const villain = dbzVillains[Math.floor(Math.random() * dbzVillains.length)];
    villainImage.src = villain.image;
    villainImage.alt = villain.name;
    villainContainer.style.display = 'block';

    // Animate villain attack
    anime({
        targets: villainImage,
        translateX: [300, 0],
        translateY: [300, 0],
        scale: [0, 1],
        rotate: '1turn',
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // Show attack effect
    attackEffect.classList.add('active');
    setTimeout(() => {
        attackEffect.classList.remove('active');
    }, 500);

    // Show demotivational pop-up
    Swal.fire({
        title: 'Oops!',
        text: 'You got hit by ' + villain.name + '! Try again!',
        icon: 'error',
        confirmButtonText: 'Power Up!',
        background: '#fff url(' + villain.image + ')',
        backdrop: `
            rgba(0,0,123,0.4)
            url("https://i.imgur.com/CU1BLFa.png")
            left top
            no-repeat
        `
    });
}

// Character power-up animation
function characterPowerUp() {
    characterContainer.classList.add('power-up');
    
    // Animate character power-up
    anime({
        targets: characterImage,
        scale: [1, 1.2, 1],
        rotate: '1turn',
        duration: 1000,
        easing: 'easeInOutQuad'
    });

    // Add power-up effect
    const powerUpEffect = document.createElement('div');
    powerUpEffect.classList.add('power-up-effect');
    characterContainer.appendChild(powerUpEffect);

    anime({
        targets: powerUpEffect,
        scale: [0, 1.5],
        opacity: [1, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        complete: function() {
            powerUpEffect.remove();
        }
    });
}

// Start the quiz
startQuiz();

// Add event listener for window resize
window.addEventListener('resize', function() {
    // Adjust particle.js canvas size
    if (window.pJSDom && window.pJSDom[0].pJS.canvas) {
        window.pJSDom[0].pJS.canvas.w = window.innerWidth;
        window.pJSDom[0].pJS.canvas.h = window.innerHeight;
        window.pJSDom[0].pJS.fn.canvasPaint();
        window.pJSDom[0].pJS.fn.canvasSize();
    }
});

// Function to update quiz container size
function updateQuizContainerSize() {
    const quizContainer = document.getElementById('quiz-container');
    const windowHeight = window.innerHeight;
    const containerHeight = windowHeight * 0.8; // 80% of window height
    quizContainer.style.maxHeight = `${containerHeight}px`;
    quizContainer.style.overflowY = 'auto';
}

// Call the function on load and resize
window.addEventListener('load', updateQuizContainerSize);
window.addEventListener('resize', updateQuizContainerSize);

// Add custom anime.js animation for question transitions
function animateQuestionTransition() {
    anime({
        targets: '#question-container',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutQuad'
    });
}

// Modify showQuestion function to include animation
const originalShowQuestion = showQuestion;
showQuestion = function() {
    originalShowQuestion();
    animateQuestionTransition();
};

// Add background music
const bgMusic = new Audio('https://example.com/dbz-theme.mp3'); // Replace with actual DBZ theme music URL
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Function to toggle background music
function toggleBgMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
}

// Add music toggle button
const musicToggleBtn = document.createElement('button');
musicToggleBtn.innerHTML = '🎵';
musicToggleBtn.classList.add('music-toggle-btn');
document.body.appendChild(musicToggleBtn);

musicToggleBtn.addEventListener('click', toggleBgMusic);

// Initialize the quiz
startQuiz();

