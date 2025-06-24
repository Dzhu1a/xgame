document.addEventListener('DOMContentLoaded', () => {
    var myOrder = document.querySelector('.myOrder button');
    var orders = document.querySelector('.orders-container');
    var carousel = document.querySelector('.carousel-container');
    var carts = document.querySelector('.carts');
    var paramentry = document.querySelector('.paramentry');

    myOrder.addEventListener('click', async () => {
        var contact = document.querySelector('.container-contacts');
        const profil = document.querySelector('.profile-container');
        orders.style.display = 'block';
        paramentry.style.display = 'none';
        carousel.style.display = 'none';
        carts.style.display = 'none';
        contact.style.display = 'none';
        profil.style.display = 'none';

        const ordersList = document.getElementById("orders-list");
        const userLogin = localStorage.getItem("login");

        if (!userLogin) {
            ordersList.innerHTML = "<p>Користувач не знайдений. Будь ласка, увійдіть у систему.</p>";
            console.error('Користувач не знайдений. Будь ласка, увійдіть у систему.');
            return;
        }

        console.log('Отримано логін користувача:', userLogin);

        try {
            const response = await fetch(`/api/orders?login=${userLogin}`);
            console.log('Відповідь сервера отримано:', response);

            if (!response.ok) {
                throw new Error('Помилка завантаження замовлень');
            }

            const orders = await response.json();
            console.log('Отримані замовлення:', orders);

            if (orders.length === 0) {
                ordersList.innerHTML = "<p>У вас немає замовлень.</p>";
                return;
            }

            ordersList.innerHTML = ""; // Очищуємо список перед відображенням нових замовлень

            orders.forEach(order => {
                const orderDiv = document.createElement("div");
                orderDiv.classList.add("orderItem");

                const status = document.createElement("h2");
                status.innerText = `Статус: ${order.status}`;
                orderDiv.appendChild(status);

                const date = document.createElement("p");
                date.innerText = `Дата: ${new Date(order.date).toLocaleString()}`;
                orderDiv.appendChild(date);

                const table = document.createElement("table");
                const thead = document.createElement("thead");
                const tbody = document.createElement("tbody");

                thead.innerHTML = `
                    <tr>
                        <th>Назва товару</th>
                        <th>Кількість</th>
                    </tr>
                `;

                order.items.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                    `;
                    tbody.appendChild(row);
                });

                table.appendChild(thead);
                table.appendChild(tbody);

                orderDiv.appendChild(table);

                const totalSum = document.createElement("p");
                totalSum.innerText = `Сума замовлення: ${order.totalSum.toFixed(2)} грн`;
                orderDiv.appendChild(totalSum);

                ordersList.appendChild(orderDiv);
            });
        } catch (error) {
            console.error('Помилка отримання замовлень:', error);
            ordersList.innerHTML = "<p>Не вдалося завантажити замовлення. Будь ласка, спробуйте пізніше.</p>";
        }
    });
});
