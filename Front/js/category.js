document.getElementById('three').addEventListener('click', function() {
    var container = document.getElementById('categoryContainer');
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block'; // Показуємо контейнер
    } else {
        container.style.display = 'none'; // Приховуємо контейнер
    }
});//відкриття категорій


document.getElementById('boyCategor').addEventListener('click', function() {
    var cards = document.querySelectorAll('.clothes');
    cards.forEach(function(clothes) {
        if (clothes.getAttribute('data-gender') === 'Мерч ') {
            clothes.style.display = 'block';
        } else {
            clothes.style.display = 'none';
        }
    });
});// всі картки чоловічого одягу


document.getElementById('accessories').addEventListener('click', function() {
    var cards = document.querySelectorAll('.clothes');
    cards.forEach(function(clothes) {
        if (clothes.getAttribute('data-gender') === 'Аксесуари') {
            clothes.style.display = 'block';
        } else {
            clothes.style.display = 'none';
        }
    });
}); 

document.getElementById('accessorie').addEventListener('click', function() {
    var cards = document.querySelectorAll('.clothes');
    cards.forEach(function(clothes) {
        if (clothes.getAttribute('data-gender') === 'Аксесуари') {
            clothes.style.display = 'block';
        } else {
            clothes.style.display = 'none';
        }
    });
}); 