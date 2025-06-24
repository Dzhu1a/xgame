/*document.getElementById('sort').addEventListener('mouseover', function() {
    document.getElementById('containerSort').style.display = 'block';
});

document.getElementById('sort').addEventListener('mouseout', function(event) {
    var e = event.toElement || event.relatedTarget;
    if (e && (e.closest('#containerSort') || e.closest('#sort'))) {
        return;
    }
    document.getElementById('containerSort').style.display = 'none';
});

document.getElementById('containerSort').addEventListener('mouseover', function() {
    document.getElementById('containerSort').style.display = 'block';
});

document.getElementById('containerSort').addEventListener('mouseout', function(event) {
    var e = event.toElement || event.relatedTarget;
    if (e && (e.closest('#containerSort') || e.closest('#sort'))) {
        return;
    }
    document.getElementById('containerSort').style.display = 'none';
});// відкриття вікна сортування
const maxSortButton = document.querySelector('.max');
const minSortButton = document.querySelector('.min');

// Функція сортування за ціною від більшого до меншого
const sortByPriceDescending = () => {
    // Отримуємо всі карточки
    const cards = document.querySelectorAll('.clothes');
    // Перетворюємо NodeList в масив для зручності сортування
    const cardsArray = Array.from(cards);

    // Сортуємо карточки за ціною від більшого до меншого
    cardsArray.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').textContent.replace('Ціна: ', ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace('Ціна: ', ''));
        return priceB - priceA;
    });

    // Очищаємо контейнер перед вставкою відсортованих карточок
    const container = document.querySelector('.carts');
    container.innerHTML = '';

    // Вставляємо відсортовані карточки назад в контейнер
    cardsArray.forEach(card => {
        container.appendChild(card);
    });
};

// Функція сортування за ціною від меншого до більшого
const sortByPriceAscending = () => {
    // Отримуємо всі карточки
    const cards = document.querySelectorAll('.clothes');
    // Перетворюємо NodeList в масив для зручності сортування
    const cardsArray = Array.from(cards);

    // Сортуємо карточки за ціною від меншого до більшого
    cardsArray.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').textContent.replace('Ціна: ', ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace('Ціна: ', ''));
        return priceA - priceB;
    });

    // Очищаємо контейнер перед вставкою відсортованих карточок
    const container = document.querySelector('.carts');
    container.innerHTML = '';

    // Вставляємо відсортовані карточки назад в контейнер
    cardsArray.forEach(card => {
        container.appendChild(card);
    });
};

// Додаємо обробники подій на клік для кнопок сортування
maxSortButton.addEventListener('click', sortByPriceDescending);
minSortButton.addEventListener('click', sortByPriceAscending);*/