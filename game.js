document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    const gameArea = document.getElementById('gameArea');
    const gameTimerElem = document.getElementById('gameTimer');
    const scoreElem = document.getElementById('score');
    let gameTime = 1;
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
            score += 1;
            scoreElem.textContent = score;
            gameArea.removeChild(event.target);
        } else if (event.target.classList.contains('freeze')) {
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
            gameArea.removeChild(event.target);
        } else if (event.target.classList.contains('bomb')) {
            score -= 20;
            if (score < 0) score = 0;
            scoreElem.textContent = score;
            gameArea.removeChild(event.target);
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
