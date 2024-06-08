document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('username')) {
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
    const tickets = localStorage.getItem('tickets') || 30;
    const farmingBalance = localStorage.getItem('farmingBalance') || '0.000';
    const farmingTimer = localStorage.getItem('farmingTimer') || 0;

    document.getElementById('displayUsername').textContent = username;
    document.getElementById('balance').textContent = balance;
    document.getElementById('tickets').textContent = tickets;
    document.getElementById('farmingBalance').textContent = farmingBalance;
    document.getElementById('farmingTimer').textContent = formatTime(farmingTimer);

    document.getElementById('register').classList.add('hidden');
    document.getElementById('main').classList.remove('hidden');

    // Запускаем интервал фарминга при загрузке страницы
    if (farmingTimer > 0) {
        startFarmingInterval();
    }
}

/**
 * Зарегистрировать пользователя
 */
function registerUser() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        localStorage.setItem('balance', 0);
        localStorage.setItem('tickets', 30);
        localStorage.setItem('farmingBalance', '0.000');
        localStorage.setItem('farmingTimer', 0);
        showMain();
    }
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
