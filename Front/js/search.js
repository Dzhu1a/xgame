
const sortButton = document.getElementById('sort');
const searchContainer = document.getElementById('searchContainer');

// Функція для перемикання видимості контейнера пошуку
sortButton.addEventListener('click', function(event) {
  // Перемикаємо клас .active для показу/приховування
  searchContainer.classList.toggle('active');
  event.stopPropagation(); // Зупиняємо поширення події, щоб клік не викликав приховування
});

// Приховуємо контейнер пошуку при кліку поза ним
document.addEventListener('click', function(event) {
  // Перевіряємо, чи клік був поза контейнером .search і не на кнопці .sort
  if (!searchContainer.contains(event.target) && !sortButton.contains(event.target)) {
    searchContainer.classList.remove('active');
  }
});

// Запобігаємо приховуванню при кліку всередині контейнера .search
searchContainer.addEventListener('click', function(event) {
  event.stopPropagation(); // Зупиняємо поширення події
});
document.getElementById('search').addEventListener('input', function() {
    let filter = this.value.toLowerCase();
    let cards = document.querySelectorAll('.clothes');

    cards.forEach(function(card) {
        let textContent = card.textContent.toLowerCase();

        if (textContent.includes(filter)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});


