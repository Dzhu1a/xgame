document.addEventListener('DOMContentLoaded', () => {
    const autorizationDiv = document.querySelector('.autorization');
    const autorizDiv = document.querySelector('.autoriz');
    const signInDiv = document.querySelector('.signIn');
    const logInDiv = document.querySelector('.logIn');
    const signInButton = document.querySelector('#signInButton button');
    const logInButton = document.querySelector('#logInButton button');
    const buttonCloseElements = document.querySelectorAll('.buttonClose');
    const showLogInFromSignInButton = document.querySelector('#showLogInFromSignIn');
    const showSignInFromLogInButton = document.querySelector('#showSignInFromLogIn');
    const settings = document.querySelector('.settings button');
    const profil = document.querySelector('.profile-container');
    const carousel = document.querySelector('.carousel-container');
    const carts = document.querySelector('.carts');
    const paramentry = document.querySelector('.paramentry');
    const order = document.querySelector('.orders');
    const logoutButton = document.querySelector('#logoutButton');
    const containerContacts = document.querySelector('.container-contacts');
    const containerKorz = document.querySelector('.container-korz');
    const editModal = document.querySelector('#editModal');

  function savePageState() {
    const pageState = {
      carousel: carousel.style.display,
      carts: carts.style.display,
      profil: profil.style.display,
      order: order.style.display,
      paramentry: paramentry.style.display,
      autoriz: autorizDiv.style.display,
      signIn: signInDiv.style.display,
      logIn: logInDiv.style.display,
      containerContacts: containerContacts ? containerContacts.style.display : 'none',
      containerKorz: containerKorz ? containerKorz.style.display : 'none',
      editModal: editModal ? editModal.style.display : 'none',
      buttons: {
        phone: document.querySelector('.phone') ? document.querySelector('.phone').style.display : 'block',
        korz: document.querySelector('.korz') ? document.querySelector('.korz').style.display : 'block',
        buyButton: document.querySelector('.buy-button') ? document.querySelector('.buy-button').style.display : 'block',
        deleteButton: document.querySelector('.delete-button') ? document.querySelector('.delete-button').style.display : 'none',
        editButton: document.querySelector('.edit-button') ? document.querySelector('.edit-button').style.display : 'none',
        add: document.querySelector('.add') ? document.querySelector('.add').style.display : 'none',
        orderButton: document.querySelector('.order') ? document.querySelector('.order').style.display : 'none',
        adminControls: document.querySelector('.admin-controls') ? document.querySelector('.admin-controls').style.display : 'none',
        myOrder: document.getElementById('myOrder') ? document.getElementById('myOrder').style.display : 'block'
      }
    };
    localStorage.setItem('pageState', JSON.stringify(pageState));
    console.log('Збережений стан сторінки:', pageState);
  }
    // Функція для перевірки, чи всі основні елементи в pageState мають display: none
    function isPageStateAllNone(pageState) {
        const mainElements = { ...pageState };
        delete mainElements.buttons;
        delete mainElements.containerContacts;
        delete mainElements.containerKorz;
        delete mainElements.editModal;

        const allMainElementsNone = Object.values(mainElements).every(value => value === 'none');
        const isContactsOpen = pageState.containerContacts === 'block';

        return allMainElementsNone && !isContactsOpen;
    }

    // Функція для встановлення значень за замовчуванням (головна сторінка)
    function setDefaultPageState() {
        const defaultState = {
            carousel: 'block',
            carts: 'flex',
            profil: 'none',
            order: 'none',
            paramentry: 'none',
            autoriz: 'none',
            signIn: 'none',
            logIn: 'none',
            containerContacts: 'none',
            containerKorz: 'none',
            editModal: 'none',
            buttons: {
                phone: 'block',
                korz: 'block',
                buyButton: 'block',
                deleteButton: 'none',
                editButton: 'none',
                add: 'none',
                orderButton: 'none',
                adminControls: 'none',
                myOrder: 'block'
            }
        };
        localStorage.setItem('pageState', JSON.stringify(defaultState));
        console.log('Встановлено стан за замовчуванням:', defaultState);
        return defaultState;
    }

    // У функції restorePageState в autoruzation.js
function restorePageState() {
    let savedState = localStorage.getItem('pageState');
    let pageState;
  
    if (savedState) {
      pageState = JSON.parse(savedState);
      if (isPageStateAllNone(pageState)) {
        pageState = setDefaultPageState();
      }
    } else {
      pageState = setDefaultPageState();
    }
    carousel.style.display = pageState.carousel || 'block';
    carts.style.display = pageState.carts || 'flex';
    profil.style.display = pageState.profil || 'none';
    order.style.display = pageState.order || 'none';
    paramentry.style.display = pageState.paramentry || 'none';
    autorizDiv.style.display = pageState.autoriz || 'none';
    signInDiv.style.display = pageState.signIn || 'none';
    logInDiv.style.display = pageState.logIn || 'none';
    if (containerContacts) containerContacts.style.display = pageState.containerContacts || 'none';
    if (containerKorz) containerKorz.style.display = pageState.containerKorz || 'none';
    if (editModal) editModal.style.display = pageState.editModal || 'none';
    if (pageState.buttons) {
      document.querySelectorAll('.phone').forEach(el => el.style.display = pageState.buttons.phone || 'block');
      document.querySelectorAll('.korz').forEach(el => el.style.display = pageState.buttons.korz || 'block');
      document.querySelectorAll('.buy-button').forEach(el => el.style.display = pageState.buttons.buyButton || 'block');
      document.querySelectorAll('.delete-button').forEach(el => el.style.display = pageState.buttons.deleteButton || 'none');
      document.querySelectorAll('.edit-button').forEach(el => el.style.display = pageState.buttons.editButton || 'none');
      document.querySelectorAll('.add').forEach(el => el.style.display = pageState.buttons.add || 'none');
      document.querySelectorAll('.order').forEach(el => el.style.display = pageState.buttons.orderButton || 'none');
      document.querySelectorAll('.admin-controls').forEach(el => el.style.display = pageState.buttons.adminControls || 'none');
      if (document.getElementById('myOrder')) {
        document.getElementById('myOrder').style.display = pageState.buttons.myOrder || 'block';
      }
    }
  
    console.log('Відновлений стан сторінки:', pageState);
    return pageState;
  }

    // Функція для завантаження даних профілю
    async function loadProfileData() {
        const login = localStorage.getItem('login');
        if (!login) {
            console.error('Логін не знайдено в localStorage');
            return;
        }

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

            document.getElementById('user-login').textContent = userData.login || '';
            document.getElementById('user-name').textContent = userData.name || '';
            document.getElementById('user-email').textContent = userData.email || '';
            document.getElementById('user-telphone').textContent = userData.phone || '';
            document.getElementById('user-city').textContent = userData.city || '';
            document.getElementById('user-adress').textContent = userData.address || '';
            document.getElementById('nova').textContent = userData.newPostOffice || '';
        } catch (error) {
            console.error('Помилка завантаження даних профілю:', error);
        }
    }

    // Відновлення стану сторінки та завантаження даних
    const initialPageState = restorePageState();

    // Завантажуємо дані, якщо відповідні секції видимі
    if (initialPageState.order === 'flex') {
        // Викликаємо функцію з order.js для завантаження замовлень
        if (typeof renderOrders === 'function') {
            renderOrders();
        }
    }

    if (initialPageState.containerKorz === 'flex') {
        // Викликаємо функцію з basket.js для завантаження корзини
        if (typeof loadCartItems === 'function') {
            loadCartItems();
        }
    }

    if (initialPageState.profil === 'block') {
        // Завантажуємо дані профілю
        loadProfileData();
    }

    // Асинхронна перевірка авторизації після відображення сторінки
    const checkAuthorization = async () => {
        const login = localStorage.getItem('login');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        console.log('Перевірка авторизації. Логін:', login, 'isAdmin:', isAdmin);

        if (login) {
            try {
                const response = await fetch('/api/check-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ login })
                });

                const result = await response.json();
                console.log('Відповідь сервера на /api/check-user:', result);

                if (result.success) {
                    const shouldShowParamentry = initialPageState.paramentry === 'block' || 
                        (initialPageState.carousel === 'block' && initialPageState.carts === 'flex' && 
                         initialPageState.profil === 'none' && initialPageState.order === 'none' && 
                         initialPageState.containerContacts === 'none');

                    if (shouldShowParamentry) {
                        paramentry.style.display = 'block';
                    }

                    if (isAdmin) {
                        document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'none');
                        document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'none');
                        document.querySelectorAll('.delete-button, .edit-button, .add, .order, .admin-controls').forEach(el => el.style.display = 'flex');
                        if (document.getElementById('myOrder')) {
                            document.getElementById('myOrder').style.display = 'none';
                        }
                    } else {
                        document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'block');
                        document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'block');
                        document.querySelectorAll('.delete-button, .edit-button, .add, .order, .admin-controls').forEach(el => el.style.display = 'none');
                        if (document.getElementById('myOrder')) {
                            document.getElementById('myOrder').style.display = 'block';
                        }
                    }
                    savePageState();
                } else {
                    console.warn('Користувача не знайдено на сервері:', result.message);
                    alert('Користувача не знайдено. Будь ласка, увійдіть знову.');
                }
            } catch (error) {
                console.error('Помилка перевірки користувача:', error);
                alert('Помилка перевірки авторизації. Дані збережено, але перевірте підключення до сервера.');
            }
        }
    };

    setTimeout(checkAuthorization, 0);

    autorizationDiv.addEventListener('click', (event) => {
        const currentLogin = localStorage.getItem('login');
        const currentIsAdmin = localStorage.getItem('isAdmin') === 'true';
        console.log('Клік на авторизацію. Логін:', currentLogin, 'isAdmin:', currentIsAdmin);
        document.querySelectorAll('.container-autorization').forEach(el => el.style.display = 'block');
        if (currentLogin) {
            paramentry.style.display = 'block';
            if (currentIsAdmin) {
                document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.delete-button, .edit-button, .add, .order, .admin-controls').forEach(el => el.style.display = 'flex');
                if (document.getElementById('myOrder')) {
                    document.getElementById('myOrder').style.display = 'none';
                }
            } else {
                document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'block');
                document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'block');
                document.querySelectorAll('.delete-button, .edit-button, .add, .order, .admin-controls').forEach(el => el.style.display = 'none');
                if (document.getElementById('myOrder')) {
                    document.getElementById('myOrder').style.display = 'block';
                }
            }
        } else {
            autorizDiv.style.display = 'block';
        }
        event.stopPropagation();
        savePageState();
    });

    document.addEventListener('click', (event) => {
        if (!autorizDiv.contains(event.target)) {
            autorizDiv.style.display = 'none';
            paramentry.style.display = 'none';
            savePageState();
        }
    });

    signInButton.addEventListener('click', () => {
        signInDiv.style.display = 'block';
        logInDiv.style.display = 'none';
        autorizDiv.style.display = 'none';
        savePageState();
    });

    logInButton.addEventListener('click', () => {
        logInDiv.style.display = 'block';
        signInDiv.style.display = 'none';
        autorizDiv.style.display = 'none';
        savePageState();
    });

    showLogInFromSignInButton.addEventListener('click', () => {
        logInDiv.style.display = 'block';
        signInDiv.style.display = 'none';
        savePageState();
    });

    showSignInFromLogInButton.addEventListener('click', () => {
        signInDiv.style.display = 'block';
        logInDiv.style.display = 'none';
        savePageState();
    });

    buttonCloseElements.forEach(buttonClose => {
        buttonClose.addEventListener('click', () => {
            const parentDiv = buttonClose.closest('.signIn, .logIn');
            if (parentDiv) {
                parentDiv.style.display = 'none';
                savePageState();
            }
        });
    });

    settings.addEventListener('click', function () {
        profil.style.display = 'block';
        paramentry.style.display = 'none';
        carousel.style.display = 'none';
        carts.style.display = 'none';
        order.style.display = 'none';
        savePageState();
        loadProfileData(); // Завантажуємо дані профілю при кліку
    });

    const registrationForm = document.getElementById('registrationForm');
    const loginInput = document.getElementById('loginn');
    const passwordInput = document.getElementById('passwordd');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        loginError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';

        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!login) {
            loginError.textContent = 'Заповніть це поле';
        }
        if (!password) {
            passwordError.textContent = 'Заповніть це поле';
        }
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Заповніть це поле';
        }
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Паролі не співпадають';
        }
        if (loginError.textContent || passwordError.textContent || confirmPasswordError.textContent) {
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password, confirmPassword })
            });

            const result = await response.json();
            console.log('Відповідь сервера на /register:', result);

            if (result.error) {
                alert(result.error);
            } else {
                alert('Реєстрація пройшла успішно');
                localStorage.setItem('login', login);
                localStorage.setItem('isAdmin', false);
                console.log('Дані авторизації збережено в localStorage:', { login, isAdmin: false });
                registrationForm.reset();
                logInDiv.style.display = 'none';
                paramentry.style.display = 'block';
                document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'block');
                document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'block');
                document.querySelectorAll('.delete-button, .edit-button, .add, .order, .admin-controls').forEach(el => el.style.display = 'none');
                if (document.getElementById('myOrder')) {
                    document.getElementById('myOrder').style.display = 'block';
                }
                savePageState();
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка під час реєстрації');
        }
    });

    const signInForm = document.querySelector('.signIn');
    const signInLoginInput = document.getElementById('login');
    const signInPasswordInput = document.getElementById('password');
    const signButton = document.getElementById('signButton');

    signButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const login = signInLoginInput.value.trim();
        const password = signInPasswordInput.value.trim();

        if (!login || !password) {
            alert('Заповніть усі поля');
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });

            const result = await response.json();
            console.log('Відповідь сервера на /login:', result);

            if (result.error) {
                alert(result.error);
            } else {
                alert('Вхід успішний');
                localStorage.setItem('login', login);
                localStorage.setItem('isAdmin', result.isAdmin || false);
                console.log('Дані авторизації збережено в localStorage:', { login, isAdmin: result.isAdmin || false });
                signInDiv.style.display = 'none';
                paramentry.style.display = 'block';
                if (result.isAdmin) {
                    document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'none');
                    document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'none');
                    document.querySelectorAll('.delete-button, .edit-button, .add, .order, .admin-controls').forEach(el => el.style.display = 'flex');
                    if (document.getElementById('myOrder')) {
                        document.getElementById('myOrder').style.display = 'none';
                    }
                } else {
                    document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'block');
                    document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'block');
                    document.querySelectorAll('.delete-button, .edit-button, .add, .order, .admin-controls').forEach(el => el.style.display = 'none');
                    if (document.getElementById('myOrder')) {
                        document.getElementById('myOrder').style.display = 'block';
                    }
                }
                savePageState();
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка під час входу');
        }
    });

    logoutButton.addEventListener('click', () => {
        console.log('Натиснуто кнопку "Вихід". Очищення localStorage.');
        localStorage.removeItem('login');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('pageState');
        location.reload();
    });
});