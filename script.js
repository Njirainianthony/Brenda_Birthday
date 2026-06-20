/* ============================================
   BREE'S BIRTHDAY V3 — WHITE ELEGANCE SCRIPTS
   Petals, Confetti, Carousels & More!
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initPetals();
    initConfetti();
    initScrollAnimations();
    initMusicToggle();
    initCarousels();
});

/* ============================================
   COUNTDOWN TIMER
   ============================================ */
function initCountdown() {
    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownEl   = document.getElementById('countdown');
    const birthdayMsg   = document.getElementById('birthday-msg');
    const labelEl       = document.getElementById('countdown-label');

    function getBirthdayDate() {
        const now = new Date();
        let year = now.getFullYear();
        let birthday = new Date(year, 5, 22); // June 22
        if (now > new Date(year, 5, 23)) {
            birthday = new Date(year + 1, 5, 22);
        }
        return birthday;
    }

    function updateCountdown() {
        const now      = new Date();
        const birthday = getBirthdayDate();
        const diff     = birthday - now;

        // It's her birthday!
        if (now.getMonth() === 5 && now.getDate() === 22) {
            countdownEl.style.display = 'none';
            birthdayMsg.style.display = 'block';
            if (labelEl) labelEl.textContent = '🎉 THE DAY IS HERE! 🎉';
            launchConfetti(250);
            return;
        }

        if (diff <= 0) {
            countdownEl.style.display = 'none';
            birthdayMsg.style.display = 'block';
            return;
        }

        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        animateNumber(daysEl,    days);
        animateNumber(hoursEl,   hours);
        animateNumber(minutesEl, minutes);
        animateNumber(secondsEl, seconds);
    }

    function animateNumber(el, value) {
        const formatted = String(value).padStart(2, '0');
        if (el && el.textContent !== formatted) {
            el.style.transform = 'scale(1.15)';
            el.textContent = formatted;
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ============================================
   FLOATING PETALS 🌸
   ============================================ */
function initPetals() {
    const container = document.getElementById('petals-container');
    const petals    = ['🌸', '🌷', '✿', '❀', '🌺', '✦', '·', '∘'];

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];

        const leftPos  = Math.random() * 100;
        const duration = Math.random() * 12 + 10; // 10–22s
        const delay    = Math.random() * 8;
        const sway     = (Math.random() - 0.5) * 120;

        petal.style.left = `${leftPos}%`;
        petal.style.setProperty('--dur',   `${duration}s`);
        petal.style.setProperty('--delay', `${delay}s`);
        petal.style.setProperty('--sway',  `${sway}px`);
        petal.style.fontSize = `${Math.random() * 0.8 + 0.7}rem`;
        petal.style.opacity  = String(Math.random() * 0.3 + 0.1);

        container.appendChild(petal);

        setTimeout(() => {
            if (petal.parentElement) petal.remove();
        }, (duration + delay) * 1000);
    }

    // Initial petals
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createPetal(), i * 400);
    }

    // Keep them coming
    setInterval(() => {
        if (container.children.length < 15) createPetal();
    }, 2000);
}

/* ============================================
   INTERACTIVE CAKE 🎂
   ============================================ */
let candlesBlown = false;

function blowCandles() {
    if (candlesBlown) {
        document.querySelectorAll('.flame').forEach(f => f.classList.remove('blown'));
        const hint = document.querySelector('.cake-hint');
        if (hint) hint.textContent = '✨ Click to make a wish! ✨';
        candlesBlown = false;
        return;
    }

    document.querySelectorAll('.flame').forEach((flame, i) => {
        setTimeout(() => flame.classList.add('blown'), i * 200);
    });

    setTimeout(() => launchConfetti(180), 600);

    const hint = document.querySelector('.cake-hint');
    if (hint) hint.textContent = '🎉 Wish made! Click to relight 🎉';
    candlesBlown = true;
}
window.blowCandles = blowCandles;

/* ============================================
   CONFETTI SYSTEM 🎊
   ============================================ */
let confettiPieces = [];
let confettiCanvas, confettiCtx;

function initConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    confettiCtx    = confettiCanvas.getContext('2d');

    function resize() {
        confettiCanvas.width  = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Soft welcome confetti
    setTimeout(() => launchConfetti(60), 800);

    function animate() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confettiPieces = confettiPieces.filter(c => c.opacity > 0 && c.y < confettiCanvas.height + 50);

        confettiPieces.forEach(c => {
            c.x       += c.vx + Math.sin(c.y * 0.012) * 0.4;
            c.y       += c.vy;
            c.vy      += 0.025; // gravity
            c.rot     += c.rotV;
            c.opacity -= 0.0025;

            confettiCtx.save();
            confettiCtx.globalAlpha = Math.max(0, c.opacity);
            confettiCtx.translate(c.x, c.y);
            confettiCtx.rotate(c.rot);

            if (c.shape === 'circle') {
                confettiCtx.fillStyle = c.color;
                confettiCtx.beginPath();
                confettiCtx.arc(0, 0, c.size, 0, Math.PI * 2);
                confettiCtx.fill();
            } else if (c.shape === 'star') {
                drawStar(confettiCtx, 0, 0, 5, c.size, c.size / 2.2, c.color);
            } else {
                confettiCtx.fillStyle = c.color;
                confettiCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            }

            confettiCtx.restore();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function drawStar(ctx, cx, cy, spikes, outer, inner, color) {
    let rot  = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outer);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
        rot += step;
    }
    ctx.lineTo(cx, cy - outer);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function launchConfetti(count = 100) {
    // Soft pastel palette for white theme
    const colors = [
        '#E8A2B8', '#C76B8A', '#F2C94C', '#F2994A',
        '#BB6BD9', '#56CCF2', '#6FCF97', '#FFB3CC',
        '#D4A5E0', '#A8D8EA', '#B5EAD7', '#FFDAC1'
    ];
    const shapes = ['rect', 'circle', 'star', 'rect', 'circle'];

    for (let i = 0; i < count; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        confettiPieces.push({
            x:     confettiCanvas.width / 2 + (Math.random() - 0.5) * confettiCanvas.width * 0.7,
            y:     -20 - Math.random() * 100,
            w:     Math.random() * 11 + 4,
            h:     Math.random() * 7  + 3,
            size:  Math.random() * 6  + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx:    (Math.random() - 0.5) * 7,
            vy:    Math.random() * 3 + 1,
            rot:   Math.random() * Math.PI * 2,
            rotV:  (Math.random() - 0.5) * 0.18,
            opacity: 1,
            shape
        });
    }
}
window.launchConfetti = launchConfetti;

function spawnConfettiAt(x, y) {
    const colors = ['#E8A2B8', '#F2C94C', '#6FCF97', '#BB6BD9', '#56CCF2'];
    for (let i = 0; i < 18; i++) {
        confettiPieces.push({
            x, y,
            w: Math.random() * 8  + 3,
            h: Math.random() * 5  + 2,
            size:    Math.random() * 5  + 2,
            color:   colors[Math.floor(Math.random() * colors.length)],
            vx:      (Math.random() - 0.5) * 10,
            vy:      -(Math.random() * 5 + 3),
            rot:     Math.random() * Math.PI * 2,
            rotV:    (Math.random() - 0.5) * 0.3,
            opacity: 1,
            shape:   ['rect', 'circle', 'star'][Math.floor(Math.random() * 3)]
        });
    }
}

// Subtle click-anywhere sparkle
document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.cake-container')) return;
    spawnConfettiAt(e.clientX, e.clientY);
});

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollAnimations() {
    const selectors = [
        '.section-header',
        '.photo-frame',
        '.reason-card',
        '.letter-card',
        '.wish-card'
    ];

    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.07}s`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================
   MUSIC TOGGLE 🎵
   ============================================ */
function initMusicToggle() {
    const btn   = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const label = btn.querySelector('.music-label');
    let playing = false;

    btn.addEventListener('click', () => {
        if (playing) {
            audio.pause();
            btn.classList.remove('playing');
            label.textContent = 'Play Music';
            playing = false;
        } else {
            audio.play()
                .then(() => {
                    btn.classList.add('playing');
                    label.textContent = 'Pause';
                    playing = true;
                })
                .catch(() => {
                    label.textContent = 'No audio file';
                    setTimeout(() => { label.textContent = 'Play Music'; }, 2000);
                });
        }
    });
}

/* ============================================
   CAROUSEL SYSTEM
   ============================================ */
function initCarousels() {
    new Carousel('gallery-carousel',  { slidesVisible: 1 });
    new Carousel('reasons-carousel',  { slidesPerView: { default: 3, 900: 2, 600: 1 } });
    new Carousel('wishes-carousel',   { slidesPerView: { default: 3, 900: 2, 600: 1 } });
}

class Carousel {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.viewport  = this.container.querySelector('.carousel-viewport');
        this.track     = this.container.querySelector('.carousel-track');
        this.slides    = Array.from(this.container.querySelectorAll('.carousel-slide'));
        this.prevBtn   = this.container.querySelector('.carousel-nav.prev');
        this.nextBtn   = this.container.querySelector('.carousel-nav.next');
        this.dotsWrap  = this.container.querySelector('.carousel-dots');

        this.options       = options;
        this.currentIndex  = 0;
        this.slideWidth    = 0;
        this.slidesVisible = 1;
        this.isDragging    = false;
        this.startX        = 0;
        this.currentTX     = 0;
        this.dragDelta     = 0;

        // Auto-advance for photo gallery
        this.autoPlay = containerId === 'gallery-carousel';
        this.autoTimer = null;

        this.init();
    }

    init() {
        this.updateLayout();

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', e => { e.stopPropagation(); this.prev(); this.resetAuto(); });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', e => { e.stopPropagation(); this.next(); this.resetAuto(); });
        }

        window.addEventListener('resize', () => {
            const saved = this.currentIndex;
            this.updateLayout();
            this.goTo(Math.min(saved, this.slides.length - this.slidesVisible), false);
        });

        // Drag events
        this.viewport.addEventListener('mousedown',  e  => this.dragStart(e));
        window.addEventListener('mousemove',         e  => this.dragMove(e));
        window.addEventListener('mouseup',           () => this.dragEnd());

        this.viewport.addEventListener('touchstart', e  => this.dragStart(e), { passive: true });
        this.viewport.addEventListener('touchmove',  e  => this.dragMove(e),  { passive: true });
        this.viewport.addEventListener('touchend',   () => this.dragEnd());

        this.track.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
        });

        if (this.autoPlay) this.startAuto();
    }

    getSlidesVisible() {
        if (this.options.slidesVisible) return this.options.slidesVisible;
        if (!this.options.slidesPerView) return 1;

        const breakpoints = this.options.slidesPerView;
        const w = window.innerWidth;
        let result = breakpoints.default || 1;

        const bpKeys = Object.keys(breakpoints)
            .filter(k => k !== 'default')
            .map(Number)
            .sort((a, b) => b - a);

        for (const bp of bpKeys) {
            if (w <= bp) result = breakpoints[bp];
        }

        return result;
    }

    updateLayout() {
        if (!this.slides.length) return;

        this.slidesVisible = this.getSlidesVisible();

        // Set slide widths via CSS
        const pct = 100 / this.slidesVisible;
        this.slides.forEach(s => {
            s.style.minWidth = `${pct}%`;
            s.style.flexShrink = '0';
        });

        // Force reflow then measure
        this.viewport.offsetWidth;
        this.slideWidth = this.slides[0].getBoundingClientRect().width;

        this.buildDots();
        this.goTo(this.currentIndex, false);
    }

    buildDots() {
        if (!this.dotsWrap) return;
        this.dotsWrap.innerHTML = '';

        const numDots = Math.max(1, this.slides.length - this.slidesVisible + 1);
        if (numDots <= 1) return;

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === this.currentIndex) dot.classList.add('active');
            dot.addEventListener('click', e => { e.stopPropagation(); this.goTo(i); this.resetAuto(); });
            this.dotsWrap.appendChild(dot);
        }
    }

    goTo(index, animate = true) {
        const maxIndex = Math.max(0, this.slides.length - this.slidesVisible);
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));

        this.track.style.transition = animate
            ? 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            : 'none';

        const tx = -this.currentIndex * this.slideWidth;
        this.track.style.transform = `translateX(${tx}px)`;

        if (!animate) {
            this.track.offsetHeight; // force reflow
            this.track.style.transition = '';
        }

        // Nav button states
        if (this.prevBtn) this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
        if (this.nextBtn) this.nextBtn.classList.toggle('disabled', this.currentIndex >= maxIndex);

        // Dots
        if (this.dotsWrap) {
            Array.from(this.dotsWrap.querySelectorAll('.carousel-dot')).forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }
    }

    prev() {
        if (this.currentIndex > 0) this.goTo(this.currentIndex - 1);
    }

    next() {
        const max = Math.max(0, this.slides.length - this.slidesVisible);
        if (this.currentIndex < max) {
            this.goTo(this.currentIndex + 1);
        } else {
            this.goTo(0); // loop for autoplay
        }
    }

    dragStart(e) {
        this.isDragging = true;
        this.startX     = e.pageX ?? e.touches?.[0]?.pageX ?? 0;
        this.currentTX  = -this.currentIndex * this.slideWidth;
        this.dragDelta  = 0;
        this.track.style.transition = 'none';
    }

    dragMove(e) {
        if (!this.isDragging) return;
        const x = e.pageX ?? e.touches?.[0]?.pageX;
        if (!x) return;

        this.dragDelta = x - this.startX;
        const max = 0;
        const min = -Math.max(0, this.slides.length - this.slidesVisible) * this.slideWidth;
        let tx = this.currentTX + this.dragDelta;

        if (tx > max) tx = max + (tx - max) * 0.25;
        if (tx < min) tx = min + (tx - min) * 0.25;

        this.track.style.transform = `translateX(${tx}px)`;
    }

    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.track.style.transition = '';

        const threshold = this.slideWidth * 0.15;
        if      (this.dragDelta < -threshold) this.next();
        else if (this.dragDelta >  threshold) this.prev();
        else    this.goTo(this.currentIndex);

        this.resetAuto();
    }

    startAuto() {
        this.autoTimer = setInterval(() => this.next(), 4000);
    }

    resetAuto() {
        if (!this.autoPlay) return;
        clearInterval(this.autoTimer);
        this.startAuto();
    }
}
