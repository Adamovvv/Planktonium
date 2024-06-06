document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('username')) {
        showMain();
    } else {
        showRegister();
    }
});

function showRegister() {
    document.getElementById('register').classList.remove('hidden');
    document.getElementById('main').classList.add('hidden');
}

function showMain() {
    const username = localStorage.getItem('username');
    const balance = localStorage.getItem('balance') || 0;
    const tickets = localStorage.getItem('tickets') || 3;
    const farmingBalance = localStorage.getItem('farmingBalance') || '0.000';
    const farmingTimer = localStorage.getItem('farmingTimer') || 28800; // 8 hours in seconds

    document.getElementById('displayUsername').textContent = username;
    document.getElementById('balance').textContent = balance;
    document.getElementById('tickets').textContent = tickets;
    document.getElementById('farmingBalance').textContent = farmingBalance;
    document.getElementById('farmingTimer').textContent = formatTime(farmingTimer);

    document.getElementById('register').classList.add('hidden');
    document.getElementById('main').classList.remove('hidden');
}

function registerUser() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        localStorage.setItem('balance', 0);
        localStorage.setItem('tickets', 3);
        localStorage.setItem('farmingBalance', '0.000');
        localStorage.setItem('farmingTimer', 28800); // 8 hours in seconds
        showMain();
    }
}

function startGame() {
    let tickets = localStorage.getItem('tickets');
    if (tickets > 0) {
        localStorage.setItem('tickets', tickets - 1);
        window.location.href = 'game.html';
    } else {
        alert('No tickets left. Please wait for ticket regeneration.');
    }
}

function startFarming() {
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
    if (farmingTimer >= 28800) { // 8 hours in seconds
        farmingTimer = 0;
        localStorage.setItem('farmingTimer', farmingTimer);
        localStorage.setItem('farmingBalance', '0.000');
        updateFarmingBalance();
    } else {
        alert('Farming in progress. Please wait for the timer to reset.');
    }
}

function updateFarmingBalance() {
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
    let farmingBalance = (57600 * (farmingTimer / 28800)).toFixed(3);
    document.getElementById('farmingBalance').textContent = farmingBalance;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

setInterval(() => {
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
    if (farmingTimer < 28800) {
        farmingTimer++;
        localStorage.setItem('farmingTimer', farmingTimer);
        document.getElementById('farmingTimer').textContent = formatTime(farmingTimer);
        updateFarmingBalance();
    }
}, 1000);

function completeFarming() {
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
    if (farmingTimer >= 28800) {
        let balance = parseInt(localStorage.getItem('balance')) || 0;
        balance += 57600;
        localStorage.setItem('balance', balance);
        document.getElementById('balance').textContent = balance;
        localStorage.setItem('farmingTimer', 0); // Reset to 0
        localStorage.setItem('farmingBalance', '0.000');
    }
}

// Вызываем completeFarming() в конце setInterval, чтобы завершить фарминг
setInterval(() => {
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
    if (farmingTimer < 28800) {
        farmingTimer++;
        localStorage.setItem('farmingTimer', farmingTimer);
        document.getElementById('farmingTimer').textContent = formatTime(farmingTimer);
        updateFarmingBalance();
    } else {
        completeFarming();
    }
}, 1000);
