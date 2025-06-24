
document.addEventListener('DOMContentLoaded', function () {
    var addButton = document.querySelector('.add');
    var modal = document.querySelector('.modal');
    var closeButton = document.querySelector('.button-close');
    var container = document.querySelector('.container');
    var modalButton = document.querySelector('#buttonAdd');
    var buttonEdit = document.querySelector('#buttonEdite');

    addButton.addEventListener('click', function () {
        clearModalFields();
        modal.style.display = 'block';
        container.style.opacity = '0.5';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalButton.style.display = 'block';
        modalButton.style.width = '50%';
        modalButton.style.textAlign = 'center';
        modalButton.style.borderRadius = '10px';
        modalButton.style.border = '1px solid #3fe3fc'; 
        buttonEdit.style.display = 'none'; // Corrected variable name
        isModalOpen=true;
    
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
        modal.removeAttribute('style');
        container.removeAttribute('style');
        isModalOpen=false;
    });

    var form = document.getElementById('addCartForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!isModalOpen) { // Перевіряємо, чи модальне вікно закрите
            return;
        }
        var formData = new FormData(form);
    
        try {
            const response = await fetch('/api/carts/add', {
                method: 'POST',
                body: formData
            });
    
            if (response.ok) {
                const result = await response.json();
                alert('Картку додано успішно');
                clearModalFields()
                addCartToPage(result.newCart);
            } else {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                alert('Помилка: ' + errorText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Помилка: ' + error.message);
        }
    });

    function addCartToPage(cart) {
        const container = document.querySelector('.carts');
        const cartElement = document.createElement('div');
        cartElement.className = 'clothes';
        cartElement.dataset.manufacturer = cart.manufacturer;
        cartElement.dataset.season = cart.season;
        cartElement.dataset.gender = cart.gender;

        // Переконайтесь, що всі властивості, які містять кольори, використовують правильний формат шістнадцяткових кодів
        cartElement.innerHTML = `
            <img src="${cart.img}" alt="clothes" class="clothes-image">
            <h2 class="manufacturer">${cart.manufacturer}</h2>
            <p class="season">${cart.season}</p>
            <p class="gender">${cart.gender}</p>
            <div class="prays"">
                <p class="price">Ціна: ${cart.price}</p>
                <button class="buy-button" style="display: none; data-id="${cart._id}">Купити</button>
            </div>
            <div class="admin-controls" style="display: flex;">
                <button class="edit-button" data-id="${cart._id}">Редагувати</button>
                <button class="delete-button" data-id="${cart._id}"><p>Видалити</p></button>
            </div>
        `;
        container.appendChild(cartElement);
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
});
function clearModalFields() {
    document.getElementById('modal-manufacturer').value = '';
    document.getElementById('modal-season').value = '';
    document.getElementById('gend').value = '';
    document.getElementById('modal-price').value = '';
    document.getElementById('modal-img').value = '';
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
function updateCardOnPage(cart) {
    const cartElement = document.querySelector(`.clothes[data-id="${cart._id}"]`);

    if (!cartElement) {
        console.error(`Cart element with ID ${cart._id} not found.`);
        return;
    }

    cartElement.querySelector('.manufacturer').textContent = cart.manufacturer;
    cartElement.querySelector('.season').textContent = cart.season;
    cartElement.querySelector('.gender').textContent = cart.gender;
    cartElement.querySelector('.price').textContent = cart.price;
    cartElement.querySelector('.clothes-image').src = cart.img;
}


