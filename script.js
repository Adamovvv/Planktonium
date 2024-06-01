let coinCount = 0;
let energy = 500;
let clickValue = 1;
let clickLevel = 1;
let energyLevel = 1;
const maxEnergy = 500;
let lastRestoreTime = 0;

document.getElementById('coin').addEventListener('click', () => {
    if (energy >= 10) {
        coinCount += clickValue;
        energy -= 10;
        document.getElementById('coin-count').textContent = coinCount;
        document.getElementById('energy').textContent = energy;
        updateEnergyBar();
    } else {
        alert('Not enough energy!');
    }
});

document.getElementById('daily-reward').addEventListener('click', () => {
    coinCount += 100; // Example daily reward
    document.getElementById('coin-count').textContent = coinCount;
});

document.getElementById('boost-click').addEventListener('click', () => {
    clickValue += 1; // Example boost
    alert('Click value increased!');
});

document.getElementById('restore-energy').addEventListener('click', () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastRestoreTime >= 3600000) { // 1 hour
        energy = maxEnergy;
        lastRestoreTime = currentTime;
        document.getElementById('energy').textContent = energy;
        updateEnergyBar();
        alert('Energy fully restored!');
    } else {
        alert('You can restore energy once per hour!');
    }
});

document.getElementById('upgrade-click').addEventListener('click', () => {
    const upgradeCost = 500 * Math.pow(2, clickLevel - 1);
    if (coinCount >= upgradeCost) {
        coinCount -= upgradeCost;
        clickLevel += 1;
        clickValue = clickLevel; // Example: click value equals to click level
        document.getElementById('coin-count').textContent = coinCount;
        document.getElementById('click-level').textContent = clickLevel;
        document.getElementById('upgrade-click').textContent = `Upgrade Click (${500 * Math.pow(2, clickLevel - 1)} coins)`;
        alert('Click level upgraded!');
    } else {
        alert('Not enough coins to upgrade click!');
    }
});

document.getElementById('upgrade-energy').addEventListener('click', () => {
    const upgradeCost = 500 * Math.pow(2, energyLevel - 1);
    if (coinCount >= upgradeCost) {
        coinCount -= upgradeCost;
        energyLevel += 1;
        document.getElementById('coin-count').textContent = coinCount;
        document.getElementById('energy-level').textContent = energyLevel;
        document.getElementById('upgrade-energy').textContent = `Upgrade Energy (${500 * Math.pow(2, energyLevel - 1)} coins)`;
        alert('Energy level upgraded!');
    } else {
        alert('Not enough coins to upgrade energy!');
    }
});

function updateEnergyBar() {
    const energyBarInner = document.getElementById('energy-bar-inner');
    const energyPercentage = (energy / maxEnergy) * 100;
    energyBarInner.style.width = energyPercentage + '%';
}

// Инициализация: по умолчанию скрываем все вкладки
document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');

// Инициализация кнопок и значений на странице boosts.html
if (document.getElementById('click-level')) {
    document.getElementById('click-level').textContent = clickLevel;
    document.getElementById('upgrade-click').textContent = `Upgrade Click (${500 * Math.pow(2, clickLevel - 1)} coins)`;
}

if (document.getElementById('energy-level')) {
    document.getElementById('energy-level').textContent = energyLevel;
    document.getElementById('upgrade-energy').textContent = `Upgrade Energy (${500 * Math.pow(2, energyLevel - 1)} coins)`;
}
