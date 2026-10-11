/**
 * GDG ITER - Premium Animated Hub Logic
 * Features: Parallax, Intersection Observers, Animated Counters, 
 * Dynamic Timeline Progress, Interactive Modals, Mobile Menu, Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgressBar();
    initAmbientCursorGlow();
    initValorantCrosshair();
    initHeroParticles();
    initMagneticButtons();
    initParallax();
    initScrollAnimations();
    initTimelineProgress();
    initHeaderScroll();
    initSpotlightCards();
    initTiltEffects();
    initFloatingChipsParallax();
    initMobileNav();
    initModals();
    initGalleryControls();
});

/* -------------------------------------------------------------
 * 0. Scroll Progress Bar Engine
 * ------------------------------------------------------------- */
function initScrollProgressBar() {
    let bar = document.getElementById('scroll-progress');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'scroll-progress';
        document.body.prepend(bar);
    }

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
}

/* -------------------------------------------------------------
 * 0.1 Ambient Cursor Glow Engine
 * ------------------------------------------------------------- */
function initAmbientCursorGlow() {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let glow = document.getElementById('ambient-glow');
    if (!glow) {
        glow = document.createElement('div');
        glow.id = 'ambient-glow';
        document.body.appendChild(glow);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animateGlow() {
        // Smooth lerp easing
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;
        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* -------------------------------------------------------------
 * 0.15 Valorant HUD Reticle Crosshair Follower
 * ------------------------------------------------------------- */
function initValorantCrosshair() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let crosshair = document.getElementById('val-crosshair');
    if (!crosshair) {
        crosshair = document.createElement('div');
        crosshair.id = 'val-crosshair';
        crosshair.innerHTML = `
            <div class="crosshair-center"></div>
            <div class="crosshair-line line-top"></div>
            <div class="crosshair-line line-bottom"></div>
            <div class="crosshair-line line-left"></div>
            <div class="crosshair-line line-right"></div>
        `;
        document.body.appendChild(crosshair);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function renderCrosshair() {
        currentX += (mouseX - currentX) * 0.35;
        currentY += (mouseY - currentY) * 0.35;
        crosshair.style.left = `${currentX}px`;
        crosshair.style.top = `${currentY}px`;
        requestAnimationFrame(renderCrosshair);
    }
    renderCrosshair();

    // Target lock animation on interactive elements
    const targetSelectors = 'button, a, input, select, textarea, .spotlight-card, .interactive-tilt, .val-card, .floating-chip';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(targetSelectors)) {
            crosshair.classList.add('locked');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(targetSelectors)) {
            crosshair.classList.remove('locked');
        }
    });
}

/* -------------------------------------------------------------
 * 0.2 Interactive Hero Radianite Particle Engine
 * ------------------------------------------------------------- */
function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    const hero = document.getElementById('hero');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    const colors = [
        'rgba(255, 70, 85, 0.75)',   // Valorant Crimson
        'rgba(0, 245, 212, 0.75)',   // Radianite Cyan
        'rgba(255, 200, 59, 0.75)',  // Radiant Gold
        'rgba(236, 232, 225, 0.65)'  // Off-white Tactical
    ];

    let mouse = { x: -999, y: -999, radius: 110 };

    function resize() {
        const rect = hero.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const count = window.innerWidth < 768 ? 28 : 55;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.65,
                vy: (Math.random() - 0.5) * 0.65,
                radius: Math.random() * 2.2 + 1.2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
        mouse.x = -999;
        mouse.y = -999;
    });

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(hero);

    function animate() {
        if (!isVisible) {
            requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off boundaries
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Mouse repulsion
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - dist) / mouse.radius;
                p.x -= Math.cos(angle) * force * 1.8;
                p.y -= Math.sin(angle) * force * 1.8;
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Connect nearby particles with Radianite Cyan energy lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const pDistX = p.x - p2.x;
                const pDistY = p.y - p2.y;
                const pDist = Math.sqrt(pDistX * pDistX + pDistY * pDistY);

                if (pDist < 85) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = (1 - pDist / 85) * 0.28;
                    ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    animate();
}

/* -------------------------------------------------------------
 * 0.3 Magnetic Buttons Engine
 * ------------------------------------------------------------- */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const btns = document.querySelectorAll('.magnetic-btn');
    btns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });
}

/* -------------------------------------------------------------
 * 1. Parallax Effect for Background Blobs, Badges & Hero
 * ------------------------------------------------------------- */
