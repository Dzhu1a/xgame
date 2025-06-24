/*document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/carts')
        .then(response => response.json())
        .then(data => renderCarts(data))
        .catch(error => console.error('Error fetching data:', error));
});

function renderCarts(carts) {
    const container = document.querySelector('.carts');
    container.innerHTML = ''; // Очистка контейнера перед додаванням карточок

    carts.forEach(cart => {
        const cartElement = document.createElement('div');
        cartElement.className = 'clothes';
        cartElement.dataset.id = cart._id; // Зберігаємо ID картки
        cartElement.dataset.manufacturer = cart.manufacturer;
        cartElement.dataset.type = cart.type;
        cartElement.dataset.size = cart.size;
        cartElement.dataset.color = cart.color;
        cartElement.dataset.material = cart.material;
        cartElement.dataset.season = cart.season;
        cartElement.dataset.gender = cart.gender;

        cartElement.innerHTML = `
            <img src="${cart.img}" alt="clothes" class="clothes-image">
            <h2 class="manufacturer">${cart.manufacturer}</h2>
            <p class="type">${cart.type}</p>
            <p class="size">${cart.size}</p>
            <p class="color">${cart.color}</p>
            <p>${cart.material}</p>
            <p>${cart.season}</p>
            <p>${cart.gender}</p>
            <div class="prays">
                <p class="price">Ціна: ${cart.price}</p>
                <label for="quantity">Кількість:</label>
                <input type="number" min="1" max="50" value="1">
                <button class="buy-button">Купити</button>
            </div>
            <div class="admin-controls">
                <button class="edit-button">Редагувати</button>
                <button class="delete-button"><p>Видалити</p></button>
            </div>
        `;

        container.appendChild(cartElement);
    });

    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            const cartElement = event.target.closest('.clothes');
            const cartItemId = cartElement.dataset.id;
            const quantity = cartElement.querySelector('input[type="number"]').value;
            const login = localStorage.getItem('login');

            if (!login) {
                alert('Ви не ввійшли в акаунт');
                return;
            }

            try {
                const response = await fetch('/add-to-basket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ login, cartItemId, quantity })
                });
                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Помилка:', error);
                alert('Помилка при додаванні товару до корзини');
            }
        });
    });
}*/