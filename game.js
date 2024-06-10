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

    // Таймер игры
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

    // Создание элементов
    function startElementCreation() {
        elementInterval = setInterval(() => {
            if (!isFrozen) {
                createGameElement(gameArea, gameObjects);
            }
        }, 150); // Интервал создания новых элементов
    }

    startGameTimer();
    startElementCreation();

    gameArea.addEventListener('click', (event) => {
        if (event.target.classList.contains('coin')) {
            handleElementClick(event.target, 1);
        } else if (event.target.classList.contains('freeze')) {
            handleElementClick(event.target, 0, true);
        } else if (event.target.classList.contains('bomb')) {
            handleElementClick(event.target, -20);
        }
    });
}

function createGameElement(gameArea, gameObjects) {
    const div = document.createElement('div');
    const size = Math.random() * 5 + 30; // Размер от 30px до 35px
    div.style.width = size + 'px';
    div.style.height = size + 'px';
    if (Math.random() < 0.05) {
        div.className = 'freeze falling';
    } else if (Math.random() < 0.05) {
        div.className = 'bomb falling';
    } else {
        div.className = 'coin falling';
    }
    div.style.left = Math.random() * 90 + '%';
    gameArea.appendChild(div);
    gameObjects.push(div);

    // Удаление объектов после завершения анимации
    div.addEventListener('animationend', () => {
        gameArea.removeChild(div);
        const index = gameObjects.indexOf(div);
        if (index > -1) {
            gameObjects.splice(index, 1);
        }
    });
}

function handleElementClick(element, scoreChange, isFreeze = false) {
    navigator.vibrate(100); // Вибрация на 100 мс
    const gameArea = document.getElementById('gameArea');
    const scoreElem = document.getElementById('score');
    let score = parseInt(scoreElem.textContent);

    if (isFreeze) {
        const gameObjects = Array.from(document.getElementsByClassName('falling'));
        gameObjects.forEach((obj) => {
            obj.style.animationPlayState = 'paused';
        });
        setTimeout(() => {
            gameObjects.forEach((obj) => {
                obj.style.animationPlayState = 'running';
            });
        }, 2000);
    } else {
        score += scoreChange;
        if (score < 0) score = 0;
        scoreElem.textContent = score;
    }

    gameArea.removeChild(element);
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