function initParallax() {
    const blobs = document.querySelectorAll('.parallax-blob');
    const hero = document.getElementById('hero');

    if (!blobs.length) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) * 0.1;
        const y = (e.clientY - window.innerHeight / 2) * 0.1;

        blobs.forEach((blob) => {
            const speed = parseFloat(blob.dataset.parallaxSpeed) || 0.1;
            blob.style.transform = `translate3d(${x * speed * 2}px, ${y * speed * 2}px, 0)`;
        });
    }, { passive: true });

    // Subtle scroll parallax on hero text
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (hero && scrolled < 800) {
            const h1 = hero.querySelector('h1');
            if (h1) {
                h1.style.transform = `translateY(${scrolled * 0.08}px)`;
            }
        }
    }, { passive: true });
}

/* -------------------------------------------------------------
 * 1.1 Floating Tech Chips Parallax in Hero
 * ------------------------------------------------------------- */
function initFloatingChipsParallax() {
    const chips = document.querySelectorAll('.floating-chip');
    if (!chips.length) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;

        chips.forEach((chip, i) => {
            const depth = (i + 1) * 15;
            chip.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
    }, { passive: true });
}

/* -------------------------------------------------------------
 * 1.2 Card Spotlight & 3D Interactive Tilt
 * ------------------------------------------------------------- */
function initSpotlightCards() {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function initTiltEffects() {
    // Only apply on desktop pointers
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tiltCards = document.querySelectorAll('.interactive-tilt');
    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

/* -------------------------------------------------------------
 * 2. Intersection Observer for Scroll Reveals & Counters
 * ------------------------------------------------------------- */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-hidden');
    const countedElements = new Set();

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('reveal-visible');

                // Check for counters inside this container
                const counters = target.querySelectorAll('.counter');
                counters.forEach((counter) => {
                    if (!countedElements.has(counter)) {
                        countedElements.add(counter);
                        animateCounter(counter);
                    }
                });

                // Unobserve once revealed to keep memory footprint low
                obs.unobserve(target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => {
        const delay = el.dataset.delay || 0;
        el.style.transitionDelay = `${delay}ms`;
        observer.observe(el);
    });
}

function animateCounter(el) {
    const rawTarget = el.dataset.target;
    const target = parseFloat(rawTarget);
    if (isNaN(target)) return;

    const isDecimal = rawTarget.includes('.');
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const duration = 1800;
    const intervalMs = 16;
    const step = target / (duration / intervalMs);

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.innerText = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
            clearInterval(timer);
        } else {
            el.innerText = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        }
    }, intervalMs);
}

/* -------------------------------------------------------------
 * 3. Dynamic Timeline Height & Milestone Glow on Scroll
 * ------------------------------------------------------------- */
function initTimelineProgress() {
    const timelineSection = document.getElementById('achievements');
    const timelineActiveLine = document.getElementById('timeline-line-active');
    const timelineNodes = document.querySelectorAll('.timeline-node');

    if (!timelineSection || !timelineActiveLine) return;

    const updateTimeline = () => {
        const rect = timelineSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Progress starts when section enters upper half, finishes when section scrolls past
        const start = windowHeight * 0.75;
        const totalHeight = rect.height;
        const currentProgress = start - rect.top;

        let percentage = Math.min(Math.max((currentProgress / totalHeight) * 100, 0), 100);
        timelineActiveLine.style.height = `${percentage}%`;

        // Highlight timeline nodes and trigger radar wave
        timelineNodes.forEach((node) => {
            const nodeRect = node.getBoundingClientRect();
            if (nodeRect.top <= windowHeight * 0.6) {
                node.classList.add('border-[#ff4655]', 'shadow-[0_0_22px_rgba(255,70,85,0.7)]', 'scale-110', 'active');
                node.classList.remove('border-slate-800');
            } else {
                node.classList.remove('border-[#ff4655]', 'shadow-[0_0_22px_rgba(255,70,85,0.7)]', 'scale-110', 'active');
                node.classList.add('border-slate-800');
            }
        });
    };

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
}

/* -------------------------------------------------------------
 * 4. Header Shadow & Active Section Tracker
 * ------------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Elevated header appearance
        if (header) {
            if (scrollY > 40) {
                header.classList.add('shadow-xl', 'bg-[#0f1923]/95', 'border-b', 'border-[#ff4655]/30');
                header.classList.remove('bg-[#0f1923]/80');
            } else {
                header.classList.remove('shadow-xl', 'bg-[#0f1923]/95', 'border-[#ff4655]/30');
                header.classList.add('bg-[#0f1923]/80');
            }
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('text-[#ff4655]', 'active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('text-[#ff4655]', 'active');
                link.classList.remove('text-slate-400');
            } else if (!link.classList.contains('val-btn-polygon')) {
                link.classList.add('text-slate-400');
                link.classList.remove('text-[#ff4655]', 'active');
            }
        });
    }, { passive: true });
}

/* -------------------------------------------------------------
 * 5. Mobile Drawer Navigation
 * ------------------------------------------------------------- */
