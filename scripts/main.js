document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен успешно!');

    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navList.classList.toggle('nav__list--open');
            this.setAttribute('aria-expanded', isOpen.toString());

            if (isOpen) {
                const firstLink = navList.querySelector('.nav__link');
                if (firstLink) firstLink.focus();
            }
        });

        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        navList.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('nav__list--open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        navList.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navList.classList.remove('nav__list--open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });

        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('nav__list--open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const modals = document.querySelectorAll('.modal');
    let lastFocusedElement = null;

    function getFocusableElements(modal) {
        return modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    function closeModal(modal) {
        modal.classList.remove('modal--open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }

        if (window.location.hash) {
            history.pushState(null, '', window.location.pathname + window.location.search);
        }
    }

    function openModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) {
            lastFocusedElement = document.activeElement;

            modal.classList.add('modal--open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            const closeBtn = modal.querySelector('.modal__close');
            if (closeBtn) {
                closeBtn.focus();
            }
        }
    }

    document.querySelectorAll('a[href^="#modal-"]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            openModal(modalId);
        });

        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const modalId = this.getAttribute('href');
                openModal(modalId);
            }
        });
    });

    modals.forEach(modal => {
        modal.setAttribute('aria-hidden', 'true');

        modal.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('modal__overlay')) {
                closeModal(this);
            }
        });

        modal.querySelectorAll('.modal__close, .modal__footer .btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal(modal);
            });
        });

        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = getFocusableElements(this);
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('modal--open')) {
                    closeModal(modal);
                }
            });
        }
    });

    if (window.location.hash.startsWith('#modal-')) {
        openModal(window.location.hash);
    }

    document.querySelectorAll('a[href^="#"]:not([href^="#modal-"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId === '#!') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .animate-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(animationStyle);

        document.querySelectorAll('.card, .skill, .diary-entry, .course-card').forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(el);
        });
    }

    const currentPageLink = document.querySelector('[aria-current="page"]');
    if (currentPageLink) {
        const pageTitle = currentPageLink.textContent.trim();
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = `Текущая страница: ${pageTitle}`;
        document.body.appendChild(announcement);

        setTimeout(() => announcement.remove(), 1000);
    }
});
