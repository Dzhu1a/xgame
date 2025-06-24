document.addEventListener('DOMContentLoaded', function () {
    var contactButton=document.querySelector('.phone');
    var contact=document.querySelector('.container-contacts');
    var carousel=document.querySelector('.carousel-container');
    var carts=document.querySelector('.carts');
    const profil = document.querySelector('.profile-container');
        var orders=document.querySelector('.orders-container');
    contactButton.addEventListener('click', function () {
        contact.style.display = 'block';
        carousel.style.display = 'none';
        carts.style.display = 'none';
        profil.style.display = 'none';
        orders.style.display = 'none';
    });
});