document.addEventListener('DOMContentLoaded', function () {
    const orderButton = document.querySelector('.order');
    const orderContainer = document.querySelector('.orders');
    const profileContainer = document.querySelector('.profile-container');
    const carouselContainer = document.querySelector('.carousel-container');
    const cartsContainer = document.querySelector('.carts');

    // Функція для отримання замовлень
    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders/all');
            if (!response.ok) throw new Error('Помилка мережі');
            const orders = await response.json();
            console.log('Отримані замовлення:', orders);
            return orders;
        } catch (error) {
            console.error('Помилка отримання замовлень:', error);
        }
    }

    // Функція для отримання даних користувача
    async function fetchUserData(login) {
        try {
            const response = await fetch(`/api/users/login/${login}`);
            if (!response.ok) throw new Error('Помилка отримання даних про користувача');
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Помилка отримання даних про користувача:', error);
            return null;
        }
    }

    // Функція для рендерингу замовлень
    window.renderOrders = async function renderOrders() {
        const orders = await fetchOrders();
        if (!orders) return;

        orderContainer.innerHTML = '';

        function sortOrders(orders) {
            const statusOrder = {
                "оформлено": 1,
                "Підтверджено": 2,
                "Очікує на відправлення": 3,
                "Виконано": 4,
                "Відхилено": 5
            };
            return orders.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        }

        const sortedOrders = sortOrders(orders);

        async function createOrderCard(order) {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';

            try {
                const userData = await fetchUserData(order.login);
                if (!userData) throw new Error('Дані про користувача недоступні');

                orderCard.innerHTML = `
                    <h2>Замовлення # ${order._id}</h2>
                    <div class="order-info">
                        <p><strong>Логін:</strong> ${order.login}</p>
                        <p><strong>Ім'я клієнта:</strong> ${userData.name}</p>
                        <p><strong>Телефон:</strong> ${userData.phone}</p>
                        <p><strong>Email:</strong> ${userData.email}</p>
                        <p><strong>Адреса доставки:</strong> ${userData.city}, ${userData.address}</p>
                        <p><strong>Нова пошта:</strong> ${userData.newPostOffice}</p>
                        <p><strong>Дата замовлення:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Статус:</strong> <span class="status">${order.status}</span></p>
                    </div>
                    <div class="order-items">
                        <h3>Товари</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Назва</th>
                                    <th>Кількість</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <p><strong>Загальна сума:</strong> $${order.totalSum}</p>
                    </div>
                    <div class="order-actions">
                        <button class="edit">Редагувати статус</button>
                        <select class="delete" name="type" id="type">
                            <option value="" disabled selected>Введіть статус</option>
                            <option value="Підтверджено">Підтверджено</option>
                            <option value="Очікує на відправлення">Очікує на відправлення</option>
                            <option value="Виконано">Виконано</option>
                            <option value="Відхилено">Відхилено</option>
                        </select>
                    </div>
                `;

                orderCard.querySelector('.edit').addEventListener('click', async function () {
                    const newStatus = orderCard.querySelector('.delete').value;

                    if (!newStatus) {
                        alert('Виберіть новий статус');
                        return;
                    }

                    try {
                        const response = await fetch(`/api/orders/${order._id}/status`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ status: newStatus })
                        });

                        if (!response.ok) {
                            throw new Error('Помилка оновлення статусу');
                        }

                        const updatedOrder = await response.json();
                        orderCard.querySelector('.status').textContent = updatedOrder.order.status;
                        console.log('Статус оновлено:', updatedOrder);
                    } catch (error) {
                        console.error('Помилка оновлення статусу:', error);
                    }
                });

                return orderCard;

            } catch (error) {
                console.error('Помилка створення картки замовлення:', error);
                return null;
            }
        }

        await Promise.all(sortedOrders.map(async order => {
            const orderCard = await createOrderCard(order);
            if (orderCard) {
                orderContainer.appendChild(orderCard);
                console.log('Картка замовлення створена:', orderCard);
            }
        }));
    };

    orderButton.addEventListener('click', async function () {
        orderContainer.style.display = 'flex';
        carouselContainer.style.display = 'none';
        cartsContainer.style.display = 'none';
        profileContainer.style.display = 'none';
        await renderOrders();
    });
});