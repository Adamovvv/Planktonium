document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    const gameArea = document.getElementById('gameArea');
    const gameTimerElem = document.getElementById('gameTimer');
    const scoreElem = document.getElementById('score');
    let gameTime = 20;
    let score = 0;
    let interval;

    gameArea.innerHTML = '';
    gameTimerElem.textContent = gameTime;
    scoreElem.textContent = score;

    const gameObjects = [];

    interval = setInterval(() => {
        if (gameTime > 0) {
            gameTime--;
            gameTimerElem.textContent = gameTime;

            const div = document.createElement('div');
            if (Math.random() < 0.05) {
                div.className = 'freeze';
            } else if (Math.random() < 0.05) {
                div.className = 'bomb';
            } else {
                div.className = 'coin';
            }
            div.style.left = Math.random() * 90 + '%';
            div.style.top = 0;
            div.style.position = 'absolute';
            gameArea.appendChild(div);
            gameObjects.push(div);

            gameObjects.forEach((obj, index) => {
                const top = parseInt(obj.style.top);
                if (top < gameArea.clientHeight) {
                    obj.style.top = top + 10 + 'px'; // Увеличенная скорость падения
                } else {
                    gameArea.removeChild(obj);
                    gameObjects.splice(index, 1);
                }
            });
        } else {
            clearInterval(interval);
            endGame(score);
        }
    }, 500); // Увеличенная частота интервала

    gameArea.addEventListener('click', (event) => {
        if (event.target.className === 'coin') {
            score += 1;
            scoreElem.textContent = score;
            gameArea.removeChild(event.target);
        } else if (event.target.className === 'freeze') {
            clearInterval(interval);
            setTimeout(() => {
                interval = setInterval(() => {
                    if (gameTime > 0) {
                        gameTime--;
                        gameTimerElem.textContent = gameTime;

                        gameObjects.forEach((obj, index) => {
                            const top = parseInt(obj.style.top);
                            if (top < gameArea.clientHeight) {
                                obj.style.top = top + 10 + 'px'; // Увеличенная скорость падения
                            } else {
                                gameArea.removeChild(obj);
                                gameObjects.splice(index, 1);
                            }
                        });
                    } else {
                        clearInterval(interval);
                        endGame(score);
                    }
                }, 500); // Увеличенная частота интервала
            }, 2000);
        } else if (event.target.className === 'bomb') {
            score -= 20;
            if (score < 0) score = 0;
            scoreElem.textContent = score;
            gameArea.removeChild(event.target);
        }
    });
}

function endGame(score) {
    let balance = parseInt(localStorage.getItem('balance')) || 0;
    balance += score;
    localStorage.setItem('balance', balance);
    window.location.href = 'index.html'; // Перенаправление на главную страницу после завершения игры
}