function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const drawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
    const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

    const openDrawer = () => {
        if (!drawer || !drawerBackdrop) return;
        drawerBackdrop.classList.remove('hidden');
        setTimeout(() => drawerBackdrop.classList.remove('opacity-0'), 10);
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        if (!drawer || !drawerBackdrop) return;
        drawer.classList.remove('open');
        drawerBackdrop.classList.add('opacity-0');
        setTimeout(() => {
            drawerBackdrop.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    drawerLinks.forEach((link) => {
        link.addEventListener('click', closeDrawer);
    });
}

/* -------------------------------------------------------------
 * 6. Interactive Modals (RSVP, Application, Hackathon, Community)
 * ------------------------------------------------------------- */
function initModals() {
    // Modal Selectors
    const rsvpModal = document.getElementById('rsvp-modal');
    const applyModal = document.getElementById('apply-modal');
    const hackathonModal = document.getElementById('hackathon-modal');
    const joinModal = document.getElementById('join-modal');
    const directoryModal = document.getElementById('directory-modal');

    // Open Modal Handlers
    document.querySelectorAll('[data-open-modal]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.dataset.openModal;
            const targetModal = document.getElementById(modalId);
            
            // If it's an RSVP button, customize the event title in the modal
            if (modalId === 'rsvp-modal' && btn.dataset.eventTitle) {
                const eventInput = document.getElementById('rsvp-event-name');
                const eventDisplay = document.getElementById('rsvp-event-display');
                if (eventInput) eventInput.value = btn.dataset.eventTitle;
                if (eventDisplay) eventDisplay.innerText = btn.dataset.eventTitle;
            }

            openModal(targetModal);
        });
    });

    // Close buttons
    document.querySelectorAll('.modal-close-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-container');
            closeModal(modal);
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-container').forEach((modal) => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Escape key closes open modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-container:not(.hidden)').forEach(closeModal);
        }
    });

    // Form Submissions with Toast
    setupForm('rsvp-form', 'RSVP Confirmed! See you at the session! 🎉', rsvpModal);
    setupForm('apply-form', 'Application Received! We will review your profile. 🚀', applyModal);
    setupForm('hackathon-form', 'Team Registered! Get ready to hack! 💻⚡', hackathonModal);
    setupForm('join-form', 'Welcome to GDG ITER Chapter! 🌟', joinModal);
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function setupForm(formId, successMessage, modalToClose) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerText : 'Submit';

        if (submitBtn) {
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;
        }

        setTimeout(() => {
            form.reset();
            if (submitBtn) {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
            closeModal(modalToClose);
            showToast(successMessage, 'success');
        }, 600);
    });
}

/* -------------------------------------------------------------
 * 7. Gallery Slider Controls
 * ------------------------------------------------------------- */
function initGalleryControls() {
    const prevBtn = document.getElementById('gallery-prev-btn');
    const nextBtn = document.getElementById('gallery-next-btn');
    const galleryGrid = document.getElementById('gallery-grid');

    if (!prevBtn || !nextBtn || !galleryGrid) return;

    const cards = Array.from(galleryGrid.children);
    let currentIndex = 0;

    nextBtn.addEventListener('click', () => {
        cards[currentIndex].classList.remove('ring-4', 'ring-blue-500');
        currentIndex = (currentIndex + 1) % cards.length;
        cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        cards[currentIndex].classList.add('ring-4', 'ring-blue-500');
        setTimeout(() => cards[currentIndex].classList.remove('ring-4', 'ring-blue-500'), 1200);
    });

    prevBtn.addEventListener('click', () => {
        cards[currentIndex].classList.remove('ring-4', 'ring-blue-500');
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        cards[currentIndex].classList.add('ring-4', 'ring-blue-500');
        setTimeout(() => cards[currentIndex].classList.remove('ring-4', 'ring-blue-500'), 1200);
    });
}

/* -------------------------------------------------------------
 * 8. High-Performance Toast Notification Engine
 * ------------------------------------------------------------- */
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'lucide:info';
    let iconColor = 'text-blue-400';
    if (type === 'success') {
        icon = 'lucide:check-circle-2';
        iconColor = 'text-emerald-400';
    } else if (type === 'error') {
        icon = 'lucide:alert-circle';
        iconColor = 'text-rose-400';
    }

    toast.innerHTML = `
        <iconify-icon icon="${icon}" class="${iconColor} text-xl"></iconify-icon>
        <span class="text-sm font-medium tracking-wide">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation in next tick
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto remove after 4.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }, 4500);
}

// Expose showToast globally for testing or embedded interactions
window.showToast = showToast;
