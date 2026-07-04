document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.add('loaded');

    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    const navLinks = document.querySelectorAll('.nav-links a');
    const allNavLinks = [...navLinks, ...mobileLinks];

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const sections = document.querySelectorAll('section[id]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            allNavLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isActive);
            });
        });
    }, {
        threshold: 0.5,
        rootMargin: '-10% 0px -40% 0px'
    });

    sections.forEach(section => navObserver.observe(section));

    const revealItems = document.querySelectorAll('.section, .project-card, .skill-group, .about-card, .resume-wrap, .contact-wrap');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (!entry.isIntersecting) return;
            window.setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, reduceMotion ? 0 : index * 60);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));

    const toTop = document.getElementById('toTop');
    if (toTop) {
        window.addEventListener('scroll', () => {
            toTop.classList.toggle('show', window.scrollY > 500);
        });
    }

    const loader = document.querySelector('.page-loader');
    if (loader) {
        window.setTimeout(() => {
            loader.classList.add('is-hidden');
        }, reduceMotion ? 120 : 700);
    }

    const words = [
        'Full Stack Developer',
        'MERN Specialist',
        'React Developer',
        'Node.js Developer'
    ];
    const typewriter = document.getElementById('typewriterText');

    if (typewriter) {
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const tick = () => {
            const current = words[wordIndex];
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
            typewriter.textContent = current.slice(0, charIndex);

            let delay = isDeleting ? 45 : 85;

            if (!isDeleting && charIndex === current.length) {
                delay = 1200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 320;
            }

            window.setTimeout(tick, delay);
        };

        tick();
    }

    const orbitShell = document.querySelector('.orbit-shell');
    if (orbitShell && !reduceMotion) {
        orbitShell.addEventListener('pointermove', (event) => {
            const rect = orbitShell.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            orbitShell.style.transform = `perspective(1000px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
        });

        orbitShell.addEventListener('pointerleave', () => {
            orbitShell.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    const cards = document.querySelectorAll('.project-card');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (!reduceMotion && cursorDot && cursorRing) {
        const moveCursor = (event) => {
            cursorDot.style.left = `${event.clientX}px`;
            cursorDot.style.top = `${event.clientY}px`;
            cursorRing.style.left = `${event.clientX}px`;
            cursorRing.style.top = `${event.clientY}px`;
        };

        window.addEventListener('mousemove', moveCursor);

        document.querySelectorAll('a, button, .project-card, .tech, .icon-btn').forEach(element => {
            element.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovered'));
            element.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovered'));
        });
    }

    cards.forEach(card => {
        if (reduceMotion) return;

        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            card.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
            card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
            card.classList.add('is-tilting');
        });

        card.addEventListener('pointerleave', () => {
            card.classList.remove('is-tilting');
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    });

    const contactForm = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const fields = contactForm.querySelectorAll('input, textarea');
            let valid = true;

            fields.forEach(field => {
                const hasValue = field.value.trim() !== '';
                field.style.borderColor = hasValue ? 'rgba(255, 255, 255, 0.1)' : '#ff6a6a';
                if (!hasValue) valid = false;
            });

            if (!valid) {
                if (feedback) feedback.textContent = 'Please complete all fields before sending.';
                return;
            }

            const actionUrl = contactForm.getAttribute('action') || '';
            if (!actionUrl || actionUrl.includes('YOUR_FORM_ID')) {
                if (feedback) {
                    feedback.textContent = 'Formspree endpoint not set yet. Replace YOUR_FORM_ID in index.html to enable delivery.';
                }
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Submission failed');
                }

                if (feedback) feedback.textContent = 'Thanks! Your message has been sent.';
                contactForm.reset();
            } catch (error) {
                if (feedback) feedback.textContent = 'Could not send right now. Please try again in a moment.';
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }
});
