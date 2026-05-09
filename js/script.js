// ─────────────────── SMOOTH SCROLL ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navH = document.querySelector('.navbar').offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
            window.scrollTo({ top, behavior: 'smooth' });

            // close mobile nav if open
            document.getElementById('navMobile').classList.remove('open');
        }
    });
});

// ─────────────────── MOBILE NAV ───────────────────
const navMenuBtn = document.getElementById('navMenuBtn');
const navMobile  = document.getElementById('navMobile');

navMenuBtn.addEventListener('click', () => {
    navMobile.classList.toggle('open');
});

// ─────────────────── MODAL ───────────────────
const modalOverlay = document.getElementById('modalOverlay');
const modal        = document.getElementById('modal');
const modalClose   = document.getElementById('modalClose');
const modalImg     = document.getElementById('modalImg');
const modalTitle   = document.getElementById('modalTitle');
const modalStatus  = document.getElementById('modalStatus');
const modalDesc    = document.getElementById('modalDesc');
const modalTech    = document.getElementById('modalTech');
const modalLink    = document.getElementById('modalLink');

function openModal(card) {
    const title  = card.dataset.title  || '';
    const desc   = card.dataset.desc   || '';
    const tech   = card.dataset.tech   || '';
    const status = card.dataset.status || '';
    const link   = card.dataset.link   || '#';
    const img    = card.dataset.img    || '';

    modalImg.src = img;
    modalImg.alt = title;
    modalTitle.textContent  = title;
    modalStatus.textContent = status;
    modalDesc.textContent   = desc;

    // tech tags
    modalTech.innerHTML = '';
    tech.split(',').forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t.trim();
        modalTech.appendChild(span);
    });

    // link button
    if (link && link !== '#') {
        modalLink.href  = link;
        modalLink.style.display = 'inline-block';
    } else {
        modalLink.style.display = 'none';
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ─────────────────── PROJECT CARDS CLICK ───────────────────
document.querySelectorAll('.project-card').forEach(card => {
    // "view more" card → just open new tab
    if (card.classList.contains('view-more')) {
        card.addEventListener('click', () => {
            const link = card.dataset.link;
            if (link && link !== '#') window.open(link, '_blank');
        });
        return;
    }

    card.addEventListener('click', () => {
        openModal(card);
    });
});

// ─────────────────── CAROUSEL ───────────────────
const carousel   = document.getElementById('carousel');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');

const cards = carousel.querySelectorAll('.project-card');
let currentIndex = 0;

function getCardsToShow() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 1000) return 2;
    return 3;
}

let cardsToShow = getCardsToShow();
let totalSlides  = Math.ceil(cards.length / cardsToShow);

function buildIndicators() {
    indicatorsContainer.innerHTML = '';
    totalSlides = Math.ceil(cards.length / getCardsToShow());
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(dot);
    }
}

function updateCarousel() {
    cardsToShow = getCardsToShow();
    totalSlides = Math.ceil(cards.length / cardsToShow);
    if (currentIndex >= totalSlides) currentIndex = totalSlides - 1;

    const cardW = cards[0].offsetWidth;
    const gap   = 24; // 1.5rem
    const offset = currentIndex * (cardW + gap) * cardsToShow;
    carousel.style.transform = `translateX(-${offset}px)`;

    document.querySelectorAll('.indicator').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function goToSlide(index) {
    totalSlides = Math.ceil(cards.length / getCardsToShow());
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarousel();
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        buildIndicators();
        updateCarousel();
    }, 150);
});

buildIndicators();

// ─────────────────── STACK BARS ANIMATION ───────────────────
function animateStackBars() {
    document.querySelectorAll('.stack-fill').forEach(bar => {
        const w = bar.dataset.width || '0';
        bar.style.width = w + '%';
    });
}

// use IntersectionObserver to trigger animation when stack section is visible
const stackSection = document.getElementById('stack');
if (stackSection) {
    const stackObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStackBars, 200);
                stackObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    stackObserver.observe(stackSection);
}

// ─────────────────── FADE-IN ON SCROLL ───────────────────
const fadeEls = document.querySelectorAll('.timeline-item, .stack-category, .project-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    fadeObserver.observe(el);
});

// ─────────────────── STAR CANVAS ───────────────────
const canvas = document.getElementById('stars-canvas');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x       = Math.random() * canvas.width;
        this.y       = Math.random() * canvas.height;
        this.size    = Math.random() * 1.5 + 0.2;
        this.speedX  = (Math.random() - 0.5) * 0.15;
        this.speedY  = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.fadeDir = (Math.random() > 0.5) ? 0.004 : -0.004;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeDir;

        if (this.opacity <= 0.05 || this.opacity >= 0.75) this.fadeDir = -this.fadeDir;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    for (let i = 0; i < count; i++) stars.push(new Star());
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
});

resizeCanvas();
initStars();
animateStars();
