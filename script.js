document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const pages = document.querySelectorAll('.page');
    const navTabs = document.getElementById('nav-tabs');
    const registerBtn = document.getElementById('registerBtn');
    const playBtn = document.getElementById('playBtn');
    const farmingBtn = document.getElementById('farmingBtn');

    let user = {
        username: '',
        balance: 0,
        friends: []
    };

    const showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');

        if (pageId === 'frens') {
            updateFriendsList();
            document.getElementById('referral').textContent = `https://t.me/your_bot?start=${user.username}`;
        }
    };

    const updateFriendsList = () => {
        const friendsList = document.getElementById('friends-list');
        friendsList.innerHTML = '';

        user.friends.forEach(friend => {
            const li = document.createElement('li');
            li.textContent = friend;
            friendsList.appendChild(li);
        });
    };

    const startGame = () => {
        const gameArea = document.getElementById('game-area');
        const timerElement = document.getElementById('game-timer');
        const scoreElement = document.getElementById('game-score');

        let timeLeft = 20;
        let score = 0;

        const updateTimer = () => {
            timerElement.textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                clearInterval(gameInterval);
            }
        };

        const gameInterval = setInterval(updateTimer, 1000);

        gameArea.innerHTML = ''; // Clear game area

        // Game logic for falling elements...
    };

    navTabs.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            showPage(e.target.dataset.page);
        }
    });

    registerBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        if (username) {
            user.username = username;
            document.getElementById('user-name').textContent = username;
            // Get user avatar from Telegram API and set to user-avatar (Mock example)
            document.getElementById('user-avatar').src = `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUserProfilePhotos?user_id=<USER_ID>`;
            showPage('main');
        }
    });

    playBtn.addEventListener('click', startGame);

    farmingBtn.addEventListener('click', () => {
        user.balance += 57600;
        document.getElementById('coin-balance').textContent = user.balance;
    });

    // Initialize the app with the registration page
    showPage('registration');
});
