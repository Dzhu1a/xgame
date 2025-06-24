let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicators div');
        const intervalTime = 5000;
        let slideInterval;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
                indicators[i].classList.toggle('indicator-active', i === index);
            });
            currentSlide = index;
        };
        
        const nextSlide = () => {
            showSlide((currentSlide + 1) % slides.length);
        };
        
        const prevSlide = () => {
            showSlide((currentSlide - 1 + slides.length) % slides.length);
        };
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        
        document.getElementById('prevBtn').addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
        });
        
        const startInterval = () => {
            slideInterval = setInterval(nextSlide, intervalTime);
        };
        
        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };
        
        startInterval();