document.addEventListener('DOMContentLoaded', async () => {
    const settingsButton = document.querySelector('.settings button');
    const profileContainer = document.querySelector('.profile-container');
    const editButton = document.getElementById('button-edit');
    const modalWindow = document.getElementById('modalWindow');
    const closeWindow = document.querySelector('.closeWindow');
    const editForm = document.getElementById('edit-form');
    var contact=document.querySelector('.container-contacts');
    var orders=document.querySelector('.orders-container');

    let userData = {}; // Змінна, в яку буде зберігатися об'єкт користувача

    settingsButton.addEventListener('click', async () => {
        contact.style.display = 'none';
        orders.style.display = 'none';
        const login = localStorage.getItem('login');

        // Виконуємо запит до сервера для отримання даних користувача за логіном
        try {
            const response = await fetch(`/api/users?login=${login}`);
            if (!response.ok) {
                console.error('Помилка отримання даних користувача');
                return;
            }

            userData = await response.json(); // Зберігаємо дані користувача у змінній userData
            if (!userData) {
                console.error('Користувача не знайдено');
                return;
            }

            // Заповнюємо дані користувача в HTML
            document.getElementById('user-login').textContent = userData.login || '';
            document.getElementById('user-name').textContent = userData.name || '';
            document.getElementById('user-email').textContent = userData.email || '';
            document.getElementById('user-telphone').textContent = userData.phone || '';
            document.getElementById('user-city').textContent = userData.city || '';
            document.getElementById('user-adress').textContent = userData.address || '';
            document.getElementById('nova').textContent = userData.newPostOffice || '';

            // Показуємо профіль користувача
            profileContainer.style.display = 'block';
        } catch (error) {
            console.error('Помилка отримання даних користувача:', error);
        }
    });

    // Обробник для кнопки "Редагувати"
    editButton.addEventListener('click', async () => {
        const login = localStorage.getItem('login');

        try {
            const response = await fetch(`/api/users?login=${login}`);
            if (!response.ok) {
                console.error('Помилка отримання даних користувача');
                return;
            }

            const userData = await response.json();
            if (!userData) {
                console.error('Користувача не знайдено');
                return;
            }

            // Заповнюємо дані користувача в форму редагування
            document.getElementById('log').value = userData.login || '';
            document.getElementById('name').value = userData.name || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('telphone').value = userData.phone || '';
            document.getElementById('city').value = userData.city || '';
            document.getElementById('adres').value = userData.address || '';
            document.getElementById('nov').value = userData.newPostOffice || '';

            // Показуємо модальне вікно редагування
            modalWindow.style.display = 'block';
        } catch (error) {
            console.error('Помилка отримання даних користувача:', error);
        }
    });

    // Обробник для закриття модального вікна
    closeWindow.addEventListener('click', () => {
        modalWindow.style.display = 'none';
    });

    // Обробник для збереження змін у профілі користувача
    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            login: document.getElementById('log').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('telphone').value,
            city: document.getElementById('city').value,
            address: document.getElementById('adres').value,
            newPostOffice: document.getElementById('nov').value
        };

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                console.error('Помилка при збереженні даних');
                return;
            }

            // Успішно збережено дані, можна закрити модальне вікно
            modalWindow.style.display = 'none';
            // Опціонально оновити дані на сторінці, якщо потрібно

        } catch (error) {
            console.error('Помилка при збереженні даних:', error);
        }
    });
});
