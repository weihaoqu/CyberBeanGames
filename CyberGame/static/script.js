/**
 * HACK THE SYSTEM - Game Logic
 * =============================
 * Handles all client-side game mechanics including:
 * - Countdown timer
 * - Challenge loading and display
 * - Answer submission and feedback
 * - Score tracking
 * - Game over conditions
 */

// Game state
let gameTimer;
let timeRemaining = 60;
let isAnswering = false;

// Mobile viewport fix: set CSS variable --vh to account for dynamic address bar on iOS
function setVhVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVhVariable();
window.addEventListener('resize', setVhVariable);

// DOM Elements
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const progressElement = document.getElementById('progress');
const scenarioElement = document.getElementById('scenario');
const optionsContainer = document.getElementById('options-container');
const challengeContainer = document.getElementById('challenge-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackResult = document.getElementById('feedback-result');
const feedbackExplanation = document.getElementById('feedback-explanation');
const nextButton = document.getElementById('next-btn');
const loadingElement = document.getElementById('loading');
const gameOverModal = document.getElementById('game-over-modal');

/**
 * Initialize game when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    loadChallenge();
    startTimer();
    
    // Setup next button click handler
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            loadChallenge();
        });
    }
});

/**
 * Start the countdown timer
 */
function startTimer() {
    gameTimer = setInterval(function() {
        timeRemaining--;
        updateTimerDisplay();
        
        // Update server with current time
        if (timeRemaining % 5 === 0) {
            updateServerTime();
        }
        
        // Check for game over
        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

/**
 * Update timer display with visual warnings
 */
function updateTimerDisplay() {
    timerElement.textContent = timeRemaining;
    
    // Add warning classes based on time remaining
    timerElement.classList.remove('warning', 'danger');
    if (timeRemaining <= 10) {
        timerElement.classList.add('danger');
    } else if (timeRemaining <= 20) {
        timerElement.classList.add('warning');
    }
}

/**
 * Update server with current time remaining
 */
function updateServerTime() {
    fetch('/api/update-time', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            time_remaining: timeRemaining
        })
    }).catch(error => console.error('Error updating time:', error));
}

/**
 * Load the current challenge from server
 */
function loadChallenge() {
    // Show loading state
    showLoading();
    
    fetch('/api/get-challenge')
        .then(response => response.json())
        .then(data => {
            hideLoading();
            
            if (data.complete) {
                // All challenges completed - redirect to results
                window.location.href = '/result';
            } else {
                displayChallenge(data);
            }
        })
        .catch(error => {
            console.error('Error loading challenge:', error);
            hideLoading();
        });
}

/**
 * Display a challenge on screen
 */
function displayChallenge(data) {
    // Reset state
    isAnswering = false;
    
    // Update progress
    progressElement.textContent = `${data.progress.current}/${data.progress.total}`;
    
    // Update score
    scoreElement.textContent = data.score;
    
    // Display scenario
    scenarioElement.textContent = data.challenge.scenario;
    
    // Clear and populate options
    optionsContainer.innerHTML = '';
    data.challenge.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => submitAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    // Show challenge, hide feedback
    challengeContainer.classList.remove('hidden');
    feedbackContainer.classList.remove('hidden');
    feedbackContainer.classList.add('hidden');
}

/**
 * Submit player's answer to server
 */
function submitAnswer(answerIndex) {
    // Prevent double-clicking
    if (isAnswering) return;
    isAnswering = true;
    
    // Disable all option buttons
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Show loading
    showLoading();
    
    // Submit to server
    fetch('/api/submit-answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            answer: answerIndex
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        displayFeedback(data);
    })
    .catch(error => {
        console.error('Error submitting answer:', error);
        hideLoading();
        isAnswering = false;
    });
}

/**
 * Display feedback after answer submission
 */
function displayFeedback(data) {
    // Update score and time
    scoreElement.textContent = data.score;
    timeRemaining = data.time_remaining;
    updateTimerDisplay();
    
    // Hide challenge, show feedback
    challengeContainer.classList.add('hidden');
    feedbackContainer.classList.remove('hidden');
    
    // Set feedback styling
    feedbackContainer.classList.remove('correct', 'incorrect');
    feedbackResult.classList.remove('correct', 'incorrect');
    
    if (data.correct) {
        feedbackContainer.classList.add('correct');
        feedbackResult.classList.add('correct');
        feedbackResult.innerHTML = '✅ CORRECT! +10 POINTS | +5 SECONDS';
    } else {
        feedbackContainer.classList.add('incorrect');
        feedbackResult.classList.add('incorrect');
        feedbackResult.innerHTML = '❌ INCORRECT! -5 POINTS | -3 SECONDS';
    }
    
    // Display explanation
    feedbackExplanation.textContent = data.explanation;
    
    // Check if game is complete
    if (data.game_complete) {
        // Delay redirect to show final feedback
        nextButton.textContent = 'VIEW RESULTS >>';
        nextButton.onclick = () => {
            window.location.href = '/result';
        };
    } else {
        nextButton.textContent = 'NEXT THREAT >>';
        nextButton.onclick = () => {
            loadChallenge();
        };
    }
}

/**
 * End game when timer runs out
 */
function endGame() {
    clearInterval(gameTimer);
    
    // Show game over modal
    if (gameOverModal) {
        gameOverModal.classList.remove('hidden');
        
        // Redirect to results after short delay
        setTimeout(() => {
            window.location.href = '/result';
        }, 2000);
    } else {
        // Fallback if modal doesn't exist
        window.location.href = '/result';
    }
}

/**
 * Show loading indicator
 */
function showLoading() {
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

/**
 * Handle page visibility changes (pause timer when tab not active)
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - could pause timer here if desired
        // For now, we let it continue for challenge
    } else {
        // Page is visible again
        updateTimerDisplay();
    }
});