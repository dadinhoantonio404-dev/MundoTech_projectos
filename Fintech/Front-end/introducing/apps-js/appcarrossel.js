 document.addEventListener('DOMContentLoaded', () => {
            const SLIDE_DATA = [
                {
                    id: 1,
                    title: "Fingrow Premuium",
                    headline: "Quero experiências exclusivas",
                    bgClass: "bg-ultravioleta",
                    alt: "Pessoa nadando no mar"
                },
                {
                    id: 2,
                    title: "Fingrow Empresas",
                    headline: "Quero gerenciar meu negócio com facilidade",
                    bgClass: "bg-empresas",
                    alt: "Escritório"
                },
                {
                    id: 3,
                    title: "Fingrow",
                    headline: "Quero controle total da minha vida financeira",
                    bgClass: "bg-nubank",
                    alt: "Amigos lifestyle"
                }
            ];

            let activeIndex = 1; 
            let isPaused = false;
            let intervalId = null;
            const SLIDE_INTERVAL = 5000;
            let touchStartX = 0;
            let touchEndX = 0;

            const carouselEl = document.getElementById('carousel');
            const headlineEl = document.getElementById('dynamic-headline');
            const dotsContainer = document.getElementById('dots-container');
            const playPauseBtn = document.getElementById('play-pause-btn');

            const iconChevron = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;
            const iconPlay = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 3l14 9-14 9V3z"></path></svg>`;
            const iconPause = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;

            function renderCards() {
                carouselEl.innerHTML = SLIDE_DATA.map((item, index) => `
                    <div class="card ${item.bgClass}" id="card-${index}" data-index="${index}" aria-label="${item.alt}">
                        <div class="card-overlay"></div>
                        <div class="card-content">
                            <div class="card-title">${item.title}</div>
                            <button class="btn-saiba-mais" onclick="alert('Clicou em Saiba mais para: ${item.title}')">
                                Saiba mais ${iconChevron}
                            </button>
                        </div>
                    </div>
                `).join('');
                
                document.querySelectorAll('.card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        if (e.target.closest('.btn-saiba-mais')) return;
                        const index = parseInt(card.dataset.index);
                        if (index !== activeIndex) goToSlide(index);
                    });
                });
            }

            function renderDots() {
                dotsContainer.innerHTML = SLIDE_DATA.map((_, index) => `
                    <button class="dot" data-index="${index}" aria-label="Ir para slide ${index + 1}"></button>
                `).join('');

                document.querySelectorAll('.dot').forEach(dot => {
                    dot.addEventListener('click', (e) => {
                        const index = parseInt(e.target.dataset.index);
                        goToSlide(index);
                    });
                });
            }

            function updateHeadline() {
                headlineEl.classList.remove('slide-up');
                void headlineEl.offsetWidth; 
                headlineEl.innerText = SLIDE_DATA[activeIndex].headline;
                headlineEl.classList.add('slide-up');
            }

            function updateView() {
                const cards = document.querySelectorAll('.card');
                const dots = document.querySelectorAll('.dot');
                const total = SLIDE_DATA.length;
                const prevIndex = (activeIndex - 1 + total) % total;
                const nextIndex = (activeIndex + 1) % total;

                cards.forEach((card, index) => {
                    card.classList.remove('active', 'prev', 'next', 'hidden');
                    if (index === activeIndex) card.classList.add('active');
                    else if (index === prevIndex) card.classList.add('prev');
                    else if (index === nextIndex) card.classList.add('next');
                    else card.classList.add('hidden');
                });

                dots.forEach((dot, index) => {
                    if (index === activeIndex) dot.classList.add('active');
                    else dot.classList.remove('active');
                });

                updateHeadline();
            }

            function nextSlide() {
                activeIndex = (activeIndex + 1) % SLIDE_DATA.length;
                updateView();
            }

            function prevSlide() {
                activeIndex = (activeIndex - 1 + SLIDE_DATA.length) % SLIDE_DATA.length;
                updateView();
            }

            function goToSlide(index) {
                activeIndex = index;
                updateView();
                resetTimer();
            }

            function startTimer() {
                stopTimer();
                if (!isPaused) intervalId = setInterval(nextSlide, SLIDE_INTERVAL);
            }

            function stopTimer() {
                if (intervalId) clearInterval(intervalId);
                intervalId = null;
            }

            function resetTimer() {
                stopTimer();
                startTimer();
            }

            function togglePlayPause() {
                isPaused = !isPaused;
                playPauseBtn.innerHTML = isPaused ? iconPlay : iconPause;
                playPauseBtn.setAttribute('aria-label', isPaused ? "Play" : "Pause");
                if (isPaused) stopTimer();
                else startTimer();
            }

            function handleSwipe() {
                const threshold = 50;
                if (touchStartX - touchEndX > threshold) {
                    nextSlide();
                    resetTimer();
                } else if (touchEndX - touchStartX > threshold) {
                    prevSlide();
                    resetTimer();
                }
            }

            function init() {
                renderCards();
                renderDots();
                
                carouselEl.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });

                carouselEl.addEventListener('touchmove', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                }, { passive: true });

                carouselEl.addEventListener('touchend', handleSwipe);
                playPauseBtn.addEventListener('click', togglePlayPause);
                
                updateView();
                startTimer(); 
            }

            init();
        });