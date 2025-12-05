/**
 * Main JavaScript File
 * Handles: Navigation, Smooth Scrolling, Form Validation, Animations
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initNavigation();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
    initStickyCta();
    setCurrentYear();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Animate hamburger to X
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            document.body.style.overflow = 'hidden';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
            document.body.style.overflow = '';
        }
    });

    // Update active nav link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        const errors = validateForm(data);

        if (errors.length > 0) {
            e.preventDefault(); // Only prevent if there are errors
            showFormErrors(errors);
            return;
        }

        // If validation passes, let the form submit to Formspree
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    });

    /**
     * Validate form data
     */
    function validateForm(data) {
        const errors = [];

        if (!data.firstName || data.firstName.trim().length < 2) {
            errors.push({ field: 'firstName', message: 'Please enter your first name' });
        }

        if (!data.email || !isValidEmail(data.email)) {
            errors.push({ field: 'email', message: 'Please enter a valid email address' });
        }

        if (!data.phone || !isValidPhone(data.phone)) {
            errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
        }

        if (!data.service) {
            errors.push({ field: 'service', message: 'Please select a service' });
        }

        if (!data.message || data.message.trim().length < 10) {
            errors.push({ field: 'message', message: 'Please describe your issue (at least 10 characters)' });
        }

        return errors;
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        const name = field.name;
        const value = field.value;
        let isValid = true;
        let message = '';

        switch (name) {
            case 'firstName':
                if (!value || value.trim().length < 2) {
                    isValid = false;
                    message = 'Please enter your first name';
                }
                break;
            case 'email':
                if (!value || !isValidEmail(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                if (!value || !isValidPhone(value)) {
                    isValid = false;
                    message = 'Please enter a valid phone number';
                }
                break;
            case 'service':
                if (!value) {
                    isValid = false;
                    message = 'Please select a service';
                }
                break;
            case 'message':
                if (!value || value.trim().length < 10) {
                    isValid = false;
                    message = 'Please describe your issue';
                }
                break;
        }

        if (!isValid) {
            field.style.borderColor = '#ef4444';
            showFieldError(field, message);
        }

        return isValid;
    }

    /**
     * Show field error
     */
    function showFieldError(field, message) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Add new error
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
        errorEl.textContent = message;
        field.parentElement.appendChild(errorEl);
    }

    /**
     * Show form errors
     */
    function showFormErrors(errors) {
        errors.forEach(error => {
            const field = document.querySelector(`[name="${error.field}"]`);
            if (field) {
                field.style.borderColor = '#ef4444';
                showFieldError(field, error.message);
            }
        });
    }

    /**
     * Show success message
     */
    function showFormSuccess() {
        const form = document.getElementById('contactForm');

        // Create success message
        const successEl = document.createElement('div');
        successEl.className = 'form-success';
        successEl.style.cssText = `
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
        successEl.innerHTML = `
        <strong>Thank you!</strong><br>
        Your message has been sent. We'll get back to you within 24 hours.
    `;

        // Insert at top of form
        form.insertBefore(successEl, form.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
            successEl.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => successEl.remove(), 300);
        }, 5000);
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Phone validation
     */
    function isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    }
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll(
        '.service-card, .testimonial-card, .why-us__item, .about__image, .about__text, .service-areas__region'
    );

    // Add initial styles
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Header background on scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('header');

    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        }
    });
}

/**
 * Sticky Mobile CTA - Show/Hide based on scroll position
 */
function initStickyCta() {
    const stickyCta = document.getElementById('stickyCta');
    const hero = document.getElementById('home');

    if (!stickyCta || !hero) return;

    function toggleStickyCta() {
        const heroBottom = hero.offsetTop + hero.offsetHeight;

        if (window.scrollY > heroBottom) {
            stickyCta.classList.add('visible');
            document.body.classList.add('sticky-cta-active');
        } else {
            stickyCta.classList.remove('visible');
            document.body.classList.remove('sticky-cta-active');
        }
    }

    window.addEventListener('scroll', toggleStickyCta);
    toggleStickyCta(); // Check on load
}

/**
 * Set current year in footer
 */
function setCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/**
 * Add CSS animation keyframes dynamically
 */
(function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
})();
