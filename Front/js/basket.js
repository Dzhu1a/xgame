document.addEventListener('DOMContentLoaded', async () => {
    const basketButton = document.querySelector('.korz');
    const contact = document.querySelector('.container-contacts');
    const basket = document.querySelector('.container-korz');
    const container = document.querySelector('.container');
    const carouselContainer = document.querySelector('.carousel-container');
    const carts = document.querySelector('.carts');
    const closeButton = document.querySelector('.close-cart');

    basketButton.addEventListener('click', async function () {
        if (localStorage.getItem('isAdmin')) {
            basket.style.display = 'flex';
            carouselContainer.style.display = 'block';
            carts.style.display = 'flex';
            const allCards = document.querySelectorAll('.clothes');
            allCards.forEach(card => {
                card.style.display = 'block';
            });
            await window.loadCartItems();
        } else {
            alert('Ви не ввійшли в акаунт');
        }
    });

    closeButton.addEventListener('click', function () {
        basket.style.display = 'none';
        container.removeAttribute('style');
    });

    window.loadCartItems = async function loadCartItems() {
        const login = localStorage.getItem('login');
        if (!login) {
            console.error('Логін не знайдено в localStorage');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/basket/${login}`);
            if (!response.ok) {
                throw new Error('Відповідь мережі була неправильною');
            }
            const cartModels = await response.json();

            const cartItemsContainer = document.querySelector('.cart-items');
            if (!cartItemsContainer) {
                console.error('Контейнер для елементів кошика не знайдено');
                return;
            }

            cartItemsContainer.innerHTML = '';

            let totalSum = 0;

            cartModels.forEach(cartModel => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.dataset.id = cartModel._id;

                const itemHTML = `
                    <img src="${cartModel.img}" alt="Product Image">
                    <div class="item-details">
                        <h4>${cartModel.manufacturer}</h4>
                        <p>Ціна: $<span class="item-price">${cartModel.price.toFixed(2)}</span></p>
                        <label for="basket">Кількість:</label>
                        <input type="number" min="1" max="50" value="1" class="item-quantity">
                    </div>
                    <button class="remove-item">Видалити</button>
                `;

                itemElement.innerHTML = itemHTML;
                cartItemsContainer.appendChild(itemElement);

                totalSum += cartModel.price;

                const quantityInput = itemElement.querySelector('.item-quantity');
                quantityInput.addEventListener('input', (e) => {
                    let quantity = parseInt(e.target.value);
                    if (quantity < 1) {
                        quantity = 1;
                    } else if (quantity > 50) {
                        quantity = 50;
                    }
                    const itemPriceElement = itemElement.querySelector('.item-price');
                    const itemPrice = cartModel.price * quantity;
                    itemPriceElement.textContent = itemPrice.toFixed(2);
                    updateTotalSum();
                });

                itemElement.querySelector('.remove-item').addEventListener('click', async () => {
                    const cartId = itemElement.dataset.id;
                    const login = localStorage.getItem('login');

                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/api/baskets?cartId=${cartId}&login=${login}`, {
                            method: 'DELETE',
                        });
                        if (!deleteResponse.ok) {
                            throw new Error('Помилка видалення товару');
                        }
                        itemElement.remove();
                        updateTotalSum();
                    } catch (error) {
                        console.error('Помилка видалення:', error);
                    }
                });
            });

            document.getElementById('total-sum').textContent = totalSum.toFixed(2);

            function updateTotalSum() {
                let newTotalSum = 0;
                const allItemPrices = document.querySelectorAll('.item-price');
                allItemPrices.forEach(priceElement => {
                    newTotalSum += parseFloat(priceElement.textContent);
                });
                document.getElementById('total-sum').textContent = newTotalSum.toFixed(2);
            }
        } catch (error) {
            console.error('Помилка отримання:', error);
        }
    };

    document.querySelector('.checkout-button').addEventListener('click', async () => {
        const login = localStorage.getItem('login');
        try {
            const basketResponse = await fetch(`http://localhost:3000/api/basket/${login}`);
            if (!basketResponse.ok) {
                console.error('Помилка отримання даних з корзини');
                return;
            }
            const basketItems = await basketResponse.json();

            if (basketItems.length === 0) {
                alert("Додайте товар до корзини");
                return;
            }
        } catch (error) {
            console.error('Помилка отримання даних з корзини:', error);
            return;
        }

        const userResponse = await fetch(`http://localhost:3000/api/users?login=${login}`);
        if (!userResponse.ok) {
            console.error('Помилка отримання даних користувача');
            return;
        }
        const user = await userResponse.json();

        const requiredFields = ['name', 'email', 'phone', 'city', 'address', 'newPostOffice'];
        const hasAllFields = requiredFields.every(field => user[field]);

        if (hasAllFields) {
            const items = Array.from(document.querySelectorAll('.item-details')).map(item => {
                const name = item.querySelector('h4').innerText;
                const quantity = item.querySelector('.item-quantity').value;
                return { name, quantity };
            });

            const order = {
                login,
                status: 'оформлено',
                date: new Date().toISOString(),
                items,
                totalSum: document.getElementById('total-sum').innerText,
            };

            const orderResponse = await fetch(`http://localhost:3000/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });

            if (!orderResponse.ok) {
                console.error('Помилка оформлення замовлення');
                return;
            }

            const deleteResponse = await fetch(`http://localhost:3000/api/baskets/${login}`, {
                method: 'DELETE'
            });

            if (!deleteResponse.ok) {
                console.error('Помилка видалення даних з корзини');
                return;
            }

            console.log('Замовлення успішно оформлено');
            document.querySelector('.container-korz').style.display = 'none';
        } else {
            const basket = document.querySelector('.container-korz');
            alert("Введіть всі дані");
            document.getElementById('modalWindow').style.display = 'block';
            basket.style.display = 'none';
        }
    });

    document.querySelector('.closeWindow').addEventListener('click', () => {
        document.getElementById('modalWindow').style.display = 'none';
    });

    document.getElementById('edit-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedUser = {
            login: document.getElementById('log').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('telphone').value,
            city: document.getElementById('city').value,
            address: document.getElementById('adres').value,
            newPostOffice: document.getElementById('nov').value,
        };

        try {
            const userResponse = await fetch(`http://localhost:3000/api/users`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });

            if (!userResponse.ok) {
                console.error('Помилка оновлення даних користувача');
                return;
            }

            document.getElementById('modalWindow').style.display = 'none';
            console.log('Дані користувача успішно оновлено');

            const login = localStorage.getItem('login');
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
            console.error('Помилка при оновленні даних користувача:', error);
        }
    });
});