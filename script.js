/*
    Copyright © 2024 Adostrophe. All Rights Reserved.
    This is a confidential demonstration prototype created for Good Shepherd International School.
    Not for distribution or public use.
*/
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const carouselImages = [
        { src: 'https://placehold.co/1920x1080/1d1d1f/f5f5f7?text=Office+Space', alt: 'GSIS Main Office' },
        { src: 'https://placehold.co/1920x1080/6e6e73/f5f5f7?text=Library', alt: 'Library Reading Area' },
        { src: 'https://placehold.co/1920x1080/0071e3/f5f5f7?text=Chapel+Interior', alt: 'The Chapel Interior' },
        { src: 'https://placehold.co/1920x1080/161617/f5f5f7?text=Classroom', alt: 'Modern Classroom' },
        { src: 'https://placehold.co/1920x1080/86868b/f5f5f7?text=Campus+Grounds', alt: 'Campus Grounds' }
    ];

    // --- INITIALIZATION ---
    function init() {
        setupTheme();
        setupPreloader();
        setupHeaderScroll();
        setupScrollAnimations();
        setupAdvancedCards();
        generateHeroSvg();
        setupCarousel();
        setupLightbox();
    }

    // --- CORE FUNCTIONS ---
    function setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        let currentTheme = localStorage.getItem('theme');

        if (currentTheme) {
            document.body.classList.toggle('dark-theme', currentTheme === 'dark');
        } else {
            document.body.classList.toggle('dark-theme', prefersDark.matches);
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    function setupPreloader() {
        const preloader = document.getElementById('preloader');
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.classList.add('loaded');
            }, 500);
        });
    }

    function setupHeaderScroll() {
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }

    function setupAdvancedCards() {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const { width, height } = rect;
                
                const xRotation = 15 * ((y - height / 2) / height);
                const yRotation = -15 * ((x - width / 2) / width);
                
                card.style.setProperty('--x-rotation', `${xRotation}deg`);
                card.style.setProperty('--y-rotation', `${yRotation}deg`);
                card.style.setProperty('--x-shine', `${x}px`);
                card.style.setProperty('--y-shine', `${y}px`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--x-rotation', '0');
                card.style.setProperty('--y-rotation', '0');
            });
        });
    }
    
    function generateHeroSvg() {
        const gridGroup = document.getElementById('grid');
        const nodesGroup = document.getElementById('nodes');
        if (!gridGroup || !nodesGroup) return;

        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
        gridGroup.setAttribute('stroke', accentColor);

        const numLines = 10, numNodes = 30, nodes = [];
        for (let i = 1; i < numLines; i++) {
            const pos = i * (100 / numLines);
            gridGroup.innerHTML += `<line x1="0" y1="${pos}" x2="100" y2="${pos}" /><line x1="${pos}" y1="0" x2="${pos}" y2="100" />`;
        }
        for (let i = 0; i < numNodes; i++) {
            const node = { x: Math.random() * 100, y: Math.random() * 100, r: Math.random() * 0.6 + 0.2 };
            nodes.push(node);
            nodesGroup.innerHTML += `<circle cx="${node.x}" cy="${node.y}" r="${node.r}" fill="${accentColor}" fill-opacity="0.5"><animateTransform attributeName="transform" type="scale" from="1" to="1.5" begin="${Math.random()*3}s" dur="3s" values="1; 1.5; 1" repeatCount="indefinite" /></circle>`;
        }
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 25) {
                    nodesGroup.innerHTML += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="${accentColor}" stroke-width="0.1" stroke-opacity="0.3"><animate attributeName="stroke-opacity" values="0;0.3;0" begin="${Math.random()*5}s" dur="5s" repeatCount="indefinite" /></line>`;
                }
            }
        }
    }

    function setupCarousel() {
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        const carouselInner = document.querySelector('.carousel-inner');
        if (!carouselInner || !carouselWrapper) return;

        carouselImages.forEach((img) => {
            carouselInner.innerHTML += `<div class="carousel-item"><img src="${img.src}" alt="${img.alt}"></div>`;
        });

        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');
        let currentIndex = 0;
        let autoScrollInterval;

        const updateCarousel = () => {
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
        
        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % carouselImages.length;
            updateCarousel();
        };

        const startAutoScroll = () => {
            stopAutoScroll();
            autoScrollInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        nextBtn.addEventListener('click', () => { nextSlide(); });
        prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length; updateCarousel(); });
        
        carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
        carouselWrapper.addEventListener('mouseleave', startAutoScroll);

        startAutoScroll();
    }

    function setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const carouselInner = document.querySelector('.carousel-inner');
        const closeBtn = document.querySelector('.lightbox-close');

        if (!lightbox || !lightboxImg || !carouselInner || !closeBtn) return;

        carouselInner.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                lightboxImg.src = e.target.src;
                lightbox.classList.add('visible');
            }
        });

        const closeModal = () => {
            lightbox.classList.remove('visible');
        };

        closeBtn.addEventListener('click', closeModal);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeModal();
        });
    }

    // --- RUN EVERYTHING ---
    init();
});