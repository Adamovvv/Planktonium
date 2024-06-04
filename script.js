document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram.WebApp;
    tg.expand();

    const ADMIN_ID = 'your_admin_id';  // Замените на ID администратора

    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('user');

    const mainContainer = document.getElementById('main-container');
    const errorMessage = document.getElementById('error-message');
    const registrationForm = document.getElementById('registration-form');
    const mainContent = document.getElementById('main-content');
    const registerButton = document.getElementById('register-button');
    const usernameInput = document.getElementById('username-input');

    const user = tg.initDataUnsafe.user;

    if (!inviteCode && user?.id !== ADMIN_ID) {
        errorMessage.classList.remove('hidden');
        return;
    }

    if (user && user.id === ADMIN_ID) {
        showMainContent();
        return;
    }

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        showMainContent();
    } else {
        registrationForm.classList.remove('hidden');
    }

    registerButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            const user = { username };
            localStorage.setItem('user', JSON.stringify(user));
            showMainContent();
        } else {
            alert('Please enter a username.');
        }
    });

    function showMainContent() {
        registrationForm.classList.add('hidden');
        mainContent.classList.remove('hidden');

        const user = JSON.parse(localStorage.getItem('user'));
        const userAvatarElem = document.getElementById('user-avatar');
        const usernameElem = document.getElementById('username');
        if (user.username) {
            usernameElem.innerText = user.username;
        }

        let coinCount = parseInt(localStorage.getItem('coinCount')) || 0;
        let attemptsCount = parseInt(localStorage.getItem('attemptsCount')) || 3;
        let lastAttemptUpdate = parseInt(localStorage.getItem('lastAttemptUpdate')) || Date.now();
        let farmingProfit = parseFloat(localStorage.getItem('farmingProfit')) || 0;
        let farmingStartTime = parseInt(localStorage.getItem('farmingStartTime')) || null;
        const FARMING_DURATION = 28800;
        const FARMING_PROFIT = 57.600;
        const FREEZE_DURATION = 3000;
        const ITEM_CREATION_INTERVAL = 300;

        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        let userReferralLink = localStorage.getItem('userReferralLink');
        if (!userReferralLink) {
            userReferralLink = `https://adamovvv.github.io/ArkanCoin/referral?user=${generateRandomString(10)}`;
            localStorage.setItem('userReferralLink', userReferralLink);
        }

        const coinCountElem = document.getElementById('coin-count');
        const attemptsCountElem = document.getElementById('attempts-count');
        const farmingProfitElem = document.getElementById('farming-profit');
        const farmingTimerElem = document.getElementById('farming-timer');
        const playButton = document.getElementById('play-button');
        const farmingButton = document.getElementById('farming-button');
        const gameContainer = document.getElementById('game-container');
        const gameTimerElem = document.getElementById('game-timer');
        const gameArea = document.getElementById('game-area');
        const gameCoinCountElem = document.getElementById('game-coin-count');
        const referralLinkElem = document.getElementById('referral-link');
        const invitedUsersListElem = document.getElementById('invited-users-list');
        const copyLinkButton = document.getElementById('copy-link-button');
        const shareLinkButton = document.getElementById('share-link-button');

        if (coinCountElem) coinCountElem.innerText = coinCount;
        if (attemptsCountElem) attemptsCountElem.innerText = attemptsCount;
        if (referralLinkElem) referralLinkElem.innerText = userReferralLink;

        let gameInterval;
        let itemCreationInterval;
        let isFrozen = false;
        let timeLeft = 20;
        let gameCoinCount = 0;
        let frozenItems = [];

        function updateAttemptsDaily() {
            const currentTime = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;

            if (currentTime - lastAttemptUpdate >= oneDay) {
                attemptsCount += 5;
                lastAttemptUpdate = currentTime;
                localStorage.setItem('attemptsCount', attemptsCount);
                localStorage.setItem('lastAttemptUpdate', lastAttemptUpdate);
                if (attemptsCountElem) attemptsCountElem.innerText = attemptsCount;
            }
        }

        updateAttemptsDaily();

        if (playButton) playButton.addEventListener('click', startGame);
        if (farmingButton) farmingButton.addEventListener('click', startFarming);

        function startGame() {
            if (attemptsCount > 0) {
                attemptsCount--;
                attemptsCountElem.innerText = attemptsCount;
                localStorage.setItem('attemptsCount', attemptsCount);
                mainContainer.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                gameContainer.classList.add('full-screen');
                gameTimerElem.innerText = 20;
                timeLeft = 20;
                gameCoinCount = 0;
                gameCoinCountElem.innerText = gameCoinCount;

                gameInterval = setInterval(() => {
                    if (!isFrozen) {
                        timeLeft--;
                        gameTimerElem.innerText = timeLeft;

                        if (timeLeft <= 0) {
                            clearInterval(gameInterval);
                            clearInterval(itemCreationInterval);
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

                createFallingItems();
            } else {
                alert('No attempts left!');
            }
        }

        function createFallingItems() {
            gameArea.innerHTML = '';

            itemCreationInterval = setInterval(() => {
                if (isFrozen) return;

                for (let i = 0; i < 2; i++) {
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

                    item.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
                    item.style.animationDuration = (Math.random() * 3 + 2) + 's';

                    gameArea.appendChild(item);

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

                    item.addEventListener('animationend', () => {
                        gameArea.removeChild(item);
                    });
                }
            }, ITEM_CREATION_INTERVAL);
        }

        function freezeItems() {
            isFrozen = true;
            clearInterval(itemCreationInterval);

            const items = document.querySelectorAll('.falling-item');
            items.forEach(item => {
                item.classList.add('frozen');
                frozenItems.push({
                    element: item,
                    top: item.style.top,
                    left: item.style.left,
                    animationDuration: item.style.animationDuration
                });
            });

            setTimeout(() => {
                isFrozen = false;
                frozenItems.forEach(itemData => {
                    const item = itemData.element;
                    item.classList.remove('frozen');
                    item.style.top = itemData.top;
                    item.style.left = itemData.left;
                    item.style.animationDuration = itemData.animationDuration;
                    gameArea.appendChild(item);
                });
                frozenItems = [];
                createFallingItems();
            }, FREEZE_DURATION);
        }

        function startFarming() {
            if (!farmingInterval && !farmingStartTime) {
                farmingStartTime = Math.floor(Date.now() / 1000);
                localStorage.setItem('farmingStartTime', farmingStartTime);
                farmingButton.disabled = true;
                updateFarming();
                farmingInterval = setInterval(updateFarming, 1000);
            }
        }

        function updateFarming() {
            const currentTime = Math.floor(Date.now() / 1000);
            const elapsedTime = currentTime - farmingStartTime;

            if (elapsedTime >= FARMING_DURATION) {
                clearInterval(farmingInterval);
                farmingInterval = null;
                farmingStartTime = null;
                farmingProfit = 0;
                coinCount += FARMING_PROFIT;
                localStorage.setItem('coinCount', coinCount);
                localStorage.removeItem('farmingStartTime');
                farmingButton.disabled = false;
                coinCountElem.innerText = coinCount;
                alert(`Farming complete! You earned ${FARMING_PROFIT} arcancoin.`);
            } else {
                farmingProfit = (elapsedTime * FARMING_PROFIT) / FARMING_DURATION;
                farmingProfitElem.innerText = farmingProfit.toFixed(3);

                let remainingTime = FARMING_DURATION - elapsedTime;
                let hours = Math.floor(remainingTime / 3600);
                let minutes = Math.floor((remainingTime % 3600) / 60);
                let seconds = remainingTime % 60;

                farmingTimerElem.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        if (farmingStartTime) {
            farmingButton.disabled = true;
            updateFarming();
            farmingInterval = setInterval(updateFarming, 1000);
        }

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

        if (referralLinkElem) {
            referralLinkElem.innerText = userReferralLink;
        }

        if (invitedUsersListElem) {
            const invitedUsers = ['user1', 'user2', 'user3'];
            invitedUsers.forEach(user => {
                const listItem = document.createElement('li');
                listItem.innerText = user;
                invitedUsersListElem.appendChild(listItem);
            });
        }

        function copyToClipboard(text) {
            const tempInput = document.createElement('input');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('Link copied to clipboard');
        }

        if (copyLinkButton) {
            copyLinkButton.addEventListener('click', () => {
                copyToClipboard(userReferralLink);
            });
        }

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
    }
});
