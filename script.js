document.addEventListener("DOMContentLoaded", () => {
    // Инициализация переменных
    let coinCount = parseInt(localStorage.getItem('coinCount')) || 0; // Количество монет
    let attemptsCount = parseInt(localStorage.getItem('attemptsCount')) || 3; // Количество попыток
    let lastAttemptUpdate = parseInt(localStorage.getItem('lastAttemptUpdate')) || Date.now(); // Время последнего обновления попыток
    let farmingProfit = parseFloat(localStorage.getItem('farmingProfit')) || 0; // Прибыль от фарминга
    let farmingStartTime = parseInt(localStorage.getItem('farmingStartTime')) || null; // Время начала фарминга
    const FARMING_DURATION = 43200; // 12 часов в секундах
    const FREEZE_DURATION = 3000; // 3 секунды

    // Функция для генерации случайной строки
    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Получение уникальной ссылки пользователя из localStorage или генерация новой
    let userReferralLink = localStorage.getItem('userReferralLink');
    if (!userReferralLink) {
        userReferralLink = `https://example.com/referral?user=${generateRandomString(10)}`;
        localStorage.setItem('userReferralLink', userReferralLink);
    }

    // Элементы DOM
    const coinCountElem = document.getElementById('coin-count');
    const attemptsCountElem = document.getElementById('attempts-count');
    const farmingProfitElem = document.getElementById('farming-profit');
    const farmingTimerElem = document.getElementById('farming-timer');
    const playButton = document.getElementById('play-button');
    const farmingButton = document.getElementById('farming-button');
    const mainContainer = document.getElementById('main-container');
    const gameContainer = document.getElementById('game-container');
    const gameTimerElem = document.getElementById('game-timer');
    const gameArea = document.getElementById('game-area');
    const gameCoinCountElem = document.getElementById('game-coin-count');
    const referralLinkElem = document.getElementById('referral-link');
    const invitedUsersListElem = document.getElementById('invited-users-list');
    const copyLinkButton = document.getElementById('copy-link-button');
    const shareLinkButton = document.getElementById('share-link-button');

    // Установка начальных значений в DOM
    if (coinCountElem) coinCountElem.innerText = coinCount;
    if (attemptsCountElem) attemptsCountElem.innerText = attemptsCount;
    if (referralLinkElem) referralLinkElem.innerText = userReferralLink;

    let gameInterval; // Интервал игры
    let farmingInterval; // Интервал фарминга
    let itemIntervals = []; // Массив для хранения интервалов движения элементов
    let itemCreationInterval; // Интервал создания новых элементов
    let isFrozen = false; // Флаг состояния заморозки
    let timeLeft = 20; // Оставшееся время игры
    let gameCoinCount = 0; // Монеты, заработанные в игре

    // Функция для обновления попыток ежедневно
    function updateAttemptsDaily() {
        const currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // Один день в миллисекундах

        if (currentTime - lastAttemptUpdate >= oneDay) {
            attemptsCount += 5;
            lastAttemptUpdate = currentTime;
            localStorage.setItem('attemptsCount', attemptsCount);
            localStorage.setItem('lastAttemptUpdate', lastAttemptUpdate);
            if (attemptsCountElem) attemptsCountElem.innerText = attemptsCount;
        }
    }

    // Обновляем попытки ежедневно при загрузке страницы
    updateAttemptsDaily();

    // Обработчик нажатия кнопки "Play"
    if (playButton) playButton.addEventListener('click', startGame);
    // Обработчик нажатия кнопки "Farming"
    if (farmingButton) farmingButton.addEventListener('click', startFarming);

    // Функция начала игры
    function startGame() {
        if (attemptsCount > 0) {
            attemptsCount--;
            attemptsCountElem.innerText = attemptsCount;
            localStorage.setItem('attemptsCount', attemptsCount);
            mainContainer.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            gameContainer.classList.add('full-screen');
            gameTimerElem.innerText = 20;
            timeLeft = 2000;
            gameCoinCount = 0;
            gameCoinCountElem.innerText = gameCoinCount;

            gameInterval = setInterval(() => {
                if (!isFrozen) {
                    timeLeft--;
                    gameTimerElem.innerText = timeLeft;

                    if (timeLeft <= 0) {
                        clearInterval(gameInterval);
                        mainContainer.classList.remove('hidden');
                        gameContainer.classList.add('hidden');
                        gameContainer.classList.remove('full-screen');
                        coinCount += gameCoinCount;
                        coinCountElem.innerText = coinCount;
                        localStorage.setItem('coinCount', coinCount);
                        alert(`Game Over! You collected ${gameCoinCount} coins.`);
                    }
                }
            }, 1000);

            // Создание падающих элементов
            createFallingItems();
        } else {
            alert('No attempts left!');
        }
    }

    // Функция создания падающих элементов
    function createFallingItems() {
        gameArea.innerHTML = ''; // Очистить предыдущие элементы

        itemCreationInterval = setInterval(() => {
            if (isFrozen) return;

            let item = document.createElement('div');
            item.classList.add('falling-item');

            let itemType = Math.random();
            if (itemType < 0.8) {
                item.classList.add('coin');
            } else if (itemType < 0.9) {
                item.classList.add('bomb');
            } else {
                item.classList.add('freeze');
            }

            item.style.left = Math.random() * (gameArea.offsetWidth - 30) + 'px';
            item.style.top = '0px';
            gameArea.appendChild(item);

            let fallInterval = setInterval(() => {
                if (isFrozen) return;

                let top = parseInt(item.style.top || 0);
                top += 5;
                item.style.top = top + 'px';

                if (top >= gameArea.offsetHeight - 30) {
                    clearInterval(fallInterval);
                    gameArea.removeChild(item);
                }
            }, 50);

            itemIntervals.push({ element: item, interval: fallInterval });

            item.addEventListener('click', () => {
                if (item.classList.contains('coin')) {
                    gameCoinCount++;
                    gameCoinCountElem.innerText = gameCoinCount;
                } else if (item.classList.contains('bomb')) {
                    gameCoinCount = 0;
                    gameCoinCountElem.innerText = gameCoinCount;
                    alert('Boom! You lost all coins collected in this game.');
                } else if (item.classList.contains('freeze')) {
                    freezeItems();
                }
                gameArea.removeChild(item);
            });
        }, 500);
    }

    // Функция заморозки элементов
    function freezeItems() {
        isFrozen = true;
        clearInterval(itemCreationInterval);
        itemIntervals.forEach(({ interval }) => clearInterval(interval));

        setTimeout(() => {
            isFrozen = false;
            // Возобновление движения элементов
            const newIntervals = [];
            itemIntervals.forEach(({ element }) => {
                let fallInterval = setInterval(() => {
                    if (isFrozen) return;

                    let top = parseInt(element.style.top || 0);
                    top += 5;
                    element.style.top = top + 'px';

                    if (top >= gameArea.offsetHeight - 30) {
                        clearInterval(fallInterval);
                        gameArea.removeChild(element);
                    }
                }, 50);

                newIntervals.push({ element, interval: fallInterval });
            });
            itemIntervals = newIntervals;

            // Продолжение создания новых падающих элементов
            createFallingItems();
        }, FREEZE_DURATION);
    }

    // Функция начала фарминга
    function startFarming() {
        if (!farmingInterval && !farmingStartTime) {
            farmingStartTime = Math.floor(Date.now() / 1000);
            localStorage.setItem('farmingStartTime', farmingStartTime);
            farmingButton.disabled = true;
            updateFarming();
            farmingInterval = setInterval(updateFarming, 1000);
        }
    }

    // Функция обновления фарминга
    function updateFarming() {
        const currentTime = Math.floor(Date.now() / 1000);
        const elapsedTime = currentTime - farmingStartTime;

        if (elapsedTime >= FARMING_DURATION) {
            clearInterval(farmingInterval);
            farmingInterval = null;
            farmingStartTime = null;
            farmingProfit = 0;
            coinCount += 0.120;
            localStorage.setItem('coinCount', coinCount);
            localStorage.removeItem('farmingStartTime');
            farmingButton.disabled = false;
            coinCountElem.innerText = coinCount;
            alert('Farming complete! You earned 0.120 arcancoin.');
        } else {
            farmingProfit = (elapsedTime * 0.120) / FARMING_DURATION;
            farmingProfitElem.innerText = farmingProfit.toFixed(3);

            let remainingTime = FARMING_DURATION - elapsedTime;
            let hours = Math.floor(remainingTime / 3600);
            let minutes = Math.floor((remainingTime % 3600) / 60);
            let seconds = remainingTime % 60;

            farmingTimerElem.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Инициализация фарминга при загрузке страницы
    if (farmingStartTime) {
        farmingButton.disabled = true;
        updateFarming();
        farmingInterval = setInterval(updateFarming, 1000);
    }

    // Обработчик задач
    const taskButtons = document.querySelectorAll('.task-button');
    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reward = parseInt(button.getAttribute('data-reward'));
            coinCount += reward;
            localStorage.setItem('coinCount', coinCount);
            coinCountElem.innerText = coinCount;
            alert(`You earned ${reward} coins!`);
        });
    });

    // Обработчик для вкладки "Frens"
    if (referralLinkElem) {
        referralLinkElem.innerText = userReferralLink;
    }

    if (invitedUsersListElem) {
        // Пример приглашенных пользователей
        const invitedUsers = ['user1', 'user2', 'user3'];
        invitedUsers.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerText = user;
            invitedUsersListElem.appendChild(listItem);
        });
    }

    // Функция для копирования ссылки
    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Link copied to clipboard');
    }

    // Обработчик нажатия кнопки "Copy Link"
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', () => {
            copyToClipboard(userReferralLink);
        });
    }

    // Обработчик нажатия кнопки "Share Link"
    if (shareLinkButton) {
        shareLinkButton.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'Join the Arcancoin Game!',
                    text: 'Check out this amazing game and earn rewards!',
                    url: userReferralLink
                }).catch(error => {
                    console.error('Error sharing:', error);
                });
            } else {
                alert('Sharing not supported on this browser');
            }
        });
    }
});
