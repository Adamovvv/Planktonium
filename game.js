document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    const gameArea = document.getElementById('gameArea');
    const gameTimerElem = document.getElementById('gameTimer');
    const scoreElem = document.getElementById('score');
    let gameTime = 20;
    let score = 0;
    let gameInterval;
    let elementInterval;
    let isFrozen = false;

    gameArea.innerHTML = '';
    gameTimerElem.textContent = gameTime;
    scoreElem.textContent = score;

    const gameObjects = [];

    function startGameTimer() {
        gameInterval = setInterval(() => {
            if (!isFrozen) {
                if (gameTime > 0) {
                    gameTime--;
                    gameTimerElem.textContent = gameTime;
                } else {
                    clearInterval(gameInterval);
                    clearInterval(elementInterval);
                    endGame(score);
                }
            }
        }, 1000);
    }

    function startElementCreation() {
        elementInterval = setInterval(() => {
            if (!isFrozen) {
                createGameElement(gameArea, gameObjects);
            }
        }, 150);
    }

    startGameTimer();
    startElementCreation();

gameArea.addEventListener('click', handleElementClick);
gameArea.addEventListener('touchstart', handleElementClick);

function handleElementClick(event) {
    if (event.target.classList.contains('coin')) {
        score += 1;
        scoreElem.textContent = score;
        removeElement(event.target.parentNode);
        navigator.vibrate(100);
    } else if (event.target.classList.contains('freeze')) {
        freezeGame();
        removeElement(event.target.parentNode);
        navigator.vibrate(200);
    } else if (event.target.classList.contains('bomb')) {
        score -= 20;
        if (score < 0) score = 0;
        scoreElem.textContent = score;
        removeElement(event.target.parentNode);
        navigator.vibrate(300);
    }
}

    function freezeGame() {
        isFrozen = true;
        gameObjects.forEach((obj) => {
            obj.style.animationPlayState = 'paused';
        });
        setTimeout(() => {
            isFrozen = false;
            gameObjects.forEach((obj) => {
                obj.style.animationPlayState = 'running';
            });
        }, 2000);
    }

    function removeElement(containerDiv) {
        gameArea.removeChild(containerDiv);
        const index = gameObjects.indexOf(containerDiv);
        if (index > -1) {
            gameObjects.splice(index, 1);
        }
        containerDiv.classList.add('clicked');
    }
}

function createGameElement(gameArea, gameObjects) {
    const elementSize = Math.random() * 10 + 35;
    const containerSize = elementSize + 10;

    const containerDiv = document.createElement('div');
    containerDiv.style.width = containerSize + 'px';
    containerDiv.style.height = containerSize + 'px';
    containerDiv.style.position = 'absolute';
    containerDiv.style.left = Math.random() * 90 + '%';
    containerDiv.className = 'falling'; // Ensure the container has the falling animation

    const elementDiv = document.createElement('div');
    elementDiv.style.width = elementSize + 'px';
    elementDiv.style.height = elementSize + 'px';
    elementDiv.style.margin = 'auto';
    elementDiv.style.position = 'relative';
    elementDiv.style.top = '50%';
    elementDiv.style.transform = 'translateY(-50%)';

    if (Math.random() < 0.05) {
        elementDiv.className = 'freeze';
    } else if (Math.random() < 0.05) {
        elementDiv.className = 'bomb';
    } else {
        elementDiv.className = 'coin';
    }

    containerDiv.appendChild(elementDiv);
    gameArea.appendChild(containerDiv);
    gameObjects.push(containerDiv);

    containerDiv.addEventListener('animationend', () => {
        if (containerDiv.parentNode) {
            gameArea.removeChild(containerDiv);
        }
        const index = gameObjects.indexOf(containerDiv);
        if (index > -1) {
            gameObjects.splice(index, 1);
        }
    });
}

function endGame(score) {
    let balance = parseInt(localStorage.getItem('balance')) || 0;
    balance += score;
    localStorage.setItem('balance', balance);
    showPlayAgainWindow(score);
}

function showPlayAgainWindow(score) {
    const playAgainWindow = document.getElementById('playAgainWindow');
    document.getElementById('finalScore').textContent = `${score}`;
    playAgainWindow.classList.remove('hidden');
}
