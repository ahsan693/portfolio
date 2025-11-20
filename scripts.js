// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile browser viewport height issues (addressing the 100vh problem)
    function setVhVariable() {
        // First we get the viewport height and multiply it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set the --vh variable initially
    setVhVariable();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setVhVariable);
    window.addEventListener('orientationchange', setVhVariable);
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out-sine',
        once: true,
        mirror: false
    });

    // Loading Screen
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    if (themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Skills Progress Animation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-bar-modern');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    // Start with width 0
                    bar.style.width = '0%';
                    // Then animate to the target width
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
                
                // Only trigger animation once
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    // Ensure progress bars have proper initial state
    document.querySelectorAll('.progress-bar-modern').forEach(bar => {
        // Set initial width to 0 for animation
        bar.style.width = '0%';
    });

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all fields');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
            submitBtn.style.background = '#28a745';
            
            setTimeout(() => {
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 3000);
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Active Navigation Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Fade in animation on scroll
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        fadeObserver.observe(el);
    });

    // Refresh AOS on window resize and handle responsive behavior
    window.addEventListener('resize', () => {
        AOS.refresh();
        
        // Handle responsive adjustments
        const viewportWidth = window.innerWidth;
        
        // Adjust portfolio items for better mobile layout
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        if (portfolioItems.length > 0) {
            if (viewportWidth <= 576) {
                portfolioItems.forEach(item => {
                    // Ensure overlay content is sized properly for small screens
                    const overlay = item.querySelector('.portfolio-overlay');
                    if (overlay) {
                        overlay.style.padding = '1rem';
                    }
                });
            } else {
                portfolioItems.forEach(item => {
                    const overlay = item.querySelector('.portfolio-overlay');
                    if (overlay) {
                        overlay.style.padding = '';
                    }
                });
            }
        }
        
        // Adjust hero content height for different screen sizes
        const hero = document.querySelector('.hero');
        if (hero) {
            if (viewportWidth <= 576) {
                // Use smaller height on mobile to avoid too much scrolling
                hero.style.minHeight = '90vh';
            } else {
                hero.style.minHeight = '100vh';
            }
        }
    });
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        // Disable animations for users who prefer reduced motion
        document.querySelectorAll('.floating').forEach(el => {
            el.classList.remove('floating');
        });
        
        // Update AOS settings
        AOS.init({
            disable: true
        });
    }
    
    // Function to detect high-contrast mode and adjust styles
    function checkHighContrast() {
        // Test for high contrast mode (this is a simple approximation)
        const testElement = document.createElement('div');
        testElement.style.color = 'red';
        testElement.style.backgroundColor = 'red';
        testElement.style.position = 'absolute';
        testElement.style.top = '-999px';
        testElement.style.width = '1px';
        testElement.style.height = '1px';
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const highContrast = computedStyle.backgroundColor !== computedStyle.color;
        
        document.body.removeChild(testElement);
        
        if (highContrast) {
            // Add a class to the body to enable high contrast styles
            document.body.classList.add('high-contrast');
        }
    }
    
    // Check high contrast mode
    checkHighContrast();
});
