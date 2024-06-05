document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById('register-button');
    const usernameInput = document.getElementById('username-input');

    registerButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            const user = { username };
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('firstUserRegistered', true);  // Устанавливаем флаг регистрации первого пользователя
            window.location.href = 'index.html';
        } else {
            alert('Please enter a username.');
        }
    });
});
