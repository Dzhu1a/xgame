document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/carts')
        .then(response => response.json())
        .then(data => renderCarts(data))
        .catch(error => console.error('Error fetching data:', error));

    const closeButton = document.querySelector('.button-close');
    const editModal = document.getElementById('editModal');

    closeButton.addEventListener('click', function () {
        editModal.style.display = 'none';
    });
});

let currentCartId = null;
let isModalOpen = false;
function renderCarts(carts) {
    const container = document.querySelector('.carts');
    container.innerHTML = '';

    carts.forEach(cart => {
        const cartElement = document.createElement('div');
        cartElement.className = 'clothes';
        cartElement.dataset.manufacturer = cart.manufacturer;
        cartElement.dataset.season = cart.season;
        cartElement.dataset.gender = cart.gender;

        cartElement.innerHTML = `
            <img src="${cart.img}" alt="clothes" class="clothes-image">
            <h2 class="manufacturer">${cart.manufacturer}</h2>
            <p class="season">${cart.season}</p>
            <p class="gender">${cart.gender}</p>
            <div class="prays">
                <p class="price">Ціна: ${cart.price}</p>
                <button class="buy-button" data-id="${cart._id}">Купити</button>
            </div>
            <div class="admin-controls">
                <button class="edit-button" data-id="${cart._id}">Редагувати</button>
                <button class="delete-button" data-id="${cart._id}">Видалити</button>
            </div>
        `;

        container.appendChild(cartElement);
    });

    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', buyItem);
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', deleteCard);
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', async function () {
            currentCartId = this.getAttribute('data-id');
            await fetchCartData(currentCartId);
        });
    });
}

async function fetchCartData(cartId) {
    try {
        const response = await fetch(`/api/cart/${cartId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        fillModalForm(data[0]);
        document.getElementById('editModal').style.display = 'block';
        document.getElementById('buttonEdite').style.display = 'block';
        document.getElementById('buttonAdd').style.display = 'none';
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
}
 
document.getElementById('buttonEdite').addEventListener('click', async function () {
    if (!currentCartId) return;

    const formData = new FormData();
    formData.append('manufacturer', document.getElementById('modal-manufacturer').value);
    formData.append('season', document.getElementById('modal-season').value);
    formData.append('gender', document.getElementById('gend').value);
    formData.append('price', document.getElementById('modal-price').value);
    const img = document.getElementById('modal-img').files[0];
    if (img) {
        formData.append('img', img);
    }

    try {
        const resp = await fetch(`/api/cart/update/${currentCartId}`, {
            method: 'PUT',
            body: formData
        });
        if (resp.ok) {
            const result = await resp.json();
            alert('Картку оновлено успішно');
            updateCardOnPage(result.updatedCart);
            clearModalFields();
            document.getElementById('editModal').style.display = 'none';
            isModalOpen = false;
        } else {
            const error = await resp.json();
            alert(`Помилка оновлення картки: ${error.message}`);
        }
    } catch (error) {
        console.error('Помилка:', error);
        alert('Виникла помилка при оновленні картки');
    }
});

function buyItem(event) {
    const isLoggedIn = localStorage.getItem('login');
    if (isLoggedIn) {
        const cartId = event.target.dataset.id;
        const login = localStorage.getItem('login');
        
        // Робимо запит до сервера, щоб додати товар в кошик
        fetch(`/api/basket/${cartId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login })
        })
        .then(response => {
            if (response.ok) {
                alert('Товар додано в кошик');
            } else {
                throw new Error('Не вдалося додати товар в кошик');
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            alert('Помилка: Не вдалося додати товар в кошик');
        });
    } else {
        alert('Ви не ввійшли в акаунт');
    }
}

async function deleteCard(event) {
    const button = event.target.closest('.delete-button');
    const cardId = button.getAttribute('data-id');
    if (confirm('Ви впевнені, що хочете видалити цю картку?')) {
        try {
            const response = await fetch(`/api/carts/${cardId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Картку успішно видалено');
                button.closest('.clothes').remove();
            } else {
                const result = await response.json();
                alert(`Помилка видалення картки: ${result.message}`);
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Виникла помилка при видаленні картки');
        }
    }
}

function fillModalForm(data) {
    console.log('Fetched data:', data); // Debugging line

    const fields = {
        'modal-manufacturer': data.manufacturer,
        'modal-season': data.season,
        'gend': data.gender,
        'modal-price': data.price
    };

    Object.entries(fields).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field) {
            if (field.tagName === 'SELECT' || field.tagName === 'INPUT') {
                field.value = value || '';
            }
        }
    });

    console.log('Assigned values:', fields);
}

function updateCardOnPage(updatedCart) {
    const card = document.querySelector(`.edit-button[data-id="${updatedCart._id}"]`).closest('.clothes');
    card.querySelector('.manufacturer').textContent = updatedCart.manufacturer;
    card.querySelector('.season').textContent = updatedCart.season;
    card.querySelector('.gender').textContent = updatedCart.gender;
    card.querySelector('.price').textContent = updatedCart.price;
    if (updatedCart.img) {
        card.querySelector('.clothes-image').src = updatedCart.img;
    }
}
function clearModalFields() {
    document.getElementById('modal-manufacturer').value = '';
    document.getElementById('modal-season').value = '';
    document.getElementById('gend').value = '';
    document.getElementById('modal-price').value = '';
    document.getElementById('modal-img').value = '';
}


