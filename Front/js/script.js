// partners list
function generatePartnerLogos() {
    
  
    var html = '';
    partnerLogos.forEach(function (partner) {
      html += '<a href="' + partner.link + '" target="_blank" class="m-5">';
      html += '<img src="' + partner.imageSrc + '" alt="' + partner.alt + '">';
      html += '</a>';
    });
    return html;
  }
  
  var partnerLogosHTML = generatePartnerLogos();
  var partnerLogosContainer = document.getElementById('partner-logos');
  partnerLogosContainer.innerHTML = partnerLogosHTML;
  
  //slider items
  
  
  
  
  // partners slider
  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slider-slide');
  let i;
  
  function slideTo(n) {
    track.style.transform = `translateX(-${n * slides[0].offsetWidth}px)`;
  }
  
  function activateArrows(direction) {
    direction === 'right' ? i++ : i--;
    if (i < 0) i = slides.length - 1;
    if (i > slides.length - 1) i = 0;
    slideTo(i);
  }
  
  function activateDots(e) {
    i = e.target.dataset.index;
    slideTo(i);
  }
  
  function activate(e) {
    e.target.matches('.arrow-right') && activateArrows('right');
    e.target.matches('.arrow-left') && activateArrows();
  }
  
  function init(n) {
    i = n;
    slideTo(n);
  }
  
  document.addEventListener('click', activate, false);
  window.addEventListener('load', init(1), false);
  
  // display width event
  function handleResize() {
    slideTo(0)
  }
  
  const resizeObserver = new ResizeObserver(handleResize);
  const targetElement = document.querySelector('body');
  resizeObserver.observe(targetElement);
  
  // gallery slider
  const gallerySlides = document.querySelectorAll(".gallery-slide");
  const handPointer = document.querySelector(".gallery-slide__hand-pointer");
  
  gallerySlides.forEach((slide) => {
    slide.addEventListener("mouseover", () => {
      clearActiveClasses();
      slide.classList.add("active");
      handPointer.classList.add("hidden");
    });
    slide.addEventListener("mouseout", () => {
      clearActiveClasses();
      handPointer.classList.remove("hidden");
    });
  });
  
  function clearActiveClasses() {
    gallerySlides.forEach((slide) => {
      slide.classList.remove("active");
    });
  }
  
  // world slider
  const words = ["ЩОДЕННІ ТУРНІРИ", "ВЕЛИКИЙ ВИБІР ІГОР", "УНІКАЛЬНА АТМОСФЕРА", "КІБЕРСПОРТИВНІ ІВЕНТИ", "PS5 PRO & LOUNGE ZONE", "НАСТІЛЬНИЙ ТЕНІС", "ПРАЦЮЄМО 24/7"];
  const wordSlider = document.querySelector(".word-slider");
  let currentIndex = 0;
  
  function changeWord() {
    wordSlider.textContent = words[currentIndex];
    currentIndex = (currentIndex + 1) % words.length;
  }
  setInterval(changeWord, 2000);
  
  // scroll up
  window.addEventListener('DOMContentLoaded', function () {
    var scrollToTopButton = document.querySelector('.scrollToTop');
    scrollToTopButton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
  
  // current year
  document.addEventListener('DOMContentLoaded', function () {
    var currentYear = new Date().getFullYear();
    var yearElement = document.getElementById('currentYear');
    yearElement.textContent = currentYear;
  });