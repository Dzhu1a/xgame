document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('emblem').addEventListener('click', function() {
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
    });
});