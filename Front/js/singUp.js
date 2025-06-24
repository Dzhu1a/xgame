document.addEventListener('DOMContentLoaded', function () {

    // За замовчуванням сховати елементи
            document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.delete-button, .edit-button, .add, .order , .admin-controls').forEach(el => el.style.display = 'none');
});

// Функція обробки входу користувача
document.getElementById('signButton').addEventListener('click', async function () {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        const result = await response.json();

        if (response.status === 400) {
            alert(result.error);
        } else {
            localStorage.setItem('login', login);
            localStorage.setItem('isAdmin', result.isAdmin);

            if (result.isAdmin) {
                document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.buy-button ').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.add, .order').forEach(el => el.style.display = 'block');
                document.querySelectorAll('.delete-button, .edit-button ,.admin-controls').forEach(el => el.style.display = 'flex');
            } else {
                document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'block');
                document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'block');
                document.querySelectorAll('.delete-button, .edit-button, .add, .order , .admin-controls').forEach(el => el.style.display = 'none');
            }

            document.querySelector('.signIn').style.display = 'none';
            document.querySelector('.container-autorization').style.display = 'none';
            document.getElementById('login').value = '';
            document.getElementById('password').value = '';
        }
    } catch (error) {
        console.error('Помилка при відправці запиту:', error);
    }
});


document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('login');
    localStorage.removeItem('isAdmin');
    var carts=document.querySelector('.carts');
        carts.style.display = 'flex';
        var allCards = document.querySelectorAll('.clothes');
        allCards.forEach(function(card) {
            card.style.display = 'block';
        });
    var carouselContainer = document.querySelector('.carousel-container');
        var order = document.querySelector('.orders');
        var contact=document.querySelector('.container-contacts');
        const profil = document.querySelector('.profile-container');
        var orders=document.querySelector('.orders-container');
        carouselContainer.style.display = 'block';
        order.style.display = 'none';
        contact.style.display = 'none';
        profil.style.display = 'none';
        orders.style.display = 'none';
    document.getElementById('userMenu').style.display = 'none';
    document.querySelectorAll('.phone, .korz').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.buy-button').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.delete-button, .edit-button, .add, .order , .admin-controls').forEach(el => el.style.display = 'none');
    alert('Ви вийшли з системи');
});

