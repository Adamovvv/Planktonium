document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('username')) {
        checkTicketReset();
        showMain();
    } else {
        showRegister();
    }
});

/**
 * Показать форму регистрации
 */
function showRegister() {
    document.getElementById('register').classList.remove('hidden');
    document.getElementById('main').classList.add('hidden');
}

/**
 * Показать основную страницу
 */
function showMain() {
    const username = localStorage.getItem('username');
    const balance = localStorage.getItem('balance') || 0;
    const tickets = localStorage.getItem('tickets') || 3;
    const farmingBalance = localStorage.getItem('farmingBalance') || '0.000';
    const farmingTimer = localStorage.getItem('farmingTimer') || 0;
    const avatarUrl = localStorage.getItem('avatarUrl');

    document.getElementById('displayUsername').textContent = username;
    document.getElementById('balance').textContent = balance;
    document.getElementById('tickets').textContent = tickets;
    document.getElementById('farmingBalance').textContent = farmingBalance;
    document.getElementById('farmingTimer').textContent = formatTime(farmingTimer);

    if (avatarUrl) {
        document.getElementById('avatar').src = avatarUrl;
    }

    document.getElementById('register').classList.add('hidden');
    document.getElementById('main').classList.remove('hidden');

    // Запускаем интервал фарминга при загрузке страницы
    if (farmingTimer > 0) {
        startFarmingInterval();
    }
}

/**
 * Проверить и сбросить билеты в полночь
 */
function checkTicketReset() {
    const lastReset = localStorage.getItem('lastTicketReset');
    const now = new Date();

    if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        localStorage.setItem('tickets', 3);
        localStorage.setItem('lastTicketReset', now.toISOString());
    }
}

/**
 * Зарегистрировать пользователя
 */
async function registerUser() {
    const username = document.getElementById('username').value;
    if (username) {
        const avatarUrl = await fetchTelegramAvatar(username);
        localStorage.setItem('username', username);
        localStorage.setItem('balance', 0);
        localStorage.setItem('tickets', 3);
        localStorage.setItem('farmingBalance', '0.000');
        localStorage.setItem('farmingTimer', 0);
        localStorage.setItem('avatarUrl', avatarUrl);
        showMain();
    }
}

/**
 * Получить URL аватара пользователя из Телеграма
 */
async function fetchTelegramAvatar(username) {
    try {
        const response = await fetch(`https://api.telegram.org/bot7233630925:AAHTt9SvnW4oN1Fwc9_6U0mU9r87CCtuWrs/getUserProfilePhotos?user_id=${username}`);
        const data = await response.json();
        if (data.ok && data.result.photos.length > 0) {
            const photos = data.result.photos[0];
            const photo = photos[photos.length - 1];
            return `https://api.telegram.org/file/bot7233630925:AAHTt9SvnW4oN1Fwc9_6U0mU9r87CCtuWrs/${photo.file_path}`;
        }
    } catch (error) {
        console.error('Error fetching avatar:', error);
    }
    return 'default_avatar_url.png'; // Замените на URL по умолчанию для аватара
}

/**
 * Начать игру
 */
function startGame() {
    let tickets = localStorage.getItem('tickets');
    if (tickets > 0) {
        localStorage.setItem('tickets', tickets - 1);
        window.location.href = 'game.html';
    } else {
        alert('No tickets left. Please wait for ticket regeneration.');
    }
}

/**
 * Начать фарминг
 */
function startFarming() {
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
    if (farmingTimer === 0) { // Начать фарминг, если таймер равен 0
        farmingTimer = 28800; // 8 часов в секундах
        localStorage.setItem('farmingTimer', farmingTimer);
        startFarmingInterval();
    } else {
        alert('Farming in progress. Please wait for the timer to reset.');
    }
}

function startFarmingInterval() {
    const farmingInterval = setInterval(() => {
        let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
        if (farmingTimer > 0) {
            farmingTimer--;
            localStorage.setItem('farmingTimer', farmingTimer);
            document.getElementById('farmingTimer').textContent = formatTime(farmingTimer);
            updateFarmingBalance();
        } else {
            clearInterval(farmingInterval);
            completeFarming();
        }
    }, 1000);
}

/**
 * Обновить баланс фарминга
 */
function updateFarmingBalance() {
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
    let farmingBalance = (57600 * ((28800 - farmingTimer) / 28800)).toFixed(3);
    document.getElementById('farmingBalance').textContent = farmingBalance;
}

/**
 * Форматировать время
 * @param {number} seconds - количество секунд
 * @returns {string} - отформатированное время
 */
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Завершить фарминг и обновить баланс
 */
function completeFarming() {
    let balance = parseInt(localStorage.getItem('balance')) || 0;
    balance += parseFloat(localStorage.getItem('farmingBalance'));
    localStorage.setItem('balance', balance);
    document.getElementById('balance').textContent = balance;
    localStorage.setItem('farmingTimer', 0); // Сбросить таймер до 0
    localStorage.setItem('farmingBalance', '0.000');
}



document.addEventListener('DOMContentLoaded', () => {
    createStars(50); // Генерация 100 звезд
});

function createStars(numStars) {
    const starField = document.getElementById('star-field');

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Случайная начальная позиция звезды
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';

        // Задаем случайные значения для перемещения по X и Y с помощью CSS-переменных
        const randomX = (Math.random() * 200 - 100) + 'vw'; // От -100vw до 100vw
        const randomY = (Math.random() * 200 - 100) + 'vh'; // От -100vh до 100vh
        star.style.setProperty('--random-x', randomX);
        star.style.setProperty('--random-y', randomY);

        // Применение случайной продолжительности и задержки для анимации
        star.style.animationDuration = Math.random() * 30 + 10 + 's'; // Длительность от 10 до 40 секунд
        star.style.animationDelay = Math.random() * 5 + 's'; // Задержка от 0 до 5 секунд

        starField.appendChild(star);
    }
}
