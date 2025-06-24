var map = L.map("map").setView([49.55048, 25.59036], 15); // Координати вул. Руска , 18

// Додавання тайлів OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Додавання мітки
var marker = L.marker([49.55048, 25.59036]).addTo(map);
marker
  .bindPopup(
    "<b>XGame</b><br>вул. Руска , 18, Тернопіль<br>Сучасний простір для геймерів!"
  )
  .openPopup();
