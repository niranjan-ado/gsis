/*
    Copyright © 2024 Adostrophe. All Rights Reserved.
    This is a confidential demonstration prototype created for Good Shepherd International School.
    Not for distribution or public use.
*/
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const carouselImages = [
        // IMPORTANT: These paths and filenames MUST exactly match your files in assets/images/
        // Only provide the path to your standard resolution (1x) image here.
        // The 'alt' text is crucial for accessibility and describes the image content.

        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_225557.jpg', alt: 'Interior of the school chapel' },
        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_225646.jpg', alt: 'School library with students studying' },
        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_225717.jpg', alt: 'Outdoor sports field from an aerial view' },
        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_225800.jpg', alt: 'Students participating in a classroom activity' },
        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_225829.jpg', alt: 'Another view of the school chapel' },
        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_225854.jpg', alt: 'More students in the library' },
        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_225940.jpg', alt: 'Another perspective of the sports complex' },
        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_230032.jpg', alt: 'Teacher interacting with students in class' },
        { src: 'assets/images/Chapel-Good-Shepherd-International-School-07302025_230114.jpg', alt: 'Close-up of a classroom activity' }
        // Add more image objects here as needed, following the exact filename from your folder.
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
        setupLightbox(); // Call the lightbox setup function
        setupMatterportIframe(); // Call the Matterport iframe setup
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

    function setupMatterportIframe() {
        const iframe = document.querySelector('.tour-embed-container iframe');
        if (iframe) {
            // Set the src for the iframe dynamically, ensures it loads properly
            iframe.src = "https://my.matterport.com/show/?m=VDYJFZUHoGb&brand=0&dh=0&title=0&tourcta=0";
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'xr-spatial-tracking');
            // No title attribute needed as per user request for this demo,
            // but in a production environment, it's good for accessibility.
        }
    }

    function setupCarousel() {
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        const carouselInner = document.querySelector('.carousel-inner');
        if (!carouselInner || !carouselWrapper) return;

        // Clear any existing content in the carousel-inner div
        carouselInner.innerHTML = '';

        carouselImages.forEach((img) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carousel-item');

            const imgElement = document.createElement('img');
            imgElement.src = img.src; // This will use the 1x image path from the array
            imgElement.alt = img.alt; // Set the alt text

            // NO @2X LOGIC OR SRCSET HERE, ONLY USING THE 1X SRC
            // imgElement.srcset = `${img.src} 1x, ${srcSet2x} 2x`; // This line is intentionally removed

            itemDiv.appendChild(imgElement);
            carouselInner.appendChild(itemDiv);
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

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoScroll(); // Stop auto-scroll on manual interaction
            startAutoScroll(); // Restart after a brief pause or interaction
        });
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
            updateCarousel();
            stopAutoScroll(); // Stop auto-scroll on manual interaction
            startAutoScroll(); // Restart after a brief pause or interaction
        });


        carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
        carouselWrapper.addEventListener('mouseleave', startAutoScroll);

        startAutoScroll(); // Start auto-scroll when the page loads
    }

    function setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const carouselInner = document.querySelector('.carousel-inner');
        const closeBtn = document.querySelector('.lightbox-close');

        if (!lightbox || !lightboxImg || !carouselInner || !closeBtn) {
            console.warn("Lightbox elements not found. Lightbox functionality will not work.");
            return;
        }

        carouselInner.addEventListener('click', (e) => {
            // Check if an image inside a carousel-item was clicked
            if (e.target.tagName === 'IMG' && e.target.closest('.carousel-item')) {
                lightboxImg.src = e.target.src; // Set the lightbox image source to the clicked image's source
                lightbox.classList.add('visible');
                document.body.classList.add('lightbox-open'); // Add class to body to prevent scrolling
            }
        });

        const closeModal = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('lightbox-open'); // Remove class from body
        };

        closeBtn.addEventListener('click', closeModal);

        // Also close if clicking outside the image (on the dark background)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Check if the click was directly on the lightbox background
                closeModal();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeModal();
            }
        });
    }

    // --- RUN EVERYTHING ---
    init();
});